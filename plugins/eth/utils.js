export default class Address {
  constructor ({ web3 }) {
    this.web3 = web3
  }

  unitsFromDecimals (decimals) {
    const unitValue = (1 * 10 ** decimals).toString()
    const unitMap = this.web3.utils.unitMap
    return Object.keys(unitMap).find(k => unitMap[k] === unitValue)
  }
}
