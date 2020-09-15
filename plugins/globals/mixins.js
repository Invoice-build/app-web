import { mapState } from 'vuex'

export const baseState = {
  computed: {
    ...mapState({
      currentNetwork: state => state.network
    })
  }
}
