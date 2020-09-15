<template>
  <div :class="`px-${spacing/2}`">
    <div :class="[`flex -mx-${this.spacing}`, { 'flex-wrap': !noWrap }]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseGrid',

  props: {
    spacing: { type: String, default: '4' },
    vSpacing: { type: String, default: '4' },
    noWrap: { type: Boolean, default: false }
  },

  mounted () {
    this.$children.forEach(item => {
      item.spacing = this.spacing
      item.vSpacing = this.vSpacing
    })
  }
}
</script>
