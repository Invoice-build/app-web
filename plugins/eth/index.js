import Link from './link'
import Ens from './ens'
import Network from './network'
import Account from './account'
import Address from './address'
import Contract from './contract'
import Transaction from './transaction'
import Utils from './utils'

export default ({ $config: { infuraProjectId } }, inject) => {
  const defaults = {
    network: 'mainnet',
    genesis: '0x0000000000000000000000000000000000000000'
  }

  inject('eth', {
    defaults,
    link: new Link(),
    ens: (network = defaults.network) => new Ens({ network, infuraProjectId }),
    network: (network = defaults.network) => new Network({ network, infuraProjectId }),
    account: (network = defaults.network) => new Account({ network, infuraProjectId }),
    address: (network = defaults.network) => new Address({ network, infuraProjectId }),
    contract: (network = defaults.network) => new Contract({ network, infuraProjectId }),
    transaction: (network = defaults.network) => new Transaction({ network, infuraProjectId }),
    utils: (network = defaults.network) => new Utils({ network, infuraProjectId })
  })
}
