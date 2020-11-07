<template>
  <base-dialog :show="show" @close="$emit('close'); error = ''">
    <base-card square class="w-full sm:w-2/3 md:w-2/5 lg:w-1/3 mx-auto rounded-t sm:rounded">
      <base-card-title v-if="!success" :title="$t('dialogs.payment.title')" />
      <transition name="success">
        <base-card-content v-if="success" class="flex flex-col justify-center items-center text-center">
          <div :class="['w-16 h-16 flex items-center justify-center rounded-full bg-green-200']">
            <i class="fas fa-signature text-green-500 text-3xl" />
          </div>
          <span class="text-2xl font-bold text-green-600 mt-4">
            {{ $t('dialogs.payment.signed.title') }}!
          </span>
          <span class="text-green-600 opacity-75 mb-2">
            {{ $t('dialogs.payment.signed.description') }}
          </span>
        </base-card-content>
      </transition>
      <base-card-content v-if="!success">
        <div v-if="!!error" class="border-red-500 bg-red-100 text-red-500 rounded p-4 mb-4">
          {{ error }}
        </div>
        <base-grid>
          <base-grid-item v-if="hasMetaMask" width="full" class="md:w-1/2">
            <div
              class="wallet-btn bg-gray-100 text-gray-700 py-8 flex flex-col items-center justify-end cursor-pointer rounded hover:bg-gray-200 hover:text-gray-800"
              @click="initMetaMaskTx"
            >
              <img :src="require('~/assets/images/wallets/metamask.svg')" alt="MetaMask logo" class="h-24 lg:h-32 w-auto">
              <span class="font-bold text-lg">
                {{ $t('labels.metamask') }}
              </span>
            </div>
          </base-grid-item>
          <base-grid-item width="full" class="md:w-1/2">
            <div
              class="wallet-btn h-full bg-gray-100 text-gray-700 py-8 flex flex-col items-center justify-end cursor-pointer rounded hover:bg-gray-200 hover:text-gray-800"
              @click="initWalletConnectTx"
            >
              <img :src="require('~/assets/images/wallets/walletconnect.svg')" alt="WalletConnect logo" class="h-16 lg:h-20 w-auto mb-6">
              <span class="font-bold text-lg">
                {{ $t('labels.walletconnect') }}
              </span>
            </div>
          </base-grid-item>
        </base-grid>
      </base-card-content>
    </base-card>
  </base-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

export default {
  name: 'PaymentDialog',

  props: {
    show: { type: Boolean, default: false },
    invoice: { type: Object, required: true }
  },

  data () {
    return {
      error: '',
      success: false,
      walletConnect: {
        connector: new WalletConnect({
          bridge: 'https://bridge.walletconnect.org',
          qrcodeModal: QRCodeModal
        }),
        accounts: [],
        network: ''
      }
    }
  },

  computed: {
    hasMetaMask () {
      return typeof window.ethereum !== 'undefined'
    }
  },

  watch: {
    show (newVal) {
      if (!newVal) this.success = false
    }
  },

  beforeMount () {
    if (this.walletConnect.connector.connected) this.walletConnect.connector.killSession()
    this.addWalletConnectListeners()
  },

  beforeDestroy () {
    this.walletConnect.connector.killSession()
  },

  methods: {
    ...mapActions({
      createTx: 'invoices/eth_transactions/create'
    }),

    async successHandler () {
      window.fathom.trackGoal('KYF4JT3A', 0)
      this.success = true
      await this.$utils.sleep(3000)
      this.$emit('success')
    },

    async initMetaMaskTx () {
      try {
        window.fathom.trackGoal('BCMLWFRH', 0)
        let network = await this.$eth.network.currentName()
        if (network !== this.invoice.network) throw new Error(`Please switch to ${this.invoice.network}`)

        const tx_hash = await this.$eth.transaction.send(
          (await this.$eth.account.fetch()),
          this.invoice.payment_address,
          this.invoice.total - this.invoice.paid_amount,
          this.invoice.token
        )

        network = await this.$eth.network.currentName()
        const eth_transaction = { reference: 'payment', network, tx_hash }
        await this.createTx({ invoiceId: this.invoice.id, eth_transaction })
        this.successHandler()
      } catch (error) {
        this.error = error.message
      }
    },

    initWalletConnectTx () {
      window.fathom.trackGoal('BCMLWFRH', 0)
      this.walletConnect.connector.connected
        ? this.sendWcTx()
        : this.walletConnect.connector.createSession()
    },

    async sendWcTx () {
      try {
        const tx = await this.$eth.transaction.walletConnectTxObject(
          this.walletConnect.accounts[0],
          this.invoice.payment_address,
          this.invoice.total - this.invoice.paid_amount,
          this.invoice.token
        )
        const tx_hash = await this.walletConnect.connector.sendTransaction(tx)
        const network = this.walletConnect.network
        const invoiceId = this.invoice.id
        const eth_transaction = { reference: 'payment', network, tx_hash }
        await this.createTx({ invoiceId, eth_transaction })
        this.successHandler()
      } catch (error) {
        this.error = error.message
        console.error(error)
      }
    },

    addWalletConnectListeners () {
      try {
        this.walletConnect.connector.on('connect', (error, payload) => {
          if (error) {
            this.error = error.message
            throw error
          }
          const { accounts, chainId } = payload.params[0]
          this.walletConnect.network = this.$eth.network.networkMap[chainId]
          this.walletConnect.accounts = accounts
          if (this.walletConnect.network !== this.invoice.network) throw new Error(`Please switch to ${this.invoice.network}`)
          this.sendWcTx()
        })

        this.walletConnect.connector.on('session_update', (error, payload) => {
          if (error) {
            this.error = error.message
            throw error
          }
          const { accounts, chainId } = payload.params[0]
          this.walletConnect.network = this.$eth.network.networkMap[chainId]
          this.walletConnect.accounts = accounts
          if (this.walletConnect.network !== this.invoice.network) throw new Error(`Please switch to ${this.invoice.network}`)
        })

        this.walletConnect.connector.on('disconnect', (error, payload) => {
          if (error) {
            this.error = error.message
            throw error
          }
        })
      } catch (error) {
        this.error = error.message
      }
    }
  }
}
</script>

<style lang="css">
.wallet-btn {
  transition: all .2s ease;
}

.success-enter-active {
  animation: success-in .4s;
}
.success-leave-active {
  animation: success-in .4s reverse;
}
@keyframes success-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
