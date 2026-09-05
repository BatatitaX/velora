import { Router } from 'express'
import { env } from '../config/env.js'
import { publicSupabase } from '../lib/supabase.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (name.length < 2) return res.status(400).json({ error: 'Informe o nome do cliente.' })
    if (!email) return res.status(400).json({ error: 'Informe o e-mail.' })
    if (password.length < 6) return res.status(400).json({ error: 'A senha precisa ter pelo menos 6 caracteres.' })

    const { data, error } = await publicSupabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) return res.status(400).json({ error: error.message })

    res.status(201).json({
      user: data.user ? { id: data.user.id, email: data.user.email, name } : null,
      session: data.session,
      requiresEmailConfirmation: !data.session,
    })
  } catch (error) { next(error) }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    const { data, error } = await publicSupabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(401).json({ error: error.message })
    res.json({ user: data.user, session: data.session })
  } catch (error) { next(error) }
})

authRouter.post('/recover', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    if (!email) return res.status(400).json({ error: 'Informe o e-mail.' })

    const { error } = await publicSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.frontendUrl}/#profile`,
    })
    if (error) return res.status(400).json({ error: error.message })
    res.json({ ok: true, message: 'Se o e-mail estiver cadastrado, o Supabase enviará a recuperação.' })
  } catch (error) { next(error) }
})
