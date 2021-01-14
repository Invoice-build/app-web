import Web3 from 'web3'
import Base from './base'

export default class Address extends Base {
  async balance (address, { inWei = false } = {}) {
    const weiBalance = await this.web3.eth.getBalance(address)
    return inWei ? weiBalance : Web3.utils.fromWei(weiBalance)
  }

  areEqual (a1, a2) {
    return a1 && a2 && a1.toLowerCase() === a2.toLowerCase()
  }

  toMixedCase (address) {
    return Web3.utils.toChecksumAddress(address)
  }
}
