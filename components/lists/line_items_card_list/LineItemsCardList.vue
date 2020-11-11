<template>
  <div>
    <line-item-card
      v-for="(item, i) in value"
      :key="i"
      v-model="value[i]"
      :currency-code="currencyCode"
      :editable="editable"
      class="mt-2"
      @change="(newItem) => { value[i] = newItem }"
    />
    <div v-if="editable" class="flex -mx-2 mt-2">
      <div :class="['blank-slate pt-2 mx-2', (value.length === 1 ? 'w-full' : 'w-1/2 md:w-2/3')]" @click="value.push({})">
        <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-green-500 hover:border-green-500 text-sm">
          <base-icon name="fas fa-plus" />
          <span class="ml-2">
            {{ $t('labels.line_item') }}
          </span>
        </div>
      </div>
      <div v-if="value.length > 1" class="blank-slate pt-2 w-1/2 md:w-1/3 mx-2" @click="value.pop()">
        <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-red-500 hover:border-red-500 text-sm">
          <base-icon name="fas fa-minus" />
          <span class="ml-2">
            {{ $t('labels.line_item') }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <div class="text-right p-2 pt-8">
        {{ $t('labels.subtotal') }}
        <span class="text-xs">({{ currencyCode }})</span>
      </div>
      <div class="text-right p-2 pt-8">
        {{ subtotal | money }}
      </div>
    </div>
    <div class="flex justify-end">
      <div class="text-right p-2">
        <div class="flex justify-end items-center">
          <span class="mr-2">{{ $t('labels.tax') }}</span>
          <base-text-input
            v-model="taxPercentage"
            :rules="taxRules"
            type="number"
            placeholder="0"
            align-right
            :mb="0"
            absolute-error
            :disabled="!editable"
            class="w-8"
          />
          <span class="text-xs">% ({{ currencyCode }})</span>
        </div>
      </div>
      <div class="text-right p-2">
        {{ taxAmount | money }}
      </div>
    </div>
    <div class="flex justify-end">
      <div class="text-right p-2 text-2xl font-bold">
        {{ $t('labels.total') }}
        <span class="text-xs">({{ currencyCode }})</span>
      </div>
      <div class="text-right p-2 text-2xl font-bold">
        {{ total | money }}
      </div>
    </div>
    <div v-if="invoice.paid_amount > 0" class="flex justify-end">
      <div class="text-right p-2 text-2xl font-bold">
        {{ $t('labels.paid') }}
        <span class="text-xs">({{ currencyCode }})</span>
      </div>
      <div class="text-right p-2 text-2xl font-bold">
        {{ invoice.paid_amount | money }}
      </div>
    </div>
  </div>
</template>

<script>
import LineItemCard from './LineItemCard.vue'
import { isNumber, isLessThanOrEqualTo, isInt, isPositive } from '~/lib/validations'

export default {
  name: 'LineItemsCardList',

  components: {
    LineItemCard
  },

  props: {
    value: { type: Array, required: true },
    invoice: { type: Object, required: true },
    currencyCode: { type: String, required: true },
    editable: { type: Boolean, required: true }
  },

  data () {
    return {
      taxPercentage: 0,
      taxBps: 0,
      taxRules: [isNumber(), isLessThanOrEqualTo(100), isInt(), isPositive()]
    }
  },

  computed: {
    subtotal () {
      return this.value.map(item => this.amountFor(item)).reduce((a, b) => a + b) || 0
    },

    taxAmount () {
      return this.subtotal * (this.taxBps / 10000)
    },

    total () {
      return this.subtotal + this.taxAmount
    }
  },

  watch: {
    value: {
      handler (newVal) {
        this.$emit('change', newVal)
      },
      deep: true
    },

    taxPercentage (newVal) {
      this.taxBps = newVal * 100
    },

    taxBps (newVal) {
      this.$emit('tax-change', newVal)
    }
  },

  beforeMount () {
    this.taxBps = this.invoice.tax_bps
  },

  methods: {
    amountFor (item) {
      return item.quantity * item.unit_price || 0
    }
  }
}
</script>
