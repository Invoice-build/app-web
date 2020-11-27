<template>
  <main class="p-4">
    <article class="w-full md:w-2/3 lg:w-1/2">
      <span class="text-sm text-gray-400">
        Published {{ page.publishedAt }}
      </span>
      <nuxt-content :document="page" />
    </article>
  </main>
</template>

<script>
import { ogMeta } from '~/lib/meta'

export default {
  layout: 'content',

  async asyncData ({ $content, route }) {
    const slug = route.params.slug || 'index'

    let page
    try {
      page = await $content(`blog/${slug}`).fetch()
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
        description: this.page.description,
        url: `https://invoice.build/blog/${this.page.slug}`,
        image: this.page.image
      }),
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: `{"@context": "https://schema.org","@type": "Article","headline": ${this.page.title},"image": [${this.page.image}],"datePublished": ${this.page.publishedTimestamp},"dateModified": ${this.page.modifiedTimestamp}}`,
          type: 'application/ld+json',
          charset: 'utf-8'
        }
      ]
    }
  }
}
</script>
