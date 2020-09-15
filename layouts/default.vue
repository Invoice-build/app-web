<template>
  <div>
    <Nuxt v-if="!loading" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  head: {
    bodyAttrs: {
      class: 'bg-gray-100'
    }
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
  }
}
</script>

<style>
</style>
