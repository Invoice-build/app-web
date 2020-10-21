<template>
  <div :class="['flex border rounded p-2', borderClass, bgClass, textClass]">
    <div class="mr-2">
      <div :class="['w-6 h-6 flex items-center justify-center rounded-full', bgLightClass]">
        <i :class="[icon, iconColor]" />
      </div>
    </div>
    <div class="min-w-0 flex flex-col">
      <div class="truncate">
        {{ tx.tx_hash }}
      </div>
      <div v-if="tx.finalized && tx.details" class="h-4 w-px bg-green-200" />
      <div v-if="tx.finalized && tx.details" class="flex">
        <div class="h-px w-4 bg-green-200" />
        <div class="-mt-3 ml-2 flex flex-col md:flex-row">
          <span v-if="!tx.transactable_valid" class="mr-2">
            <i class="fas fa-ban" />
          </span>
          <div class="flex">
            <span class="font-bold mr-2">
              {{ tx.details.amount | money }}
            </span>
            <span class="font-bold mr-2">
              {{ tx.token.code }}
            </span>
          </div>
          <div class="flex tuncate">
            <span class="opacity-50 mr-2 lowercase">
              {{ $t('labels.from') }}
            </span>
            <span class="truncate min-w-0 w-32 mr-2 hover:underline">
              <a :href="$eth.link.address(tx.details.from, { network: tx.network })" target="_blank" rel="noreferrer">
                {{ tx.details.from }}
              </a>
            </span>
          </div>
          <div class="flex">
            <span class="opacity-50 mr-2 lowercase">
              {{ $t('labels.on') }}
            </span>
            <span>
              {{ tx.finalized_at | datetime }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-2">
      <base-copy-btn :text="tx.tx_hash" classes="text-xs" />
    </div>
    <div class="flex-1 flex justify-end">
      <base-btn
        tag="a"
        icon="fas fa-external-link-square-alt"
        :color="stateColor"
        size="sm"
        class="ml-2"
        flat
        circle
        :href="$eth.link.transaction(tx.tx_hash, { network: tx.network })"
        target="_blank"
        rel="noreferrer"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionList',

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
