<template>
  <div :class="[`px-${this.spacing/2} pb-${this.vSpacing} w-${this.width}`]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseGridItem',

  props: {
    width: { type: String, default: '1/2' }
  },

  data () {
    return {
      spacing: '4',
      vSpacing: '4'
    }
  }
}
</script>
