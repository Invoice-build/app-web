<template>
  <div>
    <line-item-card
      v-for="(item, i) in lineItems_"
      :key="i"
      :item="item"
      :currency-code="currencyCode"
      :editable="editable"
      class="mt-2"
    />
    <div class="flex -mx-2 mt-2">
      <div :class="['blank-slate pt-2 mx-2', (lineItems_.length === 1 ? 'w-full' : 'w-2/3')]" @click="lineItems_.push({})">
        <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-green-500 hover:border-green-500 text-sm">
          <base-icon name="fas fa-plus" />
          <span class="ml-2">
            {{ $t('labels.line_item') }}
          </span>
        </div>
      </div>
      <div v-if="lineItems_.length > 1" class="blank-slate pt-2 w-1/3 mx-2" @click="lineItems_.pop()">
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
    invoice: { type: Object, required: true },
    currencyCode: { type: String, required: true },
    editable: { type: Boolean, required: true }
  },

  data () {
    return {
      taxPercentage: 0,
      lineItems_: [],
      taxBps_: 0,
      taxRules: [isNumber(), isLessThanOrEqualTo(100), isInt(), isPositive()]
    }
  },

  computed: {
    subtotal () {
      return this.lineItems_.map(item => this.amountFor(item)).reduce((a, b) => a + b) || 0
    },

    taxAmount () {
      return this.subtotal * (this.taxBps_ / 10000)
    },

    total () {
      return this.subtotal + this.taxAmount
    }
  },

  watch: {
    lineItems_: {
      handler (newVal) {
        this.$emit('line-item-change', newVal)
      },
      deep: true
    },

    taxPercentage (newVal) {
      this.taxBps_ = newVal * 100
    },

    taxBps_ (newVal) {
      this.$emit('tax-bps-change', newVal)
    }
  },

  beforeMount () {
    this.lineItems_ = this.invoice.line_items_attributes.map(lineItem => Object.assign({}, lineItem))
    this.taxBps_ = this.invoice.tax_bps
  },

  methods: {
    amountFor (item) {
      return item.quantity * item.unit_price || 0
    }
  }
}
</script>
