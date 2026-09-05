import 'dotenv/config'

const required = (name) => {
  const value = process.env[name]
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`)
  return value
}

export const env = {
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  supabaseUrl: required('SUPABASE_URL'),
  supabasePublishableKey: required('SUPABASE_PUBLISHABLE_KEY'),
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
}
