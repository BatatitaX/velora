import { Router } from 'express'
import { publicSupabase } from '../lib/supabase.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { productFromRow, productToRow } from '../utils/mappers.js'

export const productsRouter = Router()

productsRouter.get('/', async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1)
    const limit = Math.min(Math.max(Number(req.query.limit || 24), 1), 100)
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = publicSupabase.from('products').select('*', { count: 'exact' }).eq('active', true)
    if (req.query.q) query = query.ilike('name', `%${String(req.query.q).trim()}%`)
    if (req.query.category && req.query.category !== 'Todos') query = query.eq('category', req.query.category)
    if (req.query.minPrice) query = query.gte('price', Number(req.query.minPrice))
    if (req.query.maxPrice) query = query.lte('price', Number(req.query.maxPrice))

    const { data, error, count } = await query.order('sort_order', { ascending: true }).range(from, to)
    if (error) throw error
    res.json({ items: (data || []).map(productFromRow), page, limit, total: count || 0 })
  } catch (error) { next(error) }
})

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await publicSupabase
      .from('products').select('*').eq('id', req.params.id).eq('active', true).maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Produto não encontrado.' })
    res.json(productFromRow(data))
  } catch (error) { next(error) }
})

productsRouter.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('products').insert(productToRow(req.body)).select('*').single()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(productFromRow(data))
  } catch (error) { next(error) }
})

productsRouter.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('products').update(productToRow(req.body, true)).eq('id', req.params.id).select('*').single()
    if (error) return res.status(400).json({ error: error.message })
    res.json(productFromRow(data))
  } catch (error) { next(error) }
})

productsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { error } = await req.supabase.from('products').update({ active: false }).eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.status(204).end()
  } catch (error) { next(error) }
})
