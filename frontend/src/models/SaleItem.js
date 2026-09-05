export class SaleItem {
  constructor({ product, size, color, quantity = 1 }) {
    this.product = product
    this.size = size
    this.color = color
    this.quantity = quantity
  }

  get subtotal() {
    return this.product.price * this.quantity
  }
}
