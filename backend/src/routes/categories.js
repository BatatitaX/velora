import { Router } from 'express'
import { publicSupabase } from '../lib/supabase.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await publicSupabase.from('products').select('category').eq('active', true)
    if (error) throw error
    res.json([...new Set((data || []).map((row) => row.category))].sort())
  } catch (error) { next(error) }
})
