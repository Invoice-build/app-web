import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import Base from './base'

export default class Ens extends Base {
  constructor (args) {
    super(args)
    this.instance = new ENS({
      provider: this.provider,
      ensAddress: getEnsAddress('1')
    })
  }

  async addressFor (name) {
    return await this.instance.name(name).getAddress()
  }

  async nameFor (address) {
    const { name } = await this.instance.getName(address)
    if (address !== await this.addressFor(name)) return null
    return name
  }
}
