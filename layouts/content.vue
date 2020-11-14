<template>
  <div>
    <Nuxt />
    <app-nav />
    <app-snackbars />
  </div>
</template>

<script>
import AppNav from '~/components/navs/AppNav.vue'
import AppSnackbars from '~/components/alerts/AppSnackbars.vue'

export default {
  components: {
    AppNav,
    AppSnackbars
  }
}
</script>

<style>
</style>
