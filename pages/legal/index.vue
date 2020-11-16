<template>
  <main class="p-4">
    <article class="w-full">
      <h1 class="font-bold leading-tight text-3xl mb-8">
        Imprint
      </h1>

      <h2 class="font-bold">
        Remotely Digital LTD
      </h2>
      <p>
        272 Bath Street,<br>
        Glasgow,<br>
        United Kingdom,<br>
        G2 4JR
      </p>
      <div class="flex flex-col sm:flex-row mt-8">
        <span class="w-full sm:w-1/4 md:1/5 lg:w-1/6 font-bold">
          Email:
        </span>
        <span>
          gareth@remotely.digital
        </span>
      </div>
      <div class="flex flex-col sm:flex-row mt-4">
        <span class="w-full sm:w-1/4 md:1/5 lg:w-1/6 font-bold">
          Represented by:
        </span>
        <span>
          Gareth Fuller (director)
        </span>
      </div>
      <div class="flex flex-col sm:flex-row mt-4">
        <span class="w-full sm:w-1/4 md:1/5 lg:w-1/6 font-bold">
          Company number:
        </span>
        <span>
          SC417378
        </span>
      </div>
      <div class="flex flex-col sm:flex-row mt-4">
        <span class="w-full sm:w-1/4 md:1/5 lg:w-1/6 font-bold">
          VAT number:
        </span>
        <span>
          325979362
        </span>
      </div>
      <div class="flex flex-col sm:flex-row mt-4">
        <span class="w-full sm:w-1/4 md:1/5 lg:w-1/6 font-bold">
          Policies:
        </span>
        <div>
          <nuxt-link to="/legal/terms" class="link">Terms &amp; Conditions</nuxt-link>
          |
          <nuxt-link to="/legal/terms" class="link">Privacy Policy</nuxt-link>
        </div>
      </div>
    </article>
  </main>
</template>

<script>
export default {
  layout: 'content'
}
</script>
