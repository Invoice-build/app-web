import Web3 from 'web3'

export default class Base {
  constructor ({ infuraProjectId = 'xxx', network = 'mainnet', genesisAddress = '0x0000000000000000000000000000000000000000' } = {}) {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = window.ethereum
    } else if (!Web3.givenProvider) {
      this.provider = Web3.givenProvider
    } else {
      this.provider = new Web3.providers.WebsocketProvider(`wss://${network}.infura.io/ws/v3/${infuraProjectId}`)
    }
    this.web3 = new Web3(this.provider)
    this.genesisAddress = genesisAddress
  }
}
