<template>
  <main class="p-4">
    <article class="w-full md:w-2/3 lg:w-1/2">
      <h1 class="font-bold leading-tight text-3xl mb-8">
        Our Blog
      </h1>
      <ul class="list-disc ml-4">
        <li v-for="(post, i) in posts" :key="i">
          <nuxt-link :to="post.path" class="link">
            {{ post.title }}
          </nuxt-link>
          <div class="text-xs text-gray-600">
            Published {{ post.publishedAt }} by
            <a :href="`https://twitter.com/${post.author_twitter}`" target="_blank" rel="noreferrer">
              {{ post.author_name }}
            </a>
          </div>
        </li>
      </ul>
    </article>
  </main>
</template>

<script>
import { ogMeta } from '~/lib/meta'

export default {
  layout: 'content',

  async asyncData ({ $content }) {
    let posts
    try {
      posts = await $content('blog')
        .only(['title', 'description', 'publishedAt', 'path', 'author_name', 'author_twitter'])
        .sortBy('publishedAt', 'asc')
        .limit(6)
        .where({ published: true })
        .fetch()
    } catch (error) {
      return error({ statusCode: 404, message: 'Page not found' })
    }
    return { posts }
  },

  head () {
    return {
      title: 'Invoice.build Blog',
      meta: ogMeta({
        title: 'Invoice.build Blog',
        description: 'The official blog for invoice.build. Here we share our journey, thoughts, stories and ideas.',
        url: 'https://invoice.build/blog'
      })
    }
  }
}
</script>
