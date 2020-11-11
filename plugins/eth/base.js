import Web3 from 'web3'

export default class Base {
  constructor ({ infuraProjectId = 'xxx', network = 'mainnet', genesisAddress = '0x0000000000000000000000000000000000000000' } = {}) {
    this.provider = (!Web3.givenProvider)
      ? new Web3.providers.WebsocketProvider(`wss://${network}.infura.io/ws/v3/${infuraProjectId}`)
      : Web3.givenProvider
    this.web3 = new Web3(this.provider)
    this.genesisAddress = genesisAddress
  }
}
