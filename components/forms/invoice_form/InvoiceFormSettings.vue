<template>
  <div v-if="editable" class="mt-12">
    <div class="border-b border-gray-300">
      <h2 class="text-xl font-medium text-gray-600">
        {{ $t('labels.settings') }}
      </h2>
    </div>
    <div class="flex flex-wrap md:flex-no-wrap mt-4">
      <div class="w-full md:w-1/3">
        <h3 class="mr-2 text-gray-500">
          {{ $t('labels.password') }}:
        </h3>
      </div>
      <div class="w-full">
        <base-text-input
          v-model="value.password"
          type="password"
          :placeholder="`${$t('labels.enter_password')}...`"
          :disabled="!editable"
          class="flex-1"
        />
        <p class="text-xs text-gray-400">
          {{ $t('hints.password') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceFormSettings',

  props: {
    value: { type: Object, required: true },
    editable: { type: Boolean, required: true }
  },

  watch: {
    value () {
      this.$emit('change', this.value)
    }
  }
}
</script>
