<template>
  <div>
    <Nuxt v-if="!loading" />
    <app-nav />
    <!-- <app-snackbars /> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppNav from '~/components/navs/AppNav.vue'
// import AppSnackbars from '~/components/alerts/AppSnackbars.vue'

export default {
  components: {
    AppNav
    // AppSnackbars
  },

  data () {
    return {
      loading: true
    }
  },

  async beforeMount () {
    try {
      await this.getTokens()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions({
      getTokens: 'tokens/get'
    })
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
