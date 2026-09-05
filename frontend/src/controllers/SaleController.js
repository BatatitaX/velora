import { Sale } from '../models/Sale.js'

export class SaleController {
  constructor(storeController, eventBus, supabaseService) {
    this.storeController = storeController
    this.eventBus = eventBus
    this.supabase = supabaseService
    this.sale = new Sale()
  }

  addProduct(productId, options = {}) {
    const product = this.storeController.findProduct(productId)
    if (!product) throw new Error('Produto não encontrado.')
    this.sale.addProduct(product, options)
    this.notify('sale:item-added')
  }

  removeItem(index) {
    this.sale.removeItem(index)
    this.notify('sale:item-removed')
  }

  attachCustomer(customer) {
    this.sale.attachCustomer(customer)
    this.notify('sale:customer-attached')
  }

  async calculateShipping(cep) {
    const shipping = await this.supabase.shipping(cep, this.sale.subtotal)
    this.sale.setShipping(shipping)
    this.notify('sale:shipping-calculated')
    return shipping
  }

  async finalize(customer) {
    if (!customer) throw new Error('Identifique o cliente antes de finalizar.')
    if (!this.sale.items.length) throw new Error('Adicione pelo menos um item ao carrinho.')

    const payload = this.sale.items.map((item) => ({
      productId: item.product.id,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    }))

    const persistedSale = await this.supabase.createSale(payload, { cep: this.sale.shippingCep })
    const completedSale = { ...persistedSale, customer }
    this.eventBus.emit('sale:completed', completedSale)
    this.sale = new Sale({ customer })
    this.notify('sale:reset')
    return completedSale
  }

  history() {
    return this.supabase.mySales()
  }

  notify(reason) {
    this.eventBus.emit('sale:changed', { reason, sale: this.sale.snapshot() })
  }

  snapshot() {
    return this.sale.snapshot()
  }
}
