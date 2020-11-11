import Vue from 'vue'

import * as filters from './filters'

const Globals = {
  install (Vue) {
    Object.keys(filters).forEach(filter => {
      Vue.filter(filter, filters[filter])
    })
  }
}

Vue.use(Globals)
