<template>
  <div :class="[`px-${spacing/2} pb-${vSpacing} w-${width}`]">
    <slot />
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
