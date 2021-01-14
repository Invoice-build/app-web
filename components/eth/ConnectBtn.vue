<template>
  <div class="w-full">
    <div
      v-if="connected"
      class="flex justify-center items-center border rounded py-2 cursor-pointer"
      @click="dialog = true"
    >
      <eth-address :address="address" />
    </div>
    <base-btn
      v-else
      :disabled="connecting"
      :loading="connecting"
      loading-label="Connecting"
      block
      @click="dialog = true"
    >
      Connect
    </base-btn>
    <wallet-dialog
      title="Connect Wallet"
      :show="dialog"
      @close="closeDialog"
      @clicked="connect"
    />
  </div>
</template>

<script>
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import EthAddress from './EthAddress.vue'
import WalletDialog from './WalletDialog.vue'
import browserConnect from '~/lib/mixins/browserConnect'
import walletConnect from '~/lib/mixins/walletConnect'

export default {
  name: 'Connect',

  components: {
    EthAddress,
    WalletDialog
  },

  mixins: [browserConnect, walletConnect],

  data () {
    return {
      connecting: true,
      address: '',
      dialog: false,
      error: '',
      browserProvider: null,
      walletConnect: {
        connector: new WalletConnect({
          bridge: 'https://bridge.walletconnect.org',
          qrcodeModal: QRCodeModal
        })
      }
    }
  },

  computed: {
    hasBrowserProvider () {
      return typeof window.ethereum !== 'undefined'
    },

    connected () {
      return !!this.address // || wallet connect is connected
    }
  },

  async mounted () {
    try {
      if (this.walletConnect.connector.connected) this.walletConnect.connector.killSession()
      this.addWalletConnectListeners()
      if (this.hasBrowserProvider) {
        await this.getBrowserProvider()
        this.listenForAccountChange()
        this.listenForNetworkChange()
      }
    } catch (error) {
      console.error(error.message)
    } finally {
      this.connecting = false
    }
  },

  beforeDestroy () {
    this.walletConnect.connector.killSession()
  },

  methods: {
    connect (wallet) {
      this.connecting = true
      try {
        switch (wallet) {
          case 'walletConnect':
            this.connectWalletConnect()
            break
          default:
            this.connectBrowser()
            break
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.connecting = false
      }
    },

    disconnect () {
      this.address = ''
      this.browserProvider = null
      this.walletConnect.connector.killSession()
    },

    closeDialog () {
      this.error = ''
      this.dialog = false
    }
  }
}
</script>
