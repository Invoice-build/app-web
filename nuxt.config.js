import nuxtI18nConfig from './lib/nuxt-i18n-config'
import { title, ogMeta } from './lib/meta'
import getContentRoutes from './lib/get-content-routes'

export default {
  target: 'server',

  loading: false,

  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV || 'development',
    APP_DOMAIN: process.env.APP_DOMAIN || 'localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:5000',
    infuraProjectId: process.env.INFURA_PROJECT_ID || 'xxx'
  },

  head: {
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#'
    },
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1, minimal-ui, shrink-to-fit=no' },
      ...ogMeta()
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
    '@nuxtjs/sentry',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    ['nuxt-i18n', nuxtI18nConfig]
  ],

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://invoice.build',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false,
    exclude: [],
    routes () {
      return getContentRoutes()
    }
  },

  sentry: {
    dsn: 'https://f3efaf39aa4a4e9992315a7f3f267d36@o473092.ingest.sentry.io/5507615'
  },

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss'
  ],

  build: {}
}
