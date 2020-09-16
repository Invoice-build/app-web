import nuxtI18nConfig from './lib/nuxt-i18n-config'
import { title, description, ogMeta } from './lib/meta'

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Nuxt ENV
  ** See https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/
  */
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV || 'development',
    APP_DOMAIN: process.env.APP_DOMAIN || 'localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:5000'
  },
  privateRuntimeConfig: {},
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/fontawesome/css/all.min.css' }
    ],
    script: [
      { src: '/js/csrf.js' },
      { src: 'https://squid.invoice.build/script.js', site: process.env.FATHOM_SITE_ID, defer: true }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/app.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/globals',
    '~/plugins/eth',
    '~/plugins/utils',
    '~/plugins/breakpoints'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: [
    '~/components/global'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    ['nuxt-i18n', nuxtI18nConfig]
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
