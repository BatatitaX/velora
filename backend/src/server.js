import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { publicSupabase } from './lib/supabase.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { productsRouter } from './routes/products.js'
import { categoriesRouter } from './routes/categories.js'
import { cartRouter } from './routes/cart.js'
import { checkoutRouter } from './routes/checkout.js'
import { ordersRouter } from './routes/orders.js'

const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', async (_req, res) => {
  const { error } = await publicSupabase.from('products').select('id').limit(1)
  res.status(error ? 503 : 200).json({
    ok: !error,
    app: 'VELORA API',
    architecture: 'React + Express REST API + Supabase',
    database: 'Supabase',
    error: error?.message,
  })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/cart', cartRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/orders', ordersRouter)

app.use((req, res) => res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` }))
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: error.message || 'Erro interno da API.' })
})

app.listen(env.port, () => {
  console.log(`VELORA API → http://localhost:${env.port}/api`)
})
