<template>
  <main class="p-4">
    <article class="w-full md:w-2/3 lg:w-1/2">
      <nuxt-content :document="page" />
    </article>
  </main>
</template>

<script>
import { ogMeta } from '~/lib/meta'

export default {
  layout: 'content',

  async asyncData ({ $content, route }) {
    let page
    try {
      page = await $content('about').fetch()
    } catch (error) {
      return error({ statusCode: 404, message: 'Page not found' })
    }
    return { page }
  },

  head () {
    return {
      title: this.page.title,
      meta: ogMeta({
        title: this.page.title,
        description: 'Invoice.build is an invoice builder for Ethereum tokens. It makes creating an issuing invoices in Ethereum and a selection of Ethereum based stablecoins extremely simple.',
        url: `https://invoice.build/${this.page.slug}`
      })
    }
  }
}
</script>
