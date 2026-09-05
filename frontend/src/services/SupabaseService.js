import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

if (!supabaseUrl || !supabaseKey) {
  console.warn('VELORA: configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no frontend/.env.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

export class SupabaseService {
  async request(path, options = {}, authenticated = false) {
    const headers = new Headers(options.headers || {})
    if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')

    if (authenticated) {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) throw new Error('Faça login para continuar.')
      headers.set('Authorization', `Bearer ${token}`)
    }

    let response
    try {
      response = await fetch(`${apiUrl}${path}`, { ...options, headers })
    } catch (_error) {
      throw new Error('Não foi possível conectar à API da VELORA. Execute npm run ecommerce na pasta principal.')
    }

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await response.json() : null
    if (!response.ok) throw new Error(data?.error || `Erro HTTP ${response.status}`)
    return data
  }

  onAuthStateChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => callback(event, session), 0)
    })
    return () => data.subscription.unsubscribe()
  }

  async checkConnection() {
    await this.request('/health')
    return true
  }

  async listProducts() {
    const data = await this.request('/products?limit=100')
    return data.items || []
  }

  async register({ name, email, password }) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    if (result.session?.access_token && result.session?.refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      })
      if (error) throw new Error(error.message)
    }

    return {
      customer: result.requiresEmailConfirmation ? result.user : await this.me(),
      requiresEmailConfirmation: result.requiresEmailConfirmation,
    }
  }

  async login({ email, password }) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const { error } = await supabase.auth.setSession({
      access_token: result.session.access_token,
      refresh_token: result.session.refresh_token,
    })
    if (error) throw new Error(error.message)
    return this.me()
  }

  async recoverPassword(email) {
    return this.request('/auth/recover', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async me() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    return this.request('/users/profile', {}, true)
  }

  async updateProfile(payload) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, true)
  }

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  async uploadAvatar(file) {
    if (!file?.type?.startsWith('image/')) throw new Error('Selecione um arquivo de imagem válido.')
    if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5 MB.')
    const form = new FormData()
    form.append('avatar', file)
    return this.request('/users/avatar', { method: 'POST', body: form }, true)
  }

  async createSale(items, options = {}) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items,
        cep: options.cep || null,
        paymentMethod: options.paymentMethod || 'fake_card',
      }),
    }, true)
  }

  async mySales() {
    return this.request('/orders', {}, true)
  }

  async shipping(cep, subtotal = 0) {
    return this.request('/checkout/shipping', {
      method: 'POST',
      body: JSON.stringify({ cep, subtotal }),
    })
  }
}
