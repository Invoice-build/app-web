<template>
  <div>
    <div :class="containerClasses">
      <input
        :ref="name"
        :class="inputClasses"
        :type="type"
        :name="name"
        :value="value"
        :size="size"
        v-bind="$attrs"
        v-on="listeners"
      >
      <div v-if="append" :class="appendClasses">
        <div class="flex items-center justify-center h-full">
          <slot name="append" />
        </div>
      </div>
    </div>
    <div v-if="hasError" :class="[errorClasses]">
      <div class="relative">
        {{ errors[0] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTextInput',

  props: {
    type: { type: String, default: 'text' },
    name: { type: String, default: 'input' },
    value: { type: [String, Number], default: '' },
    validateOn: { type: String, default: 'input' },
    rules: { type: Array, default: () => [] },
    required: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    autogrow: { type: Boolean, default: false },
    alignRight: { type: Boolean, default: false },
    append: { type: Boolean, default: false },
    mb: { type: Number, default: 1 },
    absoluteError: { type: Boolean, default: false }
  },

  data: () => ({
    focussed: false,
    errors: []
  }),

  computed: {
    listeners () {
      const vm = this
      return {
        ...this.$listeners,
        input: event => {
          vm.$emit('input', event.target.value)
          if (this.validateOn === 'input') vm.validate(event.target.value)
        },
        paste: event => {
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

    hasError () {
      return this.errors.length > 0
    },

    size () {
      const inputLength = this.value !== null ? this.value.toString().length : 0
      if (this.autogrow && this.type === 'number') return inputLength > 1 ? inputLength + 1 : 2
      else if (this.autogrow) return inputLength > 1 ? inputLength - 1 : 1
      return 0
    },

    containerClasses () {
      return ['flex', this.marginClasses]
    },

    errorClasses () {
      const classes = ['text-xs text-red-500 font-normal']
      if (this.absoluteError) classes.push('absolute')
      return classes
    },

    marginClasses () {
      switch (this.mb) {
        case 0:
          return 'mb-0'
        case 1:
          return 'mb-1'
        case 2:
          return 'mb-2'
        default:
          return 'mb-1'
      }
    },

    inputClasses () {
      return ['leading-tight', this.bgClasses, this.textClasses, this.widthClasses, this.inputRoundedClasses]
    },

    appendClasses () {
      return ['rounded-r', this.bgClasses]
    },

    bgClasses () {
      if (this.hasError) return 'bg-red-100'
      if (this.required) {
        if (this.value !== null && this.value.toString().length > 0) return 'bg-transparent'
        return 'bg-orange-100'
      }
      if (this.value !== null && this.value.toString().length > 0) return 'bg-transparent'
      return 'bg-gray-100'
    },

    textClasses () {
      const classes = []
      if (this.hasError) classes.push('placeholder-red-500', 'text-red-500')
      else if (this.required) classes.push('placeholder-orange-500')

      if (this.alignRight) classes.push('text-right')
      return classes.join(' ')
    },

    widthClasses () {
      if (this.autogrow) return ''
      return 'w-full'
    },

    inputRoundedClasses () {
      if (this.append) return 'rounded-l'
      return 'rounded'
    }
  },

  mounted () {
    if (this.autofocus) this.$refs[this.name].focus()
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

<style lang="css" scoped>
input {
  transition: all .3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
input:focus {
  outline: none;
}
</style>
