<template>
  <base-card class="shadow-lg">
    <base-card-title class="text-lg text-gray-500">
      Line item #{{ rowIndex + 1 }}
    </base-card-title>
    <base-card-content>
      <base-text-input
        v-model="item.description"
        placeholder="Item details..."
        :required="rowIndex == 0"
        :rules="rowIndex == 0 ? [isRequired()] : []"
        :disabled="!editable"
      />
      <div class="flex items-center -mx-1">
        <div class="mx-1 w-1/2">
          <base-text-input
            v-model="item.quantity"
            placeholder="Quantity e.g. 1"
            :required="rowIndex == 0"
            :rules="quantityRules"
            :disabled="!editable"
          />
        </div>
        <div class="mx-1">
          <base-select
            v-model="item.quantity_type"
            :options="quantityTypes"
            placeholder="Quantity type..."
            :required="rowIndex == 0"
            :rules="rowIndex == 0 ? [isRequired()] : []"
            :disabled="!editable"
          />
        </div>
      </div>
      <div class="flex">
        <base-text-input
          v-model="item.unit_price"
          placeholder="Price/unit..."
          :required="rowIndex == 0"
          :rules="unitPriceRules"
          :disabled="!editable"
          class="flex-1"
        />
        <span class="ml-2">
          {{ currencyCode }}
        </span>
      </div>
      <div class="text-right text-xl font-medium mt-4">
        {{ amountFor(item) | money }} {{ currencyCode }}
      </div>
    </base-card-content>
  </base-card>
</template>

<script>
import { isRequired, isNumber, isLessThanOrEqualTo, maxDecimals, isPositive } from '~/lib/validations'

export default {
  name: 'LineItemCard',

  props: {
    item: { type: Object, required: true },
    currencyCode: { type: String, required: true },
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
