<template>
  <div :class="classes">
    <component v-if="!!title" :is="tag" class="text-2xl">
      {{ title }}
    </component>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCardTitle',

  props: {
    tag: { type: String, default: 'h3' },
    title: { type: String, default: '' }
  },

  computed: {
    classes () {
      return ['flex items-center pt-4 px-4']
    }
  }
}
</script>
