export default {
  methods: {
    connectWalletConnect () {
      try {
        this.walletConnect.connector.killSession()
        this.walletConnect.connector.createSession()
      } catch (error) {
        this.error = error.message
      }
    },

    addWalletConnectListeners () {
      try {
        this.walletConnect.connector.on('connect', (error, payload) => {
          if (error) throw error
          const { accounts } = payload.params[0]
          this.address = accounts[0]
          this.closeDialog()
        })

        this.walletConnect.connector.on('session_update', (error, payload) => {
          if (error) throw error
          const { accounts } = payload.params[0]
          this.address = accounts[0]
        })

        this.walletConnect.connector.on('disconnect', (error, payload) => {
          if (error) throw error
          this.address = ''
        })
      } catch (error) {
        this.error = error.message
      }
    }
  }
}
