<template>
  <div class="py-0 md:py-16">
    <div class="invoice-container mx-auto">
      <invoice-form :invoice="invoice" :editable="true" @saved="successHandler" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CryptoJS from 'crypto-js'
import InvoiceForm from '~/components/forms/InvoiceForm.vue'

export default {
  components: {
    InvoiceForm
  },

  data () {
    return {
      editable: true,
      prefillHash: '',
      invoice: {
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
      tokens: state => state.tokens.all
    })
  },

  beforeMount () {
    this.parsePrefill()
    this.parseToken()
  },

  methods: {
    successHandler (invoice) {
      window.fathom.trackGoal('F7GYUN9K', 0)
      this.$router.push(this.localePath(`/invoices/${invoice.id}`))
    },

    parsePrefill () {
      try {
        this.prefillHash = decodeURI(this.$route.query.prefill)
        if (this.prefillHash !== 'undefined') {
          const bytes = CryptoJS.AES.decrypt(this.prefillHash, 'invoice.build')
          const prefillData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          this.invoice = Object.assign({}, this.invoice, prefillData)
        }
      } catch (error) {
        console.error(error)
      }
    },

    parseToken () {
      try {
        if (this.$route.query.token) {
          const token = this.tokens.find(token => token.code === this.$route.query.token)
          this.invoice.token_id = token ? token.id : null
        }
      } catch (error) {
        console.error(error)
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
