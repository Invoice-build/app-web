import Base from './base'

export default class Utils extends Base {
  unitsFromDecimals (decimals) {
    const unitValue = (1 * 10 ** decimals).toString()
    const unitMap = this.web3.utils.unitMap
    return Object.keys(unitMap).find(k => unitMap[k] === unitValue)
  }
}
