<template>
  <base-form ref="passwordForm" @submit="submit">
    <div v-if="unlocked" class="text-4xl">
      {{ $t('labels.unlocked') }}!
    </div>
    <div v-else>
      <base-text-input
        v-model="password"
        type="password"
        :placeholder="`${$t('labels.enter_password')}...`"
        :rules="[isRequired()]"
        class="text-4xl"
      />
      <base-btn
        type="submit"
        color="black"
        :loading="submitting"
        :disabled="submitting"
        class="mt-8"
        block
      >
        {{ $t('labels.unlock_invoice') }}
      </base-btn>
    </div>
  </base-form>
</template>

<script>
import { mapActions } from 'vuex'
import { isRequired } from '~/lib/validations'

export default {
  name: 'InvoicePasswordForm',

  props: {
    id: { type: String, required: true }
  },

  data () {
    return {
      submitting: false,
      password: '',
      unlocked: false
    }
  },

  methods: {
    isRequired,

    ...mapActions({
      getAuth: 'invoices/getAuth'
    }),

    async submit () {
      try {
        if (!this.$refs.passwordForm.validate()) throw new Error('Form error')
        this.submitting = true
        await this.getAuth({ id: this.id, password: this.password })
        this.unlocked = true
        this.$emit('success')
      } catch (error) {
        console.error(error)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
