export const state = () => ({
  all: []
})

export const actions = {
  async get ({ commit }) {
    try {
      const tokens = await this.$axios.$get('/tokens')
      commit('setAll', tokens)
      return tokens
    } catch (error) {
      throw error.response
    }
  }
}

export const mutations = {
  setAll (state, tokens) {
    state.all = tokens
  }
}
