export class Product {
  constructor({ id, name, category, price, oldPrice = null, badge = null, image, colors = [], sizes = [], description = '', stock = 0 }) {
    this.id = id
    this.name = name
    this.category = category
    this.price = Number(price)
    this.oldPrice = oldPrice == null ? null : Number(oldPrice)
    this.badge = badge
    this.image = image
    this.colors = colors
    this.sizes = sizes
    this.description = description
    this.stock = Number(stock || 0)
  }

  matches(query = '', category = 'Todos') {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    const matchesCategory = category === 'Todos' || this.category === category
    const matchesText = !normalizedQuery || `${this.name} ${this.category} ${this.description}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
    return matchesCategory && matchesText
  }

  hasDiscount() {
    return Boolean(this.oldPrice && this.oldPrice > this.price)
  }
}
