<template>
  <div>
    <table class="w-full table-auto">
      <thead>
        <tr>
          <th class="text-left font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.details') }}
          </th>
          <th class="text-right font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.quantity') }}
          </th>
          <th class="text-left font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.unit') }}
          </th>
          <th class="text-right font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.unit_price') }}
            <span class="text-xs">({{ currencyCode }})</span>
          </th>
          <th class="text-right font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.amount') }}
            <span class="text-xs">({{ currencyCode }})</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <line-items-row
          v-for="(item, i) in lineItems_"
          :key="i"
          :item="item"
          :editable="editable"
          :class="['bg-white odd:bg-gray-100']"
        />
        <line-items-action-row v-if="editable" :items="lineItems_" />
        <tr>
          <td class="text-right p-2 pt-8" colspan="4">
            {{ $t('labels.subtotal') }}
            <span class="text-xs">({{ currencyCode }})</span>
          </td>
          <td class="text-right p-2 pt-8">
            {{ subtotal | money }}
          </td>
        </tr>
        <tr>
          <td class="text-right p-2" colspan="4">
            <div class="flex justify-end items-center">
              <span>{{ $t('labels.tax') }}</span>
              <base-text-input
                v-model="taxPercentage"
                :rules="taxRules"
                type="number"
                placeholder="0"
                autogrow
                align-right
                :mb="0"
                absolute-error
                :disabled="!editable"
              />
              <span class="text-xs">% ({{ currencyCode }})</span>
            </div>
          </td>
          <td class="text-right p-2">
            {{ taxAmount | money }}
          </td>
        </tr>
        <tr>
          <td class="text-right p-2 text-2xl font-bold" colspan="4">
            {{ $t('labels.total') }}
            <span class="text-xs">({{ currencyCode }})</span>
          </td>
          <td class="text-right p-2 text-2xl font-bold">
            {{ total | money }}
          </td>
        </tr>
        <tr v-if="invoice.paid_amount > 0">
          <td class="text-right p-2 text-2xl font-bold" colspan="4">
            {{ $t('labels.paid') }}
            <span class="text-xs">({{ currencyCode }})</span>
          </td>
          <td class="text-right p-2 text-2xl font-bold">
            {{ invoice.paid_amount | money }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import LineItemsRow from './LineItemsRow.vue'
import LineItemsActionRow from './LineItemsActionRow.vue'
import { isNumber, isLessThanOrEqualTo, isInt, isPositive } from '~/lib/validations'

export default {
  name: 'LineItemsTable',

  components: {
    LineItemsRow,
    LineItemsActionRow
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

<style lang="css" scoped>
.blank-slate {
  transition: all .3s ease;
}
</style>
