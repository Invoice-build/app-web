import Web3 from 'web3'

export default {
  methods: {
    async getBrowserProvider () {
      this.browserProvider = new Web3(Web3.givenProvider)
      const [address] = await this.browserProvider.eth.getAccounts()
      this.address = address
    },

    listenForNetworkChange () {
      window.ethereum.on('chainChanged', chainId => {
        window.location.reload()
      })
    },

    listenForAccountChange () {
      window.ethereum.on('accountsChanged', accounts => {
        this.address = accounts[0]
        if (!this.address) this.disconnect()
      })
    },

    async connectBrowser () {
      if (this.hasBrowserProvider) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        await this.getBrowserProvider()
        this.closeDialog()
      } else {
        this.error = 'Browser provider not found.'
      }
    }
  }
}
