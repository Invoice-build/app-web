import Web3 from 'web3'
import Network from './network'
import Account from './account'
import Address from './address'
import Contract from './contract'
import Link from './link'
import Transaction from './transaction'
import Utils from './utils'

export default (_, inject) => {
  const web3 = new Web3(Web3.givenProvider)
  const config = { web3, genesis: '0x0000000000000000000000000000000000000000' }

  inject('eth', {
    config,
    network: new Network(config),
    account: new Account(config),
    address: new Address(config),
    contract: new Contract(config),
    transaction: new Transaction(config),
    link: new Link(config),
    utils: new Utils(config)
  })
}
