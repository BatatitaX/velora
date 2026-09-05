export class EventBus {
  constructor() {
    this.listeners = new Map()
  }

  on(eventName, handler) {
    const handlers = this.listeners.get(eventName) ?? new Set()
    handlers.add(handler)
    this.listeners.set(eventName, handlers)
    return () => this.off(eventName, handler)
  }

  off(eventName, handler) {
    this.listeners.get(eventName)?.delete(handler)
  }

  emit(eventName, payload) {
    this.listeners.get(eventName)?.forEach((handler) => handler(payload))
  }
}

export const eventBus = new EventBus()
