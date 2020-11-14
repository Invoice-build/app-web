export const title = 'Invoice.build - Invoice in Ethereum tokens'

export const ogMeta = ({
  title = 'Invoice.build - Invoice in Ethereum tokens',
  description = 'Build and issue Ethereum token invoices with simple payment pages, PDF downloads and payment notifications.',
  siteName = 'Invoice.build',
  url = 'https://invoice.build',
  image = 'https://invoice.build/images/og_image.png'
} = {}) => {
  return [
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:title', name: 'og:title', content: title },
    { hid: 'og:site_name', name: 'og:site_name', content: siteName },
    {
      hid: 'og:description',
      name: 'og:description',
      content: description
    },
    { hid: 'og:url', name: 'og:url', content: url },
    {
      hid: 'og:image',
      name: 'og:image',
      content: image
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    { hid: 'twitter:site', name: 'twitter:site', content: '@invoicebuild' },
    {
      hid: 'twitter:creator',
      name: 'twitter:creator',
      content: '@garethafuller'
    },
    { hid: 'twitter:title', name: 'twitter:title', content: title },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: image
    }
  ]
}
