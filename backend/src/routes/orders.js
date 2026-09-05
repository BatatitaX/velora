import { Router } from 'express'
import { env } from '../config/env.js'
import { adminSupabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { saleFromRow } from '../utils/mappers.js'

export const ordersRouter = Router()

// Endpoint público no sentido de não exigir sessão de cliente, mas protegido por segredo.
// Em produção o gateway de pagamento enviaria uma assinatura própria.
ordersRouter.post('/webhook', async (req, res, next) => {
  try {
    if (!env.paymentWebhookSecret || !adminSupabase) {
      return res.status(503).json({ error: 'Webhook não configurado no backend.' })
    }
    if (req.headers['x-webhook-secret'] !== env.paymentWebhookSecret) {
      return res.status(401).json({ error: 'Assinatura do webhook inválida.' })
    }

    const orderId = String(req.body.orderId || '')
    const paymentStatus = String(req.body.paymentStatus || '')
    if (!orderId || !['approved', 'pending', 'rejected', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Payload de pagamento inválido.' })
    }

    const orderStatus = paymentStatus === 'approved'
      ? 'confirmado'
      : paymentStatus === 'refunded'
        ? 'reembolsado'
        : paymentStatus === 'rejected'
          ? 'pagamento_recusado'
          : 'aguardando_pagamento'

    const payload = { payment_status: paymentStatus, status: orderStatus }
    if (req.body.reference) payload.payment_reference = String(req.body.reference)

    const { error } = await adminSupabase.from('sales').update(payload).eq('id', orderId)
    if (error) throw error
    res.json({ ok: true })
  } catch (error) { next(error) }
})

ordersRouter.use(requireAuth)

ordersRouter.post('/', async (req, res, next) => {
  try {
    let items = Array.isArray(req.body.items) ? req.body.items : []

    if (!items.length) {
      const { data, error } = await req.supabase
        .from('cart_items').select('product_id, quantity, size, color').eq('customer_id', req.user.id)
      if (error) throw error
      items = (data || []).map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }))
    }

    if (!items.length) return res.status(400).json({ error: 'O carrinho está vazio.' })

    const { data, error } = await req.supabase.rpc('create_sale', {
      p_items: items,
      p_cep: String(req.body.cep || '').replace(/\D/g, '') || null,
      p_payment_method: req.body.paymentMethod || 'fake_card',
    })
    if (error) return res.status(400).json({ error: error.message })

    await req.supabase.from('cart_items').delete().eq('customer_id', req.user.id)
    res.status(201).json(data)
  } catch (error) { next(error) }
})

ordersRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('sales').select('*, sale_items(*)').eq('customer_id', req.user.id).order('created_at', { ascending: false })
    if (error) throw error
    res.json((data || []).map(saleFromRow))
  } catch (error) { next(error) }
})

ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('sales').select('*, sale_items(*)').eq('customer_id', req.user.id).eq('id', req.params.id).maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Pedido não encontrado.' })
    res.json(saleFromRow(data))
  } catch (error) { next(error) }
})
