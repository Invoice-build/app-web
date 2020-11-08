<template>
  <div>
    <Nuxt v-if="!loading" />
    <app-nav />
    <app-snackbars />
  </div>
</template>

<script>
import Web3 from 'web3'
import { mapActions } from 'vuex'
import AppNav from '~/components/navs/AppNav.vue'
import AppSnackbars from '~/components/alerts/AppSnackbars.vue'

export default {
  components: {
    AppNav,
    AppSnackbars
  },

  data () {
    return {
      loading: true
    }
  },

  async beforeMount () {
    try {
      await this.getTokens()
      this.setProvider()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions({
      getTokens: 'tokens/get'
    }),

    setProvider () {
      if (!Web3.givenProvider) {
        const network = !this.invoice ? 'mainnet' : this.invoice.network
        this.$eth.config.provider = new Web3.providers.WebsocketProvider(`wss://${network}.infura.io/ws/v3/${this.$config.INFURA_PROJECT_ID}`)
        this.$eth.config.web3 = new Web3(this.$eth.config.provider)
      }
    }
  },

  head: {
    bodyAttrs: {
      class: 'bg-gray-100'
    }
  }
}
</script>

<style>
</style>
