import Base from './base'

export default class Contract extends Base {
  getInstance (abi, address, { options = {} } = {}) {
    return new this.web3.eth.Contract(abi, address, { ...options })
  }

  abiFromStandard (standard) {
    const json = require(`~/lib/contracts/abis/${standard}.json`)
    return json.abi
  }
}
