export default class InvoiceCalculator {
  constructor (invoice) {
    this.invoice = invoice
  }

  subtotal () {
    const lineItems = this.invoice.line_items_attributes
    return lineItems.map(item => item.quantity * item.unit_price).reduce((a, b) => a + b, 0)
  }

  tax () {
    return Number(this.subtotal() * (this.invoice.tax_bps / 10000))
  }

  total () {
    return Number(this.subtotal() + this.tax())
  }
}
