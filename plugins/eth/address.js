import Web3 from 'web3'

export default class Address {
  constructor ({ web3 }) {
    this.web3 = web3
    this.genesis = '0x0000000000000000000000000000000000000000'
  }

  async balance (address, { inWei = false } = {}) {
    const weiBalance = await this.web3.eth.getBalance(address)
    return inWei ? weiBalance : Web3.utils.fromWei(weiBalance)
  }

  areEqual (a1, a2) {
    return a1 && a2 && a1.toLowerCase() === a2.toLowerCase()
  }
}
