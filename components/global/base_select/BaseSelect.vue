<template>
  <div v-click-outside="closeOptions">
    <base-text-input
      v-model="textInputValue"
      :name="name"
      :rules="rules"
      :label="label"
      validate-on="none"
      :required="required"
      :disabled="disabled"
      :readonly="!filterable"
      :size="size"
      v-bind="$attrs"
      autocomplete="off"
      class="base-select-input"
      append
      :mb="mb"
      :absolute-error="absoluteError"
      @focus="focusHandler"
    >
      <div slot="append" class="block cursor-pointer px-4" @click="(!disabled) ? showOptions = !showOptions : null">
        <base-icon v-if="!disabled" name="fas fa-chevron-down" :class="['chevron text-gray-600', chevronClasses]" />
      </div>
    </base-text-input>
    <div class="relative">
      <transition name="select-in-up">
        <div v-if="showOptions" :ref="name" :class="selectCardClasses">
          <base-select-option
            v-for="(option, index) in _options"
            :key="index"
            :text="textFor(option)"
            :size="size"
            @click.native="optionSelected(option)"
          />
        </div>
      </transition>
      <div v-if="showOptions" class="base-select-spacer w-full absolute" />
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'BaseSelect',

  directives: {
    ClickOutside
  },

  props: {
    options: { type: Array, required: true },
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    name: { type: String, default: '' },
    filterable: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
    validateOn: { type: String, default: 'blur' },
    mb: { type: Number, default: 1 },
    absoluteError: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    }
  },

  data () {
    return {
      inputValue: '',
      textInputValue: '',
      showOptions: false
    }
  },

  computed: {
    chevronClasses () {
      return {
        'chevron-active': this.showOptions
      }
    },

    inputLabel () {
      if (!this.value) return ''
      if (typeof this.options[0] === 'string' || this.options[0] instanceof String) return this.value

      const selectedOption = this.options.find(option => option.value === this.inputValue)
      if (selectedOption) return selectedOption.text
      return this.value
    },

    _options () {
      if (this.filterable) {
        if (typeof this.options[0] === 'string' || this.options[0] instanceof String)
          return this.options.filter(text => text.includes(this.value))
        else {
          const filteredTexts = this.options
            .map(options => options.text.toLowerCase())
            .filter(text => text.includes(this.textInputValue.toLowerCase()))

          return this.options.filter(option => filteredTexts.includes(option.text.toLowerCase()))
        }
      }
      return this.options
    },

    selectCardClasses () {
      return ['base-select-options rounded shadow-lg bg-white absolute w-full z-50 overflow-y-scroll', this.marginClasses]
    },

    marginClasses () {
      switch (this.mb) {
        case 0:
          return ''
        case 1:
          return 'mb-1'
        case 2:
          return 'mb-2'
        default:
          return 'mb-1'
      }
    }
  },

  watch: {
    value (newVal) {
      this.inputValue = newVal
      this.textInputValue = this.labelFor(newVal)
      this.validate(newVal)
    },

    showOptions (newVal) {
      if (newVal) this.adjustScrollPosition()
      else {
        this.clearIfNotOption()
        this.validate(this.textInputValue)
      }
    }
  },

  beforeMount () {
    this.inputValue = this.value
    this.textInputValue = this.labelFor(this.value)
  },

  methods: {
    optionSelected (option) {
      this.$emit('input', this.valueFor(option))
      this.showOptions = false
    },

    textFor (option) {
      if (typeof option === 'string' || option instanceof String) return option
      return option.text
    },

    labelFor (value) {
      if (!this.value) return ''
      if (typeof this.options[0] === 'string' || this.options[0] instanceof String) return value

      const selectedOption = this.options.find(option => option.value === value)

      if (selectedOption) return selectedOption.text
      return value
    },

    valueFor (option) {
      if (typeof option === 'string' || option instanceof String) return option
      return option.value
    },

    closeOptions () {
      this.showOptions = false
    },

    focusHandler () {
      this.showOptions = true
      this.$emit('focus')
    },

    adjustScrollPosition () {
      this.$nextTick().then(() => {
        const el = this.$refs[this.name]
        const bounding = el.getBoundingClientRect()
        if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
          const currentScrollPos = document.documentElement.scrollTop
          const overflow = bounding.bottom - Math.min(window.innerHeight, document.documentElement.clientHeight)
          const newPos = currentScrollPos + overflow + 50
          window.scrollTo(0, newPos)
        }
      })
    },

    clearIfNotOption () {
      if (typeof this.options[0] === 'string' || this.options[0] instanceof String) {
        if (!this.options.includes(this.value)) this.value = ''
      } else if (!this.options.map(option => option.value).includes(this.value)) {
        this.inputValue = ''
        this.textInputValue = ''
      }
    },

    validate (val) {
      this.$children.forEach(input => {
        if (typeof input.validate === 'function') input.validate(val)
      })
    }
  }
}
</script>

<style scoped>
.base-select-options {
  max-height: 260px;
}

.base-select-spacer {
  height: 300px;
}

.chevron {
  transition: transform 0.2s ease-in-out;
}

.chevron-active {
  transform: rotateZ(180deg);
}

.base-select-input:hover {
  & .chevron {
    transform: rotateZ(90deg);
  }
}

.select-in-up-enter-active, .select-in-up-leave-active {
  transition: all .3s ease;
}
.select-in-up-enter, .select-in-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
