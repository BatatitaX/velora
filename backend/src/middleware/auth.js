import { publicSupabase, supabaseForToken } from '../lib/supabase.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token de acesso ausente.' })
  }

  const { data, error } = await publicSupabase.auth.getUser(token)
  if (error || !data.user) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' })
  }

  req.user = data.user
  req.accessToken = token
  req.supabase = supabaseForToken(token)
  next()
}

export async function requireAdmin(req, res, next) {
  const { data, error } = await req.supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single()

  if (error || data?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito ao administrador.' })
  }

  next()
}
