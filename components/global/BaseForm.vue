<template>
  <form
    :action="action"
    :method="method"
    v-bind="$attrs"
    @submit.prevent="$emit('submit')"
  >
    <slot />
  </form>
</template>

<script>
export default {
  name: 'BaseForm',

  props: {
    action: { type: String, default: '' },
    method: { type: String, default: 'post' }
  },

  data () {
    return {
      errors: []
    }
  },

  methods: {
    validate () {
      this.errors = []
      this.recursiveValidate(this.$children)
      if (this.errors.length > 0) return false
      return true
    },

    recursiveValidate (children) {
      children.forEach(child => {
        this.validateInput(child)
        if (child.$children.length > 0) this.recursiveValidate(child.$children)
      })
    },

    validateInput (input) {
      if (typeof input.validate === 'function') {
        if (['base-checkbox', 'base-switch'].includes(input.$options._componentTag)) {
          input.validate(input.$props.checked)
          this.handleInputErrors(input.$data.errors)
        } else {
          input.validate(input.$props.value)
          this.handleInputErrors(input.$data.errors)
        }
      }
    },

    handleInputErrors (errors) {
      if (errors && errors.length > 0) {
        this.errors.push(...errors)
      }
    }
  }
}
</script>
