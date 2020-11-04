export const state = () => ({
  current: null
})

export const mutations = {
  setCurrent (state, { label = 'Label', icon = 'fas fa-info-circle', type = null, persistent = false } = {}) {
    state.current = { label, icon, type, persistent }
  },

  resetCurrent (state) {
    state.current = null
  }
}
