<template>
  <div>
    <table class="w-full table-auto">
      <thead>
        <tr>
          <th class="text-left font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.details') }}
          </th>
          <th class="text-right font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.units') }}
          </th>
          <th class="text-left font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.unit_type') }}
          </th>
          <th class="text-right font-medium py-4 px-2 whitespace-no-wrap">
            {{ $t('labels.price_per_unit') }}
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
          v-for="(item, i) in value"
          :key="i"
          v-model="value[i]"
          :editable="editable"
          :class="['bg-white odd:bg-gray-100']"
          @change="(newItem) => { value[i] = newItem }"
        />
        <tr v-if="editable">
          <td :colspan="value.length > 1 ? 3 : 5" class="blank-slate pt-2" @click="value.push({})">
            <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-green-500 hover:border-green-500 text-sm">
              <base-icon name="fas fa-plus" />
              <span class="ml-2">
                {{ $t('labels.line_item') }}
              </span>
            </div>
          </td>
          <td
            v-if="value.length > 1"
            :colspan="2"
            class="blank-slate pt-2"
            @click="value.pop()"
          >
            <div class="p-2 flex items-center justify-center bg-white border border-dashed border-gray-400 cursor-pointer text-gray-500 hover:text-red-500 hover:border-red-500 text-sm">
              <base-icon name="fas fa-minus" />
              <span class="ml-2">
                {{ $t('labels.line_item') }}
              </span>
            </div>
          </td>
        </tr>
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
              <span class="mr-2">{{ $t('labels.tax') }}</span>
              <div class="w-8">
                <base-text-input
                  v-model="taxPercentage"
                  :rules="taxRules"
                  type="number"
                  placeholder="0"
                  align-right
                  :mb="0"
                  absolute-error
                  :disabled="!editable"
                />
              </div>
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
import { isNumber, isLessThanOrEqualTo, isInt, isPositive } from '~/lib/validations'

export default {
  name: 'LineItemsTable',

  components: {
    LineItemsRow
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
      lineItems_: [],
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

<style lang="css" scoped>
.blank-slate {
  transition: all .3s ease;
}
</style>
