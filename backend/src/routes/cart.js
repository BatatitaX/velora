import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { productFromRow } from '../utils/mappers.js'

export const cartRouter = Router()
cartRouter.use(requireAuth)

const mapCart = (row) => ({
  productId: row.product_id,
  quantity: row.quantity,
  size: row.size,
  color: row.color,
  product: row.products ? productFromRow(row.products) : null,
})

cartRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('cart_items')
      .select('product_id, quantity, size, color, products(*)')
      .eq('customer_id', req.user.id)
      .order('created_at', { ascending: true })
    if (error) throw error
    res.json((data || []).map(mapCart))
  } catch (error) { next(error) }
})

cartRouter.post('/items', async (req, res, next) => {
  try {
    const productId = String(req.body.productId || '')
    const quantity = Math.max(Number(req.body.quantity || 1), 1)
    if (!productId) return res.status(400).json({ error: 'Produto não informado.' })

    const { data: current } = await req.supabase
      .from('cart_items').select('quantity').eq('customer_id', req.user.id).eq('product_id', productId).maybeSingle()

    const { error } = await req.supabase.from('cart_items').upsert({
      customer_id: req.user.id,
      product_id: productId,
      quantity: (current?.quantity || 0) + quantity,
      size: req.body.size || null,
      color: req.body.color || null,
    }, { onConflict: 'customer_id,product_id' })
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ ok: true })
  } catch (error) { next(error) }
})

cartRouter.put('/items/:productId', async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'Quantidade inválida.' })
    const { error } = await req.supabase.from('cart_items').update({
      quantity,
      size: req.body.size,
      color: req.body.color,
    }).eq('customer_id', req.user.id).eq('product_id', req.params.productId)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ ok: true })
  } catch (error) { next(error) }
})

cartRouter.delete('/items/:productId', async (req, res, next) => {
  try {
    const { error } = await req.supabase.from('cart_items').delete()
      .eq('customer_id', req.user.id).eq('product_id', req.params.productId)
    if (error) return res.status(400).json({ error: error.message })
    res.status(204).end()
  } catch (error) { next(error) }
})
