import ENS, { getEnsAddress } from '@ensdomains/ensjs'

export default class Ens {
  constructor ({ provider }) {
    this.instance = new ENS({ provider, ensAddress: getEnsAddress('1') })
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
