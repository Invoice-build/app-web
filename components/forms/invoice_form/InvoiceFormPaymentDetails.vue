<template>
  <div class="mt-12">
    <div class="border-b border-gray-300">
      <h2 class="text-xl font-medium text-gray-600">
        {{ $t('labels.payment_details') }}
      </h2>
    </div>
    <div class="mt-4 flex flex-wrap md:flex-no-wrap items-start">
      <div class="w-full md:w-1/3">
        <h3 class="mr-2 text-gray-500">
          {{ $t('labels.recipient') }}:
        </h3>
      </div>
      <div class="w-full pt-px">
        <div class="flex w-full">
          <base-text-input
            ref="paymentAddressInput"
            v-model="paymentAddressInput"
            name="paymentAddress"
            placeholder="Ethereum address or ENS name..."
            :rules="[isRequired()]"
            :disabled="!editable"
            :mb="0"
            validate-on="none"
            absolute-error
            required
            :class="['flex-1', { 'border-b-2 border-green-200': !editable }]"
          />
          <base-btn
            v-if="!!value.payment_address"
            tag="a"
            icon="fas fa-external-link-square-alt"
            color="gray"
            size="sm"
            class="ml-2"
            flat
            circle
            :href="$eth.link.address(value.payment_address, { network: value.network })"
            target="_blank"
            rel="noreferrer"
          />
        </div>
        <p class="absolute text-xs text-gray-400">
          {{ paymentAddressHint }}
        </p>
      </div>
    </div>
    <div class="flex mt-6">
      <div class="w-1/3">
        <h3 class="mr-2 text-gray-500">
          {{ $t('labels.network') }}:
        </h3>
      </div>
      <div class="flex w-full">
        <base-select
          v-model="value.network"
          :options="$t('options.networks')"
          :rules="[isRequired()]"
          :disabled="!editable"
          required
          autogrow
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isRequired, isEthAddrCheck } from '~/lib/validations'

export default {
  name: 'InvoiceFormPaymentDetails',

  props: {
    value: { type: Object, required: true },
    editable: { type: Boolean, required: true },
    invalidAddress: { type: Boolean, default: false }
  },

  data () {
    return {
      paymentAddressInput: '',
      paymentAddressHint: ''
    }
  },

  watch: {
    async paymentAddressInput (newVal) {
      this.$refs.paymentAddressInput.errors = []
      if (!isEthAddrCheck(newVal)) {
        const address = await this.$eth.ens().addressFor(newVal)
        this.value.payment_address = (address === this.$eth.defaults.genesis) ? '' : address
        this.paymentAddressHint = this.value.payment_address
      } else {
        this.value.payment_address = newVal
        this.paymentAddressHint = await this.$eth.ens().nameFor(newVal)
      }
      this.$emit('change', this.value)
    },

    invalidAddress (isInvalid) {
      if (isInvalid) this.$refs.paymentAddressInput.errors.push('Must be a valid Ethereum address')
    }
  },

  beforeMount () {
    this.setPaymentAddress()
  },

  methods: {
    isRequired,

    async setPaymentAddress () {
      try {
        if (this.value.payment_address) {
          this.paymentAddressInput = this.value.payment_address
          const name = await this.$eth.ens().nameFor(this.value.payment_address)
          if (name) {
            this.paymentAddressInput = name
            this.paymentAddressHint = this.value.payment_address
          } else {
            this.paymentAddressInput = this.value.payment_address
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
