import { Product } from '../models/Product.js'

export class StoreController {
  constructor(products = [], categories = []) {
    this.products = products
    this.categoryCards = categories
  }

  replaceProducts(products = []) {
    this.products = products.map((product) => product instanceof Product ? product : new Product(product))
    return this.listProducts()
  }

  listProducts() {
    return [...this.products]
  }

  findProduct(id) {
    return this.products.find((product) => product.id === id) ?? null
  }

  listCategories() {
    return ['Todos', ...new Set(this.products.map((product) => product.category))]
  }

  filterProducts({ query = '', category = 'Todos' } = {}) {
    return this.products.filter((product) => product.matches(query, category))
  }
}
