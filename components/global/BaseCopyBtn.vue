<template>
  <div>
    <transition name="switch" mode="out-in">
      <i
        v-if="copied"
        key="check"
        :class="[`fas fa-check-circle cursor-pointer`, classes]"
      />
      <i
        v-else
        key="copy"
        :class="[`far fa-clone cursor-pointer`, classes]"
        @click="copyToClipboard"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseCopyBtn',

  props: {
    text: { type: String, required: true },
    classes: { type: String, default: '' }
  },

  data () {
    return {
      copied: false
    }
  },

  methods: {
    async copyToClipboard () {
      const textarea = document.createElement('textarea')
      textarea.textContent = this.text
      document.body.appendChild(textarea)
      textarea.select()

      document.execCommand('cut')
      document.body.removeChild(textarea)

      this.copied = true
      await this.$utils.sleep(2000)
      this.copied = false
    }
  }
}
</script>

<style scoped>
.switch-enter-active, .switch-leave-active {
  transition: all .1s;
}
.switch-enter, .switch-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
.input {
  width: 0px;
  height: 0px;
  resize: none;
  border: none;
  outline: none;
}
</style>
