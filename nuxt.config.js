import nuxtI18nConfig from './lib/nuxt-i18n-config'
import { title, description, ogMeta } from './lib/meta'

export default {
  target: 'server',

  loading: false,

  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV || 'development',
    APP_DOMAIN: process.env.APP_DOMAIN || 'localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:5000',
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || 'xxx'
  },

  head: {
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#'
    },
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1, minimal-ui, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: description },
      ...ogMeta
    ],
    link: [
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      { rel: 'msapplication-TileColor', content: '#da532c' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/fontawesome/css/all.min.css' }
    ],
    script: [
      { src: '/js/csrf.js' },
      { src: 'https://squid.invoice.build/script.js', site: process.env.FATHOM_SITE_ID, defer: true }
    ]
  },

  css: [
    '~/assets/css/app.css'
  ],

  plugins: [
    '~/plugins/axios',
    '~/plugins/globals',
    { src: '~/plugins/eth', ssr: false },
    '~/plugins/utils',
    '~/plugins/breakpoints'
  ],

  components: [
    '~/components/global'
  ],

  modules: [
    '@nuxtjs/axios',
    ['nuxt-i18n', nuxtI18nConfig]
  ],

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss'
  ],

  build: {}
}
