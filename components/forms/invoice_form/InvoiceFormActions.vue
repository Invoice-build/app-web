<template>
  <div class="mt-12">
    <a
      v-if="editable"
      href=""
      class="text-xs text-gray-500 hover:text-blue-500"
      @click.prevent="prefillDialog = true"
    >
      {{ $t('actions.share_prefilled_invoice') }}
    </a>
    <base-btn
      v-if="editable"
      type="submit"
      :color="submitError ? 'red' : 'black'"
      :loading="submitting"
      :loading-label="`${$t('labels.creating')}...`"
      :disabled="submitting || submitError"
      block
    >
      <span v-if="submitError">
        {{ error }}
      </span>
      <span v-else>
        {{ invoice.id ? $t('actions.save_this_invoice') : $t('actions.create_this_invoice') }}
      </span>
    </base-btn>
    <div v-else>
      <base-btn
        v-if="invoice.paid"
        disabled
        block
        size="lg"
      >
        {{ $t('labels.paid') }}!
      </base-btn>
      <base-btn
        v-else
        :loading="submitting || hasPendingTx"
        :loading-label="paymentLoadingLabel"
        :disabled="submitting || hasPendingTx"
        block
        size="lg"
        @click="paymentDialog = true"
      >
        {{ $t('actions.pay_this_invoice') }}
      </base-btn>
    </div>

    <payment-dialog
      v-if="!editable"
      :show="paymentDialog"
      :invoice="invoice"
      @close="paymentDialog = false"
      @success="paymentDialog = false; $emit('signed-tx')"
    />
    <no-ssr>
      <prefill-dialog
        :show="prefillDialog"
        :url="`https://${$config.APP_DOMAIN}?prefill=${prefillHash}`"
        @close="prefillDialog = false"
      />
    </no-ssr>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import PaymentDialog from '~/components/dialogs/PaymentDialog.vue'
import PrefillDialog from '~/components/dialogs/PrefillDialog.vue'

export default {
  name: 'InvoiceFormActions',

  components: {
    PaymentDialog,
    PrefillDialog
  },

  props: {
    invoice: { type: Object, required: true },
    editable: { type: Boolean, required: true },
    submitting: { type: Boolean, required: true },
    submitError: { type: Boolean, required: true },
    error: { type: String, default: '' }
  },

  data () {
    return {
      prefillHash: '',
      paymentDialog: false,
      prefillDialog: false
    }
  },

  watch: {
    invoice: {
      handler (newInvoice) {
        this.generatePrefillHash(newInvoice)
      },
      deep: true
    }
  },

  beforeMount () {
    this.generatePrefillHash(this.invoice)
  },

  methods: {
    generatePrefillHash (invoice) {
      const hash = CryptoJS.AES.encrypt(JSON.stringify(invoice), 'invoice.build').toString()
      this.prefillHash = encodeURIComponent(hash)
    }
  }
}
</script>