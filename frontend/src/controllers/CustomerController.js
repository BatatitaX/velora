export class CustomerController {
  constructor(eventBus, supabaseService) {
    this.eventBus = eventBus
    this.supabase = supabaseService
    this.customer = null
  }

  watchAuth() {
    return this.supabase.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        this.customer = null
        this.eventBus.emit('customer:changed', null)
        return
      }

      if (['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED', 'PASSWORD_RECOVERY'].includes(event)) {
        try {
          this.customer = await this.supabase.me()
          this.eventBus.emit('customer:changed', this.customer)
        } catch (_error) {
          this.customer = null
          this.eventBus.emit('customer:changed', null)
        }
      }
    })
  }

  async restore() {
    try {
      this.customer = await this.supabase.me()
      this.eventBus.emit('customer:changed', this.customer)
      return this.customer
    } catch (_error) {
      this.customer = null
      this.eventBus.emit('customer:changed', null)
      return null
    }
  }

  async register(data) {
    const result = await this.supabase.register(data)
    this.customer = result.requiresEmailConfirmation ? null : result.customer
    if (this.customer) this.eventBus.emit('customer:changed', this.customer)
    return result
  }

  async login(data) {
    this.customer = await this.supabase.login(data)
    this.eventBus.emit('customer:changed', this.customer)
    return this.customer
  }

  recoverPassword(email) {
    return this.supabase.recoverPassword(email)
  }

  async updateProfile(data) {
    this.customer = await this.supabase.updateProfile(data)
    this.eventBus.emit('customer:changed', this.customer)
    return this.customer
  }

  async uploadAvatar(file) {
    this.customer = await this.supabase.uploadAvatar(file)
    this.eventBus.emit('customer:changed', this.customer)
    return this.customer
  }

  async logout() {
    await this.supabase.logout()
    this.customer = null
    this.eventBus.emit('customer:changed', null)
  }
}
