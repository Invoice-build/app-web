<template>
  <div class="flex flex-col">
    <transaction-list-item
      v-for="(tx, i) in transactions"
      :key="i"
      :tx="tx"
      class="mb-2"
      @expand="openDialog"
    />
    <transaction-dialog
      :transaction="activeTx"
      :show="showDialog"
      @close="showDialog = false"
    />
  </div>
</template>

<script>
import TransactionListItem from './TransactionListItem.vue'
import TransactionDialog from '~/components/dialogs/TransactionDialog.vue'

export default {
  name: 'TransactionList',

  components: {
    TransactionListItem,
    TransactionDialog
  },

  props: {
    transactions: { type: Array, required: true }
  },

  data () {
    return {
      showDialog: false,
      activeTx: {}
    }
  },

  beforeMount () {
    this.activeTx = this.transactions[0]
  },

  methods: {
    openDialog (tx) {
      this.activeTx = tx
      this.showDialog = true
    }
  }
}
</script>
