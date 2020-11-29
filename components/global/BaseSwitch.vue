<template>
  <div :class="{ 'mb-6': !noMargin }">
    <label :class="`base-switch base-switch-${size}`">
      <input
        type="checkbox"
        :name="name"
        :checked="checked"
        v-bind="$attrs"
        v-on="listeners"
      >
      <span :class="[`slider slider-${color} slider-${size}`, { round }]" />
    </label>
    <div
      v-show="hasError"
      class="base-text-field-error text-red-500 text-sm absolute mt-1"
    >
      {{ errors[0] }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSwitch',

  model: {
    prop: 'checked',
    event: 'change'
  },

  props: {
    name: { type: String, default: 'inputSwitch' },
    round: { type: Boolean, default: false },
    color: { type: String, default: 'green' },
    checked: { type: Boolean, default: false },
    rules: { type: Array, default: () => ([]) },
    validateOn: { type: String, default: 'change' },
    noMargin: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    }
  },

  data () {
    return {
      errors: []
    }
  },

  computed: {
    listeners () {
      const vm = this
      return {
        ...this.$listeners,
        change: event => {
          vm.$emit('change', event.target.checked)
          if (this.validateOn === 'change') vm.validate(event.target.checked)
        }
      }
    },

    hasError () {
      return this.errors.length > 0
    }
  },

  methods: {
    validate (val) {
      this.errors = []
      if (this.rules && this.rules.length > 0) this.rules.forEach(rule => {
        const result = rule(val)
        if (typeof result === 'string') this.errors.push(result)
      })
    }
  }
}
</script>

<style scoped>
.base-switch {
  position: relative;
  display: inline-block;
}
.base-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  @apply bg-gray-300;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .4s;
  transition: .4s;
}
.slider:before {
  @apply bg-white;
  position: absolute;
  content: "";
  -webkit-transition: .4s;
  transition: .4s;
}
.slider.round:before {
  border-radius: 50%;
}
/* COLORS */
input:checked + .slider-blue {
  @apply bg-blue-500;
}
input:focus + .slider-blue {
  box-shadow: 0 0 1px theme('colors.blue-500');
}
input:checked + .slider-red {
  @apply bg-red-500;
}
input:focus + .slider-red {
  box-shadow: 0 0 1px theme('colors.red-500');
}
input:checked + .slider-green {
  @apply bg-green-500;
}
input:focus + .slider-green {
  box-shadow: 0 0 1px theme('colors.green-500');
}
input:checked + .slider-orange {
  @apply bg-orange-500;
}
input:focus + .slider-orange {
  box-shadow: 0 0 1px theme('colors.orange-500');
}
input:checked + .slider-gray {
  @apply bg-gray-900;
}
input:focus + .slider-gray {
  box-shadow: 0 0 1px theme('colors.gray-900');
}
input:checked + .slider-black {
  @apply bg-black;
}
input:focus + .slider-black {
  box-shadow: 0 0 1px theme('colors.black');
}
/* SIZES */
.base-switch-sm {
  width: 30px;
  height: 20px;
}
.slider-sm:before {
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
}
.slider-sm.round {
  border-radius: 20px;
}
input:checked + .slider-sm:before {
  -webkit-transform: translateX(10px);
  -ms-transform: translateX(10px);
  transform: translateX(10px);
}
.base-switch-md {
  width: 50px;
  height: 30px;
}
.slider-md:before {
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
}
.slider-md.round {
  border-radius: 30px;
}
input:checked + .slider-md:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}
.base-switch-lg {
  width: 70px;
  height: 40px;
}
.slider-lg:before {
  height: 32px;
  width: 32px;
  left: 4px;
  bottom: 4px;
}
.slider-lg.round {
  border-radius: 40px;
}
input:checked + .slider-lg:before {
  -webkit-transform: translateX(30px);
  -ms-transform: translateX(30px);
  transform: translateX(30px);
}
</style>
