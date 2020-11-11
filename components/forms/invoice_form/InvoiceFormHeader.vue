<template>
  <div class="flex flex-col md:flex-row justify-between items-start">
    <div>
      <div class="flex items-center text-3xl font-light text-gray-900">
        <token-select-input
          :network="value.network"
          :selected="selectedToken"
          :disabled="!editable"
          @change="tokenChangeHandler"
        />
        <h1 class="ml-3">
          {{ $t('labels.invoice') }}
        </h1>
        <span class="ml-2 text-gray-500">#</span>
        <div class="w-20">
          <base-text-input
            v-model="value.number"
            placeholder="0001"
            :rules="[isRequired()]"
            :disabled="!editable"
            required
            autofocus
            :mb="0"
            absolute-error
          />
        </div>
      </div>

      <span v-if="!!value.created_at" class="text-sm text-gray-500">
        {{ $t('labels.created') }} {{ value.created_at | date }}
      </span>
      <div v-else class="flex mt-4">
        <div class="flex items-center text-xs text-gray-500">
          <div class="w-4 h-4 rounded bg-orange-200" />
          <span class="ml-2">
            {{ $t('labels.required') }}
          </span>
        </div>
        <div class="flex items-center text-xs text-gray-500 ml-4">
          <div class="w-4 h-4 rounded bg-gray-200" />
          <span class="ml-2">
            {{ $t('labels.optional') }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-4 md:mt-0 hidden md:flex h-auto">
      <div :class="['font-medium text-right mr-1', dueClasses]">
        {{ dueLabel }}
      </div>
      <div>
        <base-text-input
          v-if="editable || !!value.due_at"
          v-model="value.due_at"
          type="date"
          :disabled="!editable"
          autogrow
          :mb="0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TokenSelectInput from '~/components/inputs/TokenSelectInput.vue'
import { isRequired } from '~/lib/validations'

export default {
  name: 'InvoiceFormHeader',

  components: {
    TokenSelectInput
  },

  props: {
    value: { type: Object, required: true },
    editable: { type: Boolean, required: true }
  },

  computed: {
    ...mapState({
      tokens: state => state.tokens.all
    }),

    selectedToken () {
      return this.tokens.find(t => t.id === this.value.token_id)
    },

    isOverdue () {
      if (!this.value.due_at) return false

      const dueAt = +new Date(this.value.due_at)
      const now = +new Date()
      return dueAt < now
    },

    dueClasses () {
      if (!this.editable && this.isOverdue) return 'bg-red-500 text-white px-2 py-px leading-none rounded'
      return 'text-gray-500 leading-tight'
    },

    dueLabel () {
      if (!this.editable) {
        if (!this.value.due_at) return this.$t('labels.due_on_receipt')
        if (this.isOverdue) return this.$t('labels.overdue')
      }
      return this.$t('labels.due')
    }
  },

  watch: {
    value () {
      this.$emit('change', this.value)
    }
  },

  methods: {
    isRequired,

    tokenChangeHandler (newTokenId) {
      this.value.token_id = newTokenId
    }
  }
}
</script>
