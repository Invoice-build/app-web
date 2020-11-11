<template>
  <base-form ref="invoiceForm" class="bg-white w-full rounded-none md:rounded shadow-none md:shadow-lg" @submit="submit">
    <div class="p-6">
      <invoice-form-header
        v-model="form"
        :editable="editable"
        @change="(newForm) => { form = newForm }"
      />

      <div class="flex flex-wrap mt-12 -mx-4">
        <div class="w-full md:w-1/2 px-4">
          <div class="border-b border-gray-300">
            <h2 class="font-medium text-gray-600">
              {{ $t('labels.from') }}
            </h2>
          </div>
          <contact-details
            v-model="form.issuer_contact_attributes"
            :editable="editable"
            @change="(newContact) => { form.issuer_contact_attributes = newContact }"
          />
        </div>
        <div class="w-full md:w-1/2 px-4 mt-8 md:mt-0">
          <div class="border-b border-gray-300">
            <h2 class="font-medium text-gray-600">
              {{ $t('labels.to') }}
            </h2>
          </div>
          <contact-details
            v-model="form.client_contact_attributes"
            :editable="editable"
            @change="(newContact) => { form.client_contact_attributes = newContact }"
          />
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
          v-model="form.line_items_attributes"
          :invoice="form"
          :currency-code="selectedToken.code"
          :editable="editable"
          @change="(newLineItems) => { form.line_items_attributes = newLineItems }"
          @tax-change="taxBpsUpdateHandler"
        />
        <line-items-table
          v-model="form.line_items_attributes"
          :invoice="form"
          :currency-code="selectedToken.code"
          :editable="editable"
          @change="(newLineItems) => { form.line_items_attributes = newLineItems }"
          @tax-change="taxChangeHandler"
        />
      </div>

      <div v-if="editable || !!form.description" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.information') }}
          </h2>
        </div>
        <div class="mt-4">
          <base-textarea
            v-model="form.description"
            :placeholder="$t('labels.any_additional_info')"
            :disabled="!editable"
          />
        </div>
      </div>

      <invoice-form-payment-details
        v-model="form"
        :editable="editable"
        :invalid-address="invalidPaymentAddress"
        @change="(newForm) => { form = newForm }"
      />

      <invoice-form-settings
        v-model="form"
        :editable="editable"
        @change="(newForm) => { form = newForm }"
      />

      <div v-if="hasTransactions" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.transactions') }}
          </h2>
        </div>
        <transaction-list :transactions="transactions" class="mt-4" />
      </div>

      <invoice-form-actions
        :invoice="form"
        :editable="editable"
        :submitting="submitting"
        :submit-error="submitError"
        :error="error"
      />
    </div>
  </base-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import InvoiceFormHeader from './invoice_form/InvoiceFormHeader.vue'
import InvoiceFormPaymentDetails from './invoice_form/InvoiceFormPaymentDetails.vue'
import InvoiceFormSettings from './invoice_form/InvoiceFormSettings.vue'
import InvoiceFormActions from './invoice_form/InvoiceFormActions.vue'
import ContactDetails from '~/components/data/ContactDetails.vue'
import LineItemsTable from '~/components/tables/line_items_table/LineItemsTable.vue'
import LineItemsCardList from '~/components/lists/line_items_card_list/LineItemsCardList.vue'
import TransactionList from '~/components/lists/transaction_list/TransactionList.vue'
import { isRequired, isEthAddrCheck } from '~/lib/validations'
import { mergeDeep } from '~/lib/utils'

export default {
  name: 'InvoiceForm',

  components: {
    InvoiceFormHeader,
    InvoiceFormPaymentDetails,
    InvoiceFormSettings,
    InvoiceFormActions,
    ContactDetails,
    LineItemsTable,
    LineItemsCardList,
    TransactionList
  },

  props: {
    editable: { type: Boolean, required: true },
    transactions: { type: Array, default: () => [] }
  },

  data () {
    return {
      submitting: false,
      submitError: false,
      invalidPaymentAddress: false,
      error: '',
      form: {
        number: null,
        token_id: null,
        due_at: null,
        description: null,
        tax_bps: 0,
        payment_address: null,
        network: 'mainnet',
        line_items_attributes: [{}],
        issuer_contact_attributes: {
          address_attributes: {}
        },
        client_contact_attributes: {
          address_attributes: {}
        }
      }
    }
  },

  computed: {
    ...mapState({
      invoice: state => state.invoices.current,
      tokens: state => state.tokens.all,
      provider: state => state.provider
    }),

    ...mapGetters({
      hasTransactions: 'invoices/eth_transactions/any',
      hasPendingTx: 'invoices/eth_transactions/hasPending'
    }),

    selectedToken () {
      return this.tokens.find(t => t.id === this.form.token_id)
    },

    paymentLoadingLabel () {
      if (this.hasPendingTx) return `${this.$t('labels.confirming')}...`
      return `${this.$t('labels.submitting')}...`
    }
  },

  watch: {
    invoice: {
      handler (newVal) {
        if (!this.editable) this.form = mergeDeep({}, this.form, this.invoice)
      },
      deep: true
    }
  },

  beforeMount () {
    this.form = mergeDeep({}, this.form, this.invoice)
    this.setDefaultToken()
    // if (!this.form.tax_bps) this.invoice_.tax_bps = 0
  },

  methods: {
    isRequired,

    ...mapActions({
      create: 'invoices/create'
    }),

    async submit () {
      try {
        this.submitting = true
        if (!this.isValidForm()) throw new Error('Please check errors above')

        const invoice = await this.create(this.form)
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

    isValidForm () {
      const validInputs = this.$refs.invoiceForm.validate()
      const validAddress = this.validatePaymentAddress()
      return validInputs && validAddress
    },

    validatePaymentAddress () {
      this.invalidPaymentAddress = false
      if (isEthAddrCheck(this.form.payment_address)) return true
      this.invalidPaymentAddress = true
      return false
    },

    taxChangeHandler (newTaxBps) {
      this.form.tax_bps = newTaxBps
    },

    setDefaultToken () {
      if (this.form.token_id) return
      this.form.token_id = this.tokens.find(token => token.code === 'ETH').id
    }
  }
}
</script>
