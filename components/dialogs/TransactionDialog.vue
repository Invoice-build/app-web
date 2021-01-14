<template>
  <base-dialog v-if="transaction && transaction.finalized" :show="show" @close="$emit('close')">
    <base-card square class="dialog-card w-full mx-auto rounded-t sm:rounded">
      <base-card-title :title="$t('labels.payment')" />
      <base-card-content>
        <h3 class="text-2xl font-bold">
          {{ transaction.details.amount | money }} {{ transaction.token.code }}
        </h3>
        <div class="flex mt-4">
          <div class="w-16 text-gray-500">
            {{ $t('labels.from') }}:
          </div>
          <div class="flex flex-1 items-center justify-between">
            <a
              :href="$eth.link.address(transaction.details.from, { network: transaction.network })"
              target="_blank"
              rel="noreferrer"
              class="link"
            >
              <eth-address :address="transaction.details.from" :seg-length="8" />
            </a>
            <div>
              <div class="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center">
                <base-copy-btn :text="transaction.details.from" class="flex" classes="text-xs text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex mt-4">
          <div class="w-16 text-gray-500">
            {{ $t('labels.on') }}:
          </div>
          <span>
            {{ transaction.finalized_at | datetime }}
          </span>
        </div>
        <div class="flex mt-4">
          <div class="w-16 text-gray-500">
            {{ $t('labels.hash') }}:
          </div>
          <div class="flex flex-1 items-center justify-between">
            <a
              :href="$eth.link.transaction(transaction.tx_hash, { network: transaction.network })"
              target="_blank"
              rel="noreferrer"
              class="link"
            >
              <eth-address :address="transaction.tx_hash" :seg-length="8" hash />
            </a>
            <div>
              <div class="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center">
                <base-copy-btn :text="transaction.tx_hash" class="flex" classes="text-xs text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </base-card-content>
      <base-card-content>
        <base-btn
          tag="a"
          :href="$eth.link.transaction(transaction.tx_hash, { network: transaction.network })"
          target="_blank"
          rel="referrer"
          color="gray"
          block
          flat
        >
          {{ $t('actions.view_on_etherscan') }}
        </base-btn>
      </base-card-content>
    </base-card>
  </base-dialog>
</template>

<script>
import EthAddress from '~/components/eth/EthAddress.vue'

export default {
  name: 'TransactionDialog',

  components: {
    EthAddress
  },

  props: {
    show: { type: Boolean, default: false },
    transaction: { type: Object, required: true }
  }
}
</script>

<style lang="css">
.dialog-card {
  max-width: 500px;
}
</style>
