<template>
  <base-dialog :show="show" @close="$emit('close')">
    <base-card square class="dialog-card w-full mx-auto rounded-t sm:rounded">
      <base-card-title :title="$t('dialogs.prefill.title')" />
      <base-card-content>
        <p>
          {{ $t('dialogs.prefill.description') }}
        </p>
        <div class="p-2 bg-gray-200 rounded-t text-xs w-full flex justify-between mt-4">
          <span class="text-gray-500 font-medium">
            {{ $t('labels.url') }}
          </span>
          <span class="text-gray-500 font-medium" @click="copy">
            {{ copyLabel }}
          </span>
        </div>
        <textarea
          ref="prefillText"
          v-model="url"
          name="prefill"
          cols="30"
          rows="10"
          class="p-2 bg-gray-200 rounded-b text-xs w-full text-gray-700"
          readonly
          @click="copy"
        />
      </base-card-content>
    </base-card>
  </base-dialog>
</template>

<script>
export default {
  name: 'PrefillDialog',

  props: {
    show: { type: Boolean, default: false },
    url: { type: String, required: true }
  },

  data () {
    return {
      copied: false
    }
  },

  computed: {
    copyKey () {
      return this.copied ? 'copied' : 'copy'
    },

    copyLabel () {
      return `${this.$t(`labels.${this.copyKey}`)}${this.copied ? '!' : ''}`
    }
  },

  methods: {
    async copy () {
      const textarea = this.$refs.prefillText
      textarea.select()
      document.execCommand('cut')
      this.copied = true
      await this.$utils.sleep(2000)
      this.copied = false
    }
  }
}
</script>

<style lang="css">
.dialog-card {
  max-width: 500px;
}
</style>
