<template>
  <tr>
    <td :class="['text-left p-2', { 'bg-orange-100': (rowIndex % 2 == 0 && !item.description) }]">
      <base-text-input
        v-model="item.description"
        placeholder="Item details..."
        :rules="[isRequired()]"
        :disabled="!editable"
        :mb="0"
        required
        absolute-error
      />
    </td>
    <td :class="['text-right p-2', { 'bg-orange-100': (rowIndex % 2 == 0 && !item.quantity) }]">
      <base-text-input
        v-model="item.quantity"
        placeholder="e.g. 1   "
        :rules="quantityRules"
        :disabled="!editable"
        :mb="0"
        absolute-error
        align-right
        required
      />
    </td>
    <td :class="['text-left p-2', { 'bg-orange-100': (rowIndex % 2 == 0 && !item.quantity_type) }]">
      <base-select
        v-model="item.quantity_type"
        :options="quantityTypes"
        placeholder="Choose..."
        :rules="[isRequired()]"
        :disabled="!editable"
        :mb="0"
        absolute-error
        required
        class="w-32"
      />
    </td>
    <td :class="['text-right p-2', { 'bg-orange-100': (rowIndex % 2 == 0 && !item.unit_price) }]">
      <base-text-input
        v-model="item.unit_price"
        placeholder="Price/unit...   "
        :rules="unitPriceRules"
        :disabled="!editable"
        align-right
        absolute-error
        required
        :mb="0"
      />
    </td>
    <td class="text-right p-2">
      {{ amountFor(item) | money }}
    </td>
  </tr>
</template>

<script>
import { isRequired, isNumber, isLessThanOrEqualTo, maxDecimals, isPositive } from '~/lib/validations'

export default {
  name: 'LineItemsRow',

  props: {
    item: { type: Object, required: true },
    editable: { type: Boolean, required: true }
  },

  data () {
    return {
      maxUnitPrice: 1e6,
      maxQuantity: 1e4
    }
  },

  computed: {
    quantityTypes () {
      const quantityTypeMap = this.$t('options.line_item_quantity_types')
      return Object.keys(quantityTypeMap).map(k => ({ text: quantityTypeMap[k], value: k }))
    },

    rowIndex () {
      return this.$vnode.key
    },

    quantityRules () {
      return [isRequired(), isNumber(), isLessThanOrEqualTo(this.maxQuantity), maxDecimals(1), isPositive()]
    },

    unitPriceRules () {
      return [isRequired(), isNumber(), isLessThanOrEqualTo(this.maxUnitPrice), maxDecimals(6), isPositive()]
    }
  },

  methods: {
    isRequired,
    isNumber,
    isLessThanOrEqualTo,
    maxDecimals,

    amountFor (item) {
      return item.quantity * item.unit_price || 0
    }
  }
}
</script>
