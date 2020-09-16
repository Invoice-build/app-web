<template>
  <base-form @submit="submit" ref="invoiceForm" class="bg-white w-full rounded-none md:rounded shadow-none md:shadow-lg">
    <div class="p-6">
      <div class="flex flex-col md:flex-row justify-between">
        <div>
          <div class="flex items-center text-3xl font-light text-gray-900">
            <token-select-input
              :tokens="tokens"
              :network="invoice_.network"
              :selected="selectedToken"
              @change="tokenChangeHandler"
              :disabled="!editable"
            />
            <h1 class="ml-3">
              {{ $t('labels.invoice') }}
            </h1>
            <span class="ml-2 text-gray-500">#</span>
            <base-text-input
              v-model="invoice_.number"
              placeholder="001"
              :rules="[isRequired()]"
              :disabled="!editable"
              required
              autofocus
              autogrow
              :mb="0"
              absolute-error
            />
          </div>

          <span v-if="!!invoice_.created_at" class="text-sm text-gray-500">
            {{ $t('labels.created') }} {{ invoice_.created_at | date }}
          </span>
          <div v-else class="flex mt-4">
            <div class="flex items-center text-xs text-gray-500">
              <div class="w-4 h-4 rounded bg-orange-200" />
              <span class="ml-2">
                {{ $t('labels.required') }}
              </span>
            </div>
            <div class="flex items-center text-xs text-gray-500 ml-4">
              <div class="w-4 h-4 rounded bg-gray-200" />
              <span class="ml-2">
                {{ $t('labels.optional') }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex mt-4 md:mt-0">
          <div class="font-medium text-gray-500 text-right mr-1 leading-tight">
            {{ (!editable && !invoice_.due_at) ? $t('labels.due_on_receipt') : $t('labels.due') }}
          </div>
          <div>
            <base-text-input
              v-if="editable || !!invoice_.due_at"
              v-model="invoice_.due_at"
              type="date"
              :disabled="!editable"
              autogrow
              :mb="0"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap mt-12 -mx-4">
        <div class="w-full md:w-1/2 px-4">
          <div class="border-b border-gray-300">
            <h2 class="font-medium text-gray-600">
              {{ $t('labels.from') }}
            </h2>
          </div>
          <contact-details :contact="invoice_.issuer_contact_attributes" :editable="editable" @change="handleFromChange" />
        </div>
        <div class="w-full md:w-1/2 px-4 mt-8 md:mt-0">
          <div class="border-b border-gray-300">
            <h2 class="font-medium text-gray-600">
              {{ $t('labels.to') }}
            </h2>
          </div>
          <contact-details :contact="invoice_.client_contact_attributes" :editable="editable" @change="handleToChange" />
        </div>
      </div>

      <div class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.summary') }}
          </h2>
        </div>
        <line-items-card-list
          v-if="$mq === 'sm'"
          :invoice="invoice_"
          :currency-code="selectedToken.code"
          :editable="editable"
          @line-item-change="summaryUpdateHandler"
          @tax-bps-change="taxBpsUpdateHandler"
        />
        <line-items-table
          v-else
          :invoice="invoice_"
          :currency-code="selectedToken.code"
          :editable="editable"
          @line-item-change="summaryUpdateHandler"
          @tax-bps-change="taxBpsUpdateHandler"
        />
      </div>

      <div v-if="editable || !!invoice_.description" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.information') }}
          </h2>
        </div>
        <div class="mt-4">
          <base-textarea
            v-model="invoice_.description"
            placeholder="Any additional information..."
            :disabled="!editable"
          />
        </div>
      </div>

      <div class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.payment_details') }}
          </h2>
        </div>
        <div class="mt-4 flex flex-wrap md:flex-no-wrap items-end">
          <div class="w-full md:w-1/4">
            <h3 class="mr-2 text-gray-500">{{ $t('labels.receiving_address') }}:</h3>
          </div>
          <div class="flex w-full">
            <base-text-input
              v-model="invoice_.payment_address"
              placeholder="Ethereum address..."
              :rules="[isRequired(), isEthAddr()]"
              :disabled="!editable"
              :mb="0"
              absolute-error
              required
              class="flex-1"
            />
            <base-btn
              v-if="!!invoice_.payment_address"
              tag="a"
              icon="fas fa-external-link-square-alt"
              color="gray"
              size="sm"
              class="ml-2"
              flat
              circle
              :href="$eth.link.address(invoice_.payment_address, { network: invoice_.network })"
              target="_blank"
              rel="noreferrer"
            />
          </div>
        </div>
        <div class="flex mt-3">
          <div class="w-1/4">
            <h3 class="mr-2 text-gray-500">{{ $t('labels.network') }}:</h3>
          </div>
          <div class="flex w-full">
            <base-select
              v-model="invoice_.network"
              :options="$t('options.networks')"
              :rules="[isRequired()]"
              :disabled="!editable"
              required
              autogrow
            />
          </div>
        </div>
      </div>

      <div v-if="editable" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.settings') }}
          </h2>
        </div>
        <div class="flex flex-wrap mt-4">
          <div class="w-full md:w-1/4">
            <h3 class="mr-2 text-gray-500">{{ $t('labels.password') }}:</h3>
          </div>
          <div class="w-full">
            <base-text-input
              v-model="invoice_.password"
              type="password"
              :placeholder="`${$t('labels.enter_password')}...`"
              :disabled="!editable"
              class="flex-1"
            />
            <p class="text-xs text-gray-400">
              {{ $t('hints.password') }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="hasTransactions" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.transactions') }}
          </h2>
        </div>
        <transaction-list :transactions="transactions" class="mt-4" />
      </div>

      <div class="mt-12">
        <a v-if="editable" href="" @click.prevent="prefillDialog = true" class="text-xs text-gray-500 hover:text-blue-500">
          {{ $t('actions.share_prefilled_invoice') }}
        </a>
        <base-btn type="submit" v-if="editable" :color="submitError ? 'red' : 'black'" :loading="submitting" :disabled="submitting || submitError" block>
          <span v-if="submitError">
            {{ error }}
          </span>
          <span v-else>
            {{ invoice_.id ? $t('actions.save_this_invoice') : $t('actions.create_this_invoice') }}
          </span>
        </base-btn>
        <div v-else>
          <base-btn
            v-if="invoice.paid"
            disabled
            block
            size="lg">
            {{ $t('labels.paid') }}!
          </base-btn>
          <base-btn
            v-else
            :loading="submitting || hasPendingTx"
            :disabled="submitting || hasPendingTx"
            block
            size="lg"
            @click="paymentDialog = true">
            {{ $t('actions.pay_this_invoice') }}
          </base-btn>
        </div>
      </div>
    </div>
    <payment-dialog
      :show="paymentDialog"
      :invoice="invoice"
      @close="paymentDialog = false"
      @success="paymentDialog = false; $emit('signed-tx')"
    />
    <no-ssr>
      <prefill-dialog
        :show="prefillDialog"
        @close="prefillDialog = false"
        :url="`https://${$config.APP_DOMAIN}?prefill=${prefillHash}`"
      />
    </no-ssr>
  </base-form>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapState, mapActions, mapGetters } from 'vuex'
import ContactDetails from '~/components/data/ContactDetails.vue'
import LineItemsTable from '~/components/tables/line_items_table/LineItemsTable.vue'
import LineItemsCardList from '~/components/lists/line_items_card_list/LineItemsCardList.vue'
import TokenSelectInput from '~/components/inputs/TokenSelectInput.vue'
import PaymentDialog from '~/components/dialogs/PaymentDialog.vue'
import TransactionList from '~/components/lists/transaction_list/TransactionList.vue'
import PrefillDialog from '~/components/dialogs/PrefillDialog.vue'
import { isRequired, isEthAddr } from '~/lib/validations'

export default {
  name: 'InvoiceForm',

  components: {
    ContactDetails,
    LineItemsTable,
    TokenSelectInput,
    PaymentDialog,
    TransactionList,
    LineItemsCardList,
    PrefillDialog
  },

  props: {
    editable: { type: Boolean, required: true },
    invoice: { type: Object, required: true },
    transactions: { type: Array, default: () => [] }
  },

  data () {
    return {
      prefillHash: '',
      submitting: false,
      invoice_: {},
      paymentDialog: false,
      prefillDialog: false,
      error: '',
      submitError: false
    }
  },

  computed: {
    ...mapState({
      tokens: state => state.tokens.all
    }),

    ...mapGetters({
      hasTransactions: 'invoices/eth_transactions/any',
      hasPendingTx: 'invoices/eth_transactions/hasPending'
    }),

    selectedToken () {
      return this.tokens.find(t => t.id === this.invoice_.token_id)
    }
  },

  watch: {
    invoice: {
      handler (newVal) {
        if (!this.editable) this.invoice_ = Object.assign({}, this.invoice)
      },
      deep: true
    },

    invoice_: {
      handler (newVal) {
        const hash = CryptoJS.AES.encrypt(JSON.stringify(newVal), 'invoice.build').toString()
        this.prefillHash = encodeURIComponent(hash)
      },
      deep: true
    }
  },

  beforeMount () {
    this.invoice_ = Object.assign({}, this.invoice)
    if (!this.invoice_.tax_bps) this.invoice_.tax_bps = 0
    if (!this.invoice_.token_id)
      this.invoice_.token_id = this.tokens.find(t => t.code === 'ETH').id
  },

  methods: {
    isRequired,
    isEthAddr,

    ...mapActions({
      create: 'invoices/create'
    }),

    async submit () {
      try {
        this.submitting = true
        if (!this.$refs.invoiceForm.validate()) throw new Error('Please check errors above')

        const invoice = await this.create(this.invoice_)
        this.$emit('saved', invoice)
      } catch (error) {
        this.handleSubmitError(error)
      } finally {
        this.submitting = false
      }
    },

    async handleSubmitError (error) {
      this.error = error.message
      this.submitError = true
      await this.$utils.sleep(2000)
      this.submitError = false
    },

    handleFromChange (newIssuer) {
      this.invoice_.issuer_contact_attributes = newIssuer
    },

    handleToChange (newClient) {
      this.invoice_.client_contact_attributes = newClient
    },

    summaryUpdateHandler (newLineItems) {
      this.invoice_.line_items_attributes = newLineItems
    },

    taxBpsUpdateHandler (newTaxBps) {
      this.invoice_.tax_bps = newTaxBps
    },

    tokenChangeHandler (newTokenId) {
      this.invoice_.token_id = newTokenId
    }
  }
}
</script>
