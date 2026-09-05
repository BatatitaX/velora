import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env.js'

const options = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
}

export const publicSupabase = createClient(
  env.supabaseUrl,
  env.supabasePublishableKey,
  options,
)

export const adminSupabase = env.supabaseSecretKey
  ? createClient(env.supabaseUrl, env.supabaseSecretKey, options)
  : null

export const supabaseForToken = (token) => createClient(
  env.supabaseUrl,
  env.supabasePublishableKey,
  {
    ...options,
    global: { headers: { Authorization: `Bearer ${token}` } },
  },
)
