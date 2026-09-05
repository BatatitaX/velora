import { Router } from 'express'
import { calculateShipping } from '../utils/shipping.js'

export const checkoutRouter = Router()

checkoutRouter.post('/shipping', (req, res) => {
  try {
    res.json(calculateShipping(req.body.cep, req.body.subtotal))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
