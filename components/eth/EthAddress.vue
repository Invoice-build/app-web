<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
export default {
  name: 'EthAddress',

  props: {
    address: { type: String, required: true },
    hash: { type: Boolean, default: false },
    segLength: { type: Number, default: 4 }
  },

  data () {
    return {
      label: ''
    }
  },

  watch: {
    address (newAddresss) {
      this.truncateLabel(newAddresss)
      if (!this.hash) this.setEnsLabel()
    }
  },

  beforeMount () {
    this.truncateLabel(this.address)
    if (!this.hash) this.setEnsLabel()
  },

  methods: {
    async setEnsLabel () {
      try {
        const address = this.$eth.address().toMixedCase(this.address)
        const name = await this.$eth.ens().nameFor(address)
        if (name) {
          this.label = name
        } else {
          this.truncateLabel(address)
        }
      } catch (error) {
        console.error(error)
      }
    },

    truncateLabel (address) {
      const firstSegment = address.substring(0, this.segLength + 2)
      const lastSegment = address.substring(address.length, address.length - this.segLength)
      this.label = `${firstSegment}...${lastSegment}`
    }
  }
}
</script>
