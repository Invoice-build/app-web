import Vue from 'vue'

export const state = () => ({
  all: [],
  current: {}
})

export const actions = {
  async get ({ commit }, id) {
    try {
      const jwt = localStorage.getItem(`invoices.${id}.jwt`)
      const invoice = await this.$axios.$get(`/invoices/${id}`, { headers: { 'Invoice-Authorization': jwt } })
      commit('setCurrent', invoice)
      return invoice
    } catch (error) {
      commit('setCurrent', {})
      throw error.response
    }
  },

  async getAuth ({ commit }, { id, password }) {
    try {
      const response = await this.$axios.$post(`/invoices/${id}/show_auth`, { password })
      commit('setCurrent', response.invoice)
      localStorage.setItem(`invoices.${id}.jwt`, response.jwt)
      return response.invoice
    } catch (error) {
      commit('setCurrent', {})
      throw error.response
    }
  },

  async create ({ commit }, invoice) {
    try {
      const response = await this.$axios.$post('/invoices', { invoice })
      commit('setCurrent', response)
      commit('add', response)
      return response
    } catch (error) {
      commit('setCurrent', {})
      throw error.response.data
    }
  }
}

export const mutations = {
  setAll (state, invoices) {
    state.all = invoices
  },

  setCurrent (state, invoice) {
    state.current = invoice
  },

  add (state, invoice) {
    state.all.push(invoice)
    let invoices = JSON.parse(window.localStorage.getItem('invoices.unallocated'))
    invoices ? invoices.push(invoice.id) : invoices = [invoice.id]
    window.localStorage.setItem('invoices.unallocated', JSON.stringify(invoices))
  },

  update (state, invoice) {
    const index = state.all.findIndex(i => i.id === invoice.id)
    Vue.set(state.all, index, invoice)
  }
}
