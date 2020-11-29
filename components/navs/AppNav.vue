<template>
  <div>
    <div
      v-if="showMenu"
      v-click-outside="() => { showMenu = false }"
      class="nav-box w-64 bg-white shadow-2xl fixed bottom-0 z-50 right-0 mr-2 md:mr-6 mb-2 md:mb-6 rounded flex flex-col"
    >
      <div class="flex flex-col flex-1 py-2">
        <div v-for="(item, i) in menuItems" :key="i">
          <a
            v-if="item.external"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
            class="flex text-gray-700 px-4 py-2 hover:bg-black hover:text-white"
          >
            <div class="w-8">
              <i :class="item.icon" />
            </div>
            <span>{{ item.label }}</span>
          </a>
          <nuxt-link v-else :to="item.url" class="flex text-gray-700 px-4 py-2 hover:bg-black hover:text-white">
            <div class="w-8">
              <i :class="item.icon" />
            </div>
            <span>{{ item.label }}</span>
          </nuxt-link>
        </div>
      </div>
      <div class="h-20 w-full bg-black nav-box-footer" />
    </div>
    <div
      :class="['nav-btn w-16 h-16 shadow-2xl rounded-full z-50 fixed bottom-0 right-0 mr-4 md:mr-8 mb-4 md:mb-8 cursor-pointer', iconBgColor, btnDisplayClass]"
      @click="showMenu = !showMenu"
    >
      <div class="w-full h-full flex items-center justify-center">
        <span :class="['text-xl md:text-2xl font-bold', iconTextColor]">
          ib
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNav',

  data () {
    return {
      showBtn: true,
      showMenu: false,
      menuItems: [
        { label: this.$t('labels.new_invoice'), icon: 'fas fa-plus', url: '/', external: false },
        { label: this.$t('labels.about'), icon: 'fas fa-info-circle', url: '/about', external: false },
        { label: this.$t('labels.demo'), icon: 'fab fa-youtube', url: 'https://youtu.be/fzqy800piNk', external: true },
        { label: this.$t('labels.blog'), icon: 'fas fa-rss', url: '/blog', external: false },
        { label: this.$t('labels.bip'), icon: 'fas fa-pencil-ruler', url: '/bip', external: false },
        { label: this.$t('labels.legal'), icon: 'fas fa-balance-scale', url: '/legal', external: false }
      ]
    }
  },

  computed: {
    iconBgColor () {
      if (this.showMenu) return 'bg-white'
      return 'bg-black'
    },

    iconTextColor () {
      if (this.showMenu) return 'text-black'
      return 'text-white'
    },

    btnDisplayClass () {
      return this.showBtn ? 'visible' : 'invisible'
    },

    isInvoicePage () {
      const path = this.$route.fullPath
      return path === '/' || path.split('/').includes('invoices')
    }
  },

  mounted () {
    if (window.innerWidth <= 600 && this.isInvoicePage) window.addEventListener('scroll', this.toggleBtnOnScroll, true)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.toggleBtnOnScroll, true)
  },

  methods: {
    toggleBtnOnScroll () {
      const scrollPosition = window.pageYOffset
      const windowSize = window.innerHeight
      const bodyHeight = document.body.offsetHeight

      const bottomOffset = Math.max(bodyHeight - (scrollPosition + windowSize), 0)

      if (bottomOffset < 100 && this.showBtn) {
        this.showBtn = false
      } else if (bottomOffset >= 100 && !this.showBtn) {
        this.showBtn = true
      }
    }
  }
}
</script>

<style lang="css" scoped>
.nav-btn {
  letter-spacing: -2.3px;
  transition: transform 0.3s ease;
}
.nav-btn:hover {
  transform: scale(1.05);
}

.nav-box {
  border-bottom-right-radius: 2.2rem;
}
.nav-box-footer {
  border-bottom-right-radius: 2.2rem;
  border-bottom-left-radius: 0.25rem;
}
</style>
