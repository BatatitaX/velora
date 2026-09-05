export class Customer {
  constructor({ id = crypto.randomUUID(), name = '', email = '', password = '', avatarUrl = null } = {}) {
    this.id = id
    this.name = name.trim()
    this.email = email.trim().toLowerCase()
    this.password = password
    this.avatarUrl = avatarUrl
  }

  isValid() { return this.name.length >= 2 && this.email.includes('@') && this.password.length >= 6 }
  publicData() { return { id: this.id, name: this.name, email: this.email, avatarUrl: this.avatarUrl } }
}
