import { SaleItem } from './SaleItem.js'

export class Sale {
  constructor({ id = crypto.randomUUID(), customer = null, items = [], status = 'em_aberto', createdAt = new Date(), shippingCostOverride = null, shippingCep = '' } = {}) {
    this.id = id
    this.customer = customer
    this.items = items
    this.status = status
    this.createdAt = createdAt
    this.shippingCostOverride = shippingCostOverride
    this.shippingCep = shippingCep
  }

  addProduct(product, options = {}) {
    const item = new SaleItem({
      product,
      size: options.size ?? product.sizes[0],
      color: options.color ?? product.colors[0],
      quantity: options.quantity ?? 1,
    })
    this.items = [...this.items, item]
    return item
  }

  removeItem(index) {
    this.items = this.items.filter((_, itemIndex) => itemIndex !== index)
  }

  attachCustomer(customer) {
    this.customer = customer
  }

  setShipping({ cep = '', cost = null } = {}) {
    this.shippingCep = cep
    this.shippingCostOverride = cost == null ? null : Number(cost)
  }

  get subtotal() {
    return this.items.reduce((total, item) => total + item.subtotal, 0)
  }

  get shippingCost() {
    if (!this.items.length || this.subtotal >= 299) return 0
    if (Number.isFinite(this.shippingCostOverride)) return this.shippingCostOverride
    return 19.9
  }

  get total() {
    return this.subtotal + this.shippingCost
  }

  finalize() {
    if (!this.customer) throw new Error('Cliente obrigatório para finalizar a venda.')
    if (!this.items.length) throw new Error('A venda precisa ter pelo menos um item.')
    this.status = 'registrada'
    return this
  }

  snapshot() {
    return {
      id: this.id,
      customer: this.customer,
      items: [...this.items],
      status: this.status,
      createdAt: this.createdAt,
      shippingCep: this.shippingCep,
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      total: this.total,
    }
  }
}
