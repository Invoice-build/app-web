export default async () => {
  const { $content } = require('@nuxt/content')
  const legalContent = await $content('legal').only(['path']).fetch()

  return legalContent.map(page => (page.path === '/index' ? '/' : page.path))
};
