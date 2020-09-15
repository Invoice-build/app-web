<template>
  <tr>
    <td :class="['text-left p-2', { 'bg-orange-100': (rowIndex === 0 && !item.description) }]">
      <base-text-input
        v-model="item.description"
        placeholder="Item details..."
        :required="rowIndex == 0"
        :rules="rowIndex == 0 ? [isRequired()] : []"
        :disabled="!editable"
        :mb="0"
        absolute-error
      />
    </td>
    <td :class="['text-right p-2', { 'bg-orange-100': (rowIndex === 0 && !item.quantity) }]">
      <base-text-input
        v-model="item.quantity"
        placeholder="e.g. 1   "
        :required="rowIndex == 0"
        :rules="quantityRules"
        :disabled="!editable"
        :mb="0"
        absolute-error
        align-right
      />
    </td>
    <td :class="['text-left p-2', { 'bg-orange-100': (rowIndex === 0 && !item.quantity_type) }]">
      <base-select
        v-model="item.quantity_type"
        :options="quantityTypes"
        placeholder="Choose..."
        :required="rowIndex == 0"
        :rules="rowIndex == 0 ? [isRequired()] : []"
        :disabled="!editable"
        :mb="0"
        absolute-error
        class="w-32"
      />
    </td>
    <td :class="['text-right p-2', { 'bg-orange-100': (rowIndex === 0 && !item.unit_price) }]">
      <base-text-input
        v-model="item.unit_price"
        placeholder="Price/unit...   "
        :required="rowIndex == 0"
        :rules="unitPriceRules"
        :disabled="!editable"
        align-right
        absolute-error
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
      const rules = [isNumber(), isLessThanOrEqualTo(this.maxQuantity), maxDecimals(1), isPositive()]
      if (this.rowIndex === 0) rules.unshift(isRequired())
      return rules
    },

    unitPriceRules () {
      const rules = [isNumber(), isLessThanOrEqualTo(this.maxUnitPrice), maxDecimals(6), isPositive()]
      if (this.rowIndex === 0) rules.unshift(isRequired())
      return rules
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
