import ENS, { getEnsAddress } from '@ensdomains/ensjs'

function ensInstance (provider) {
  return new ENS({ provider, ensAddress: getEnsAddress('1') })
}

export async function addressFor (name, provider) {
  const ens = ensInstance(provider)
  return await ens.name(name).getAddress()
}

export async function nameFor (address, provider) {
  const ens = ensInstance(provider)
  const { name } = await ens.getName(address)
  if (address !== await ens.name(name).getAddress()) return null
  return name
}
