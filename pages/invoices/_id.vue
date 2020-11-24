<template>
  <div>
    <div v-if="passwordLocked" class="mx-auto px-4 pt-20 md:pt-16 w-full md:w-1/2">
      <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 absolute top-0 left-0 ml-4 mt-4">
        <i :class="[lockIcon, 'text-gray-600 text-xl']" />
      </div>
      <h2 class="text-4xl mb-4">
        {{ $t('labels.private_invoice') }}
      </h2>
      <invoice-password-form :id="id" @success="unlockHandler" />
    </div>
    <div v-else class="py-0 md:py-16">
      <div class="invoice-container mx-auto">
        <div v-if="!editable && invoice.encrypted" class="bg-gray-100 flex items-center p-4 rounded">
          <div class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300">
            <i class="fas fa-lock text-gray-500" />
          </div>
          <span class="text-gray-600 text-sm pl-4">
            {{ $t('labels.encrypted_e2e') }}
          </span>
        </div>
        <invoice-form
          v-if="!loading"
          :invoice="invoice"
          :transactions="transactions"
          :editable="editable"
          @saved="invoiceSavedHandler"
          @signed-tx="pollForConfirmation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import InvoiceForm from '~/components/forms/InvoiceForm.vue'
import InvoicePasswordForm from '~/components/forms/InvoicePasswordForm.vue'

export default {
  components: {
    InvoiceForm,
    InvoicePasswordForm
  },

  data () {
    return {
      loading: true,
      editable: false,
      passwordLocked: false,
      lockIcon: 'fas fa-lock'
    }
  },

  computed: {
    ...mapState({
      invoice: state => state.invoices.current,
      transactions: state => state.invoices.eth_transactions.all
    }),

    ...mapGetters({
      hasPendingTx: 'invoices/eth_transactions/hasPending',
      pendingTx: 'invoices/eth_transactions/pending'
    }),

    id () {
      return this.$route.params.id
    }
  },

  async beforeMount () {
    try {
      await this.get(this.id)
      await this.fetchTransactions()
    } catch (error) {
      switch (error.status) {
        case 401:
          this.passwordLocked = true
          break
        default:
          console.error(error)
          break
      }
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions({
      get: 'invoices/get',
      getEncrypted: 'invoices/getEncrypted',
      getTransactions: 'invoices/eth_transactions/getAll',
      getTransaction: 'invoices/eth_transactions/get'
    }),

    invoiceSavedHandler () {
      this.editable = false
    },

    async unlockHandler () {
      this.fetchTransactions()
      this.lockIcon = 'fas fa-lock-open'
      await this.$utils.sleep(1000)
      this.passwordLocked = false
    },

    async fetchTransactions () {
      try {
        await this.getTransactions(this.id)
        if (this.hasPendingTx) this.pollForConfirmation()
      } catch (error) {
        console.error(error)
      }
    },

    pollForConfirmation () {
      this.$utils.poll(this.checkForTxConfirmation, {
        params: [this.pendingTx.id],
        timeout: 10 * 60000,
        interval: 10000
      })
    },

    async checkForTxConfirmation (txId) {
      try {
        await this.getTransaction({ invoiceId: this.id, txId })
        if (!this.hasPendingTx) {
          this.invoice.encrypted ? await this.getEncrypted(this.id) : await this.get(this.id)
        }
        return !this.hasPendingTx
      } catch (error) {
        console.error(error)
        return false
      }
    }
  }
}
</script>

<style lang="css" scoped>
.invoice-container {
  max-width: 800px;
}
</style>
