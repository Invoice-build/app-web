<template>
  <div :class="classes">
    <div class="flex items-center">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSelectOption',

  props: {
    text: { type: String, required: true }
  },

  computed: {
    classes () {
      return ['base-select-option p-2 text-gray-900 no-underline block cursor-pointer hover:bg-gray-100']
    }
  }
}
</script>

<style scoped>
.base-select-option{
  transition: background .3s ease;
}
</style>
