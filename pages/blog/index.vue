<template>
  <main class="p-4">
    <article class="w-full md:w-2/3 lg:w-1/2">
      <h1 class="font-bold leading-tight text-3xl mb-8">
        Blog
      </h1>
      <ul class="list-disc list-inside">
        <li v-for="(post, i) in posts" :key="i">
          <nuxt-link :to="post.path" class="link">
            {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </article>
  </main>
</template>

<script>
export default {
  layout: 'content',

  async asyncData ({ $content }) {
    let posts
    try {
      posts = await $content('blog')
        .only(['title', 'description', 'publishedAt', 'path'])
        .sortBy('publishedAt', 'asc')
        .limit(6)
        .where({ published: true })
        .fetch()
    } catch (error) {
      return error({ statusCode: 404, message: 'Page not found' })
    }
    return { posts }
  }
}
</script>
