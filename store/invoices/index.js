import CryptoJS from 'crypto-js'
import Vue from 'vue'
import InvoiceCalculator from '~/lib/invoice-calculator'

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

  async getEncrypted ({ commit, state }, id) {
    try {
      let invoice = await this.$axios.$get(`/invoices/${id}/encrypted`)
      delete state.current.paid_amount
      invoice = serializeEncrypted(state.current, invoice)
      commit('setCurrent', invoice)
      return invoice
    } catch (error) {
      commit('setCurrent', {})
      throw error.response
    }
  },

  async getAuth ({ commit }, { id, password }) {
    try {
      const response = await this.$axios.$post(`/invoices/${id}/auth`, { password })
      if (response.invoice.data_hash) {
        const bytes = CryptoJS.AES.decrypt(response.invoice.data_hash, password)
        let invoice = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        invoice = serializeEncrypted(invoice, response.invoice)
        commit('setCurrent', invoice)
        return invoice
      } else {
        commit('setCurrent', response.invoice)
        localStorage.setItem(`invoices.${id}.jwt`, response.jwt)
        return response.invoice
      }
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

function serializeEncrypted (encryptedData, serverInvoice) {
  const invoice = Object.assign({}, serverInvoice, encryptedData)
  const calculator = new InvoiceCalculator(invoice)
  invoice.total = calculator.total()
  invoice.paid = invoice.paid_amount >= invoice.total
  return invoice
}
