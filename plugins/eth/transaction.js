import Base from './base'
import Contract from './contract'
import Network from './network'
import Utils from './utils'

export default class Transaction extends Base {
  constructor (args) {
    super(args)
    this.contract = new Contract(args)
    this.network = new Network(args)
    this.utils = new Utils(args)
  }

  send (from, to, amount, token, { resolveOn = 'hash' } = {}) {
    if (token.address === this.genesisAddress) {
      return this.sendEth(from, to, amount, { resolveOn })
    } else {
      return this.sendToken(from, to, amount, token, { resolveOn })
    }
  }

  sendEth (from, to, amount, { resolveOn = 'hash' } = {}) {
    const value = this.web3.utils.toWei(amount.toString(), 'ether')

    const promise = new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction({ from, to, value })
        .on('transactionHash', hash => {
          console.log('Transaction Hash:', hash)
          if (resolveOn === 'hash') resolve(hash)
        })
        .on('receipt', receipt => {
          console.log('Receipt:', receipt)
          if (resolveOn === 'receipt') resolve(receipt)
        })
        .on('confirmation', (n, receipt) => {
          console.log(`Confirmation ${n}:`, receipt)
        })
        .on('error', error => {
          if (error.message.includes('User denied transaction signature')) {
            reject(new Error('Transaction rejected'))
          } else if (error.message.includes('gas too low')) {
            reject(new Error('Please add more gas'))
          } else {
            reject(new Error(error))
          }
        })
    })
    return promise
  }

  async sendToken (from, to, amount, token, { resolveOn = 'hash' } = {}) {
    const units = this.utils.unitsFromDecimals(token.decimals)
    const amountWei = this.web3.utils.toWei(amount.toString(), units)
    const tokenAbi = this.contract.abiFromStandard(token.standard)
    const contract = await this.contract.getInstance(tokenAbi, token.address)
    const gas = await contract.methods.transfer(to, amountWei).estimateGas({ from })

    const promise = new Promise((resolve, reject) => {
      contract.methods.transfer(to, amountWei).send({ from, gas })
        .on('transactionHash', hash => {
          console.log('Transaction Hash:', hash)
          if (resolveOn === 'hash') resolve(hash)
        })
        .on('receipt', receipt => {
          console.log('Receipt:', receipt)
          if (resolveOn === 'receipt') resolve(receipt)
        })
        .on('confirmation', (n, receipt) => {
          console.log(`Confirmation ${n}:`, receipt)
        })
        .on('error', error => {
          if (error.message.includes('User denied transaction signature')) {
            reject(new Error('Transaction rejected'))
          } else if (error.message.includes('gas too low')) {
            reject(new Error('Please add more gas'))
          } else {
            reject(new Error(error))
          }
        })
    })
    return promise
  }

  async walletConnectTxObject (from, to, amount, token) {
    const amountWei = this.web3.utils.toWei(amount.toString(), 'ether')
    const gasPrice = this.web3.utils.numberToHex((await this.network.gasPrice()))

    if (token.address === this.genesisAddress) {
      const value = this.web3.utils.numberToHex(amountWei)
      const data = '0x'
      const gas = this.web3.utils.numberToHex(21000)
      return { from, to, data, value, gas, gasPrice }
    } else {
      const value = '0x00'
      const tokenAbi = this.contract.abiFromStandard(token.standard)
      const contract = await this.contract.getInstance(tokenAbi, token.address)
      const gas = await contract.methods.transfer(to, amountWei).estimateGas({ from, gasPrice })
      const data = contract.methods.transfer(to, amountWei).encodeABI()
      to = token.address
      return { from, to, data, value, gas, gasPrice }
    }
  }
}
