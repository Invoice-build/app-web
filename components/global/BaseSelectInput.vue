<template>
  <div class="relative">
    <select
      :value="value"
      :name="name"
      :class="inputClasses"
      v-bind="$attrs"
      v-on="listeners"
    >
      <option
        v-if="defaultText"
        value=""
        hidden
        class="-mx-2"
      >
        {{ defaultText }}
      </option>
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="valFor(option)"
        class="-mx-2"
      >
        {{ textFor(option) }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSelectInput',

  props: {
    options: { type: Array, required: true },
    value: { type: [String, Number], default: '' },
    label: { type: String, default: null },
    name: { type: String, default: 'select' },
    rules: { type: Array, default: () => [] },
    validateOn: { type: String, default: 'change' },
    defaultText: { type: String, default: null },
    required: { type: Boolean, default: false }
  },

  data: () => ({
    errors: []
  }),

  computed: {
    listeners () {
      const vm = this
      return {
        ...this.$listeners,
        input: event => {
          vm.$emit('input', event.target.value)
          vm.validate(event.target.value)
        }
      }
    },

    hasError () {
      return this.errors.length > 0
    },

    inputClasses () {
      return [
        'base-select-input appearance-none w-full leading-tight focus:outline-none rounded',
        this.bgClasses,
        this.textClasses
      ]
    },

    bgClasses () {
      if (this.hasError) return 'bg-red-100'
      if (this.required && !this.value) return 'bg-orange-100'
      if (this.value.length === 0) return 'bg-gray-100'
      return 'bg-transparent'
    },

    textClasses () {
      return ''
    }
  },

  methods: {
    valFor (option) {
      if (typeof option === 'string' || option instanceof String) return option
      return option.value
    },

    textFor (option) {
      if (typeof option === 'string' || option instanceof String) return option
      return option.text
    },

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
select {
  display: block;
  box-sizing: border-box;
  box-shadow: none;
  outline: 0;
  text-shadow: 0 0 0 #000;
}
select:focus,
select:active {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
  box-shadow: none;
  outline: 0;
  text-shadow: 0 0 0 #000;
}

select > option {
  @apply -mx-1;
}
</style>
