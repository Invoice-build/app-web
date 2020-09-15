export default class Contract {
  constructor ({ web3 }) {
    this.web3 = web3
  }

  getInstance (abi, address, { options = {} } = {}) {
    return new this.web3.eth.Contract(abi, address, { ...options })
  }

  abiFromStandard (standard) {
    const json = require(`~/lib/contracts/abis/${standard}.json`)
    return json.abi
  }
}
