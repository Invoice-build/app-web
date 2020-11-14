<template>
  <main class="p-4">
    <article class="w-full md:w-2/3 lg:w-1/2">
      <span class="text-sm text-gray-400">
        Updated {{ page.modifiedAt }}
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
    let page
    try {
      page = await $content(`legal/${route.params.slug}`).fetch()
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
        description: '',
        url: `https://invoice.build/legal/${this.page.slug}`
      })
    }
  }
}
</script>

<style>
.nuxt-content h1,
.nuxt-content h2,
.nuxt-content h3,
.nuxt-content h4,
.nuxt-content h5 { @apply font-bold leading-tight; }

.nuxt-content h2,
.nuxt-content h3,
.nuxt-content h4,
.nuxt-content h5 { @apply mt-8 mb-2; }

.nuxt-content h1 { @apply text-3xl mb-8; }
.nuxt-content h2 { @apply text-2xl; }
.nuxt-content h3 { @apply text-xl; }
.nuxt-content h4 { @apply text-lg; }
.nuxt-content h5 { @apply text-base; }

.nuxt-content p { @apply text-base mb-4; }
.nuxt-content a { @apply text-blue-500; }

.nuxt-content ol { @apply list-decimal ml-8 mb-6 text-base; }
.nuxt-content ul { @apply list-disc ml-8 mb-6 text-base; }
.nuxt-content li { @apply mb-3; }
.nuxt-content li img { @apply my-2; }

.nuxt-content img { @apply my-4 rounded; }
</style>
