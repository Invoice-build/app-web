<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseCard',

  props: {
    square: { type: Boolean, default: false }
  },

  computed: {
    classes () {
      const classes = ['bg-white shadow']
      if (!this.square) classes.push('rounded')
      return classes
    }
  }
}
</script>
