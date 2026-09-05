export class FavoritesController {
  constructor(eventBus) {
    this.eventBus = eventBus
    this.ids = []
  }

  toggle(productId) {
    this.ids = this.ids.includes(productId)
      ? this.ids.filter((id) => id !== productId)
      : [...this.ids, productId]
    this.eventBus.emit('favorites:changed', [...this.ids])
  }
}
