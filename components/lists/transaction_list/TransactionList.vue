<template>
  <div class="flex flex-col">
    <transaction-list-item v-for="(tx, i) in transactions" :key="i" :tx="tx" class="mb-2" />
  </div>
</template>

<script>
import TransactionListItem from './TransactionListItem.vue'

export default {
  name: 'TransactionList',

  components: {
    TransactionListItem
  },

  props: {
    transactions: { type: Array, required: true }
  }
}
</script>
