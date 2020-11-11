import axios from 'axios'
import BN from 'bignumber.js'
import Base from './base'

export default class Network extends Base {
  constructor (args) {
    super(args)
    this.supportedNetworks = [1, 3]
    this.networkMap = {
      1: 'mainnet',
      3: 'ropsten'
    }
    this.gasPriceUrl = 'https://www.etherchain.org/api/gasPriceOracle'
  }

  hasProvider () {
    return !!this.provider
  }

  async getBlockNumber () {
    return await this.web3.eth.getBlockNumber()
  }

  async getId () {
    const id = await this.web3.eth.net.getId()
    if (!this.supportedNetworks.includes(id)) throw new Error('Unsupported network, please use Mainnet or Ropsten.')
    return id
  }

  async currentName () {
    const id = await this.getId()
    return this.networkMap[id]
  }

  async gasPrice () {
    const { data: gasData } = await axios.get(this.gasPriceUrl)
    const bn = new BN(gasData.fast)
    return bn.shiftedBy(9).toString(10)
  }
}
