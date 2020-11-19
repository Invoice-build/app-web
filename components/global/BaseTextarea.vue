<template>
  <div :class="containerClasses">
    <div v-if="!!label" class="text-gray-600">
      {{ label }}
    </div>
    <textarea
      :class="inputClasses"
      :style="inputStyles"
      :type="type"
      :name="name"
      :value="value"
      v-bind="$attrs"
      :disabled="disabled"
      v-on="listeners"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseTextarea',

  props: {
    type: { type: String, default: 'text' },
    value: { type: [String, Number], default: '' },
    label: { type: String, default: null },
    name: { type: String, default: 'input' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
    validateOn: { type: String, default: 'blur' }
  },

  data () {
    return {
      focussed: false,
      errors: []
    }
  },

  computed: {
    listeners () {
      const vm = this

      return {
        ...this.$listeners,
        input: event => {
          vm.$emit('input', event.target.value)
          if (this.validateOn === 'input') vm.validate(event.target.value)
        },
        focus: () => {
          vm.$emit('focus')
          vm.focussed = true
        },
        blur: event => {
          vm.$emit('blur')
          vm.focussed = false
          vm.validate(event.target.value)
        }
      }
    },

    inputStyles () {
      return {
        resize: this.disabled ? 'none' : 'vertical'
      }
    },

    hasError () {
      return this.errors.length > 0
    },

    containerClasses () {
      return ['']
    },

    inputClasses () {
      return ['leading-tight rounded', this.bgClasses, this.textClasses, this.widthClasses]
    },

    bgClasses () {
      if (this.hasError) return 'bg-red-100'
      if (this.required) {
        if (this.value !== null && this.value.length > 0) return 'bg-transparent'
        return 'bg-orange-100'
      }
      if (this.value !== null && this.value.length > 0) return 'bg-transparent'
      return 'bg-gray-100'
    },

    textClasses () {
      const classes = []
      if (this.hasError) classes.push('placeholder-red-500')
      else if (this.required) classes.push('placeholder-orange-500')

      if (this.alignRight) classes.push('text-right')
      return classes.join(' ')
    },

    widthClasses () {
      if (this.autogrow) return ''
      return 'w-full'
    }
  },

  methods: {
    validate (val) {
      this.errors = []
      if (this.rules && this.rules.length > 0) {
        this.rules.forEach(rule => {
          const result = rule(val)
          if (typeof result === 'string') this.errors.push(result)
        })
      }
    }
  }
}
</script>

<style scoped>
textarea {
  transition: all .3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
textarea:focus {
  outline: none;
}
</style>
