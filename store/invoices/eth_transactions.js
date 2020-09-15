import Vue from 'vue'

export const state = () => ({
  all: []
})

export const getters = {
  any: state => state.all.length > 0,
  hasPending: state => state.all.filter(tx => tx.status === 'pending').length > 0,
  pending: state => state.all.find(tx => tx.status === 'pending')
}

export const actions = {
  async get ({ commit }, { invoiceId, txId }) {
    try {
      const transaction = await this.$axios.$get(`/invoices/${invoiceId}/eth_transactions/${txId}`)
      commit('update', transaction)
      return transaction
    } catch (error) {
      throw error.response
    }
  },

  async getAll ({ commit }, invoiceId) {
    try {
      const transactions = await this.$axios.$get(`/invoices/${invoiceId}/eth_transactions`)
      commit('setAll', transactions)
      return transactions
    } catch (error) {
      throw error.response
    }
  },

  async create ({ commit }, { invoiceId, eth_transaction }) {
    try {
      const response = await this.$axios.$post(`invoices/${invoiceId}/eth_transactions`, { eth_transaction })
      commit('add', response)
      return response
    } catch (error) {
      throw error.response.data
    }
  }
}

export const mutations = {
  setAll (state, transactions) {
    state.all = transactions
  },

  add (state, transaction) {
    state.all.unshift(transaction)
  },

  update (state, transaction) {
    const index = state.all.findIndex(i => i.id === transaction.id)
    Vue.set(state.all, index, transaction)
  }
}
