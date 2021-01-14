<template>
  <div :class="['flex border rounded p-2', borderClass, bgClass, textClass]">
    <div class="mr-4">
      <div :class="['w-6 h-6 flex items-center justify-center rounded-full', bgLightClass]">
        <i :class="[icon, iconColor]" />
      </div>
    </div>
    <div class="flex flex-1 justify-between mt-px">
      <div v-if="!tx.finalized" class="truncate">
        {{ tx.tx_hash }}
      </div>
      <div v-else class="flex flex-col md:flex-row">
        <span v-if="!tx.transactable_valid" class="mr-2">
          <i class="fas fa-ban" />
        </span>
        <span class="font-bold text-xl leading-none mr-2">
          {{ tx.details.amount | money }} {{ tx.token.code }}
        </span>
        <div class="flex tuncate mr-2 mt-2 md:mt-0 text-sm">
          <span class="opacity-50 mr-2 lowercase">
            {{ $t('labels.from') }}
          </span>
          <span>
            <a
              :href="$eth.link.address(tx.details.from, { network: tx.network })"
              target="_blank"
              rel="noreferrer"
              :class="['hover:underline', textClass]"
            >
              <eth-address :address="tx.details.from" />
            </a>
          </span>
        </div>
        <div class="flex text-sm">
          <span class="opacity-50 mr-2 lowercase">
            {{ $t('labels.on') }}
          </span>
          <span>
            {{ tx.finalized_at | datetime }}
          </span>
        </div>
      </div>
      <base-btn
        v-if="tx.finalized"
        icon="fas fa-expand"
        :color="stateColor"
        size="sm"
        circle
        flat
        @click.prevent="$emit('expand', tx)"
      />
      <base-btn
        v-else
        tag="a"
        :href="$eth.link.transaction(tx.tx_hash, { network: tx.network })"
        target="_blank"
        rel="noreferrer"
        icon="fas fa-external-link-square-alt"
        :color="stateColor"
        size="sm"
        circle
        flat
      />
    </div>
  </div>
</template>

<script>
import EthAddress from '~/components/eth/EthAddress.vue'

export default {
  name: 'TransactionList',

  components: {
    EthAddress
  },

  props: {
    tx: { type: Object, required: true }
  },

  computed: {
    stateColor () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'green'
        case 'failed':
          return 'red'
        default:
          return 'orange'
      }
    },

    icon () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'fas fa-check-circle'
        case 'failed':
          return 'fas fa-ban'
        default:
          return 'fas fa-hourglass-half text-sm'
      }
    },

    iconColor () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'text-green-500'
        case 'failed':
          return 'text-red-500'
        default:
          return 'text-orange-500'
      }
    },

    borderClass () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'border-green-200'
        case 'failed':
          return 'border-red-200'
        default:
          return 'border-orange-200'
      }
    },

    bgClass () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'bg-green-100'
        case 'failed':
          return 'bg-red-100'
        default:
          return 'bg-orange-100'
      }
    },

    bgLightClass () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'bg-green-200'
        case 'failed':
          return 'bg-red-200'
        default:
          return 'bg-orange-200'
      }
    },

    textClass () {
      switch (this.tx.status) {
        case 'confirmed':
          return 'text-green-700'
        case 'failed':
          return 'text-red-500'
        default:
          return 'text-orange-500'
      }
    }
  }
}
</script>
