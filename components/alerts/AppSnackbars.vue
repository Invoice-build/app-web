<template>
  <div class="w-full fixed bottom-0 flex justify-center">
    <transition name="content" mode="out-in">
      <div v-if="snackbar" :class="['w-full md:w-1/3 rounded-t-xl shadow-lg font-medium', typeClasses]">
        <div class="relative">
          <div
            class="absolute top-0 right-0 w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-25 cursor-pointer m-1"
            @click="hide">
            <i class="fas fa-times text-base"></i>
          </div>
        </div>
        <div class="flex items-center px-4 py-8 md:py-4">
          <i :class="[snackbar.icon, 'text-2xl mr-4']" />
          {{ snackbar.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'AppSnackbars',

  computed: {
    ...mapState({
      snackbar: state => state.snackbars.current
    }),

    typeClasses () {
      switch (this.snackbar.type) {
        case 'success':
          return 'bg-green-500 text-white'
        default:
          return 'bg-black text-white'
      }
    }
  },

  watch: {
    async snackbar (newVal) {
      if (newVal && !newVal.persistent) {
        await this.$utils.sleep(5000)
        this.hide()
      }
    }
  },

  methods: {
    ...mapMutations({
      show: 'snackbars/setCurrent',
      hide: 'snackbars/resetCurrent'
    })
  }
}
</script>

<style lang="css" scoped>
.content-enter-active {
  transition: all .3s ease-in-out;
}
.content-leave-active {
  transition: all .3s ease-in-out;
}
.content-enter, .content-leave-to {
  opacity: 0;
  transform: translateY(70%);
}
</style>
