import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { profileFromRows } from '../utils/mappers.js'

export const usersRouter = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
})

async function readProfile(req) {
  const { data, error } = await req.supabase
    .from('profiles')
    .select('name, avatar_url, phone, zip_code, street, number, complement, neighborhood, city, state, role')
    .eq('id', req.user.id)
    .maybeSingle()
  if (error) throw error
  return profileFromRows(req.user, data)
}

usersRouter.get('/profile', requireAuth, async (req, res, next) => {
  try { res.json(await readProfile(req)) } catch (error) { next(error) }
})

usersRouter.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const address = req.body.address || {}
    const payload = {
      name: req.body.name == null ? undefined : String(req.body.name).trim(),
      phone: req.body.phone == null ? undefined : String(req.body.phone).trim(),
      zip_code: address.cep == null ? undefined : String(address.cep).replace(/\D/g, ''),
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state == null ? undefined : String(address.state).trim().toUpperCase().slice(0, 2),
    }
    const clean = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
    const { error } = await req.supabase.from('profiles').update(clean).eq('id', req.user.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json(await readProfile(req))
  } catch (error) { next(error) }
})

usersRouter.post('/avatar', requireAuth, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Selecione uma imagem válida.' })
    const extension = req.file.originalname.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${req.user.id}/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await req.supabase.storage
      .from('avatars')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: false })
    if (uploadError) return res.status(400).json({ error: uploadError.message })

    const { data } = req.supabase.storage.from('avatars').getPublicUrl(path)
    const { error: profileError } = await req.supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', req.user.id)
    if (profileError) return res.status(400).json({ error: profileError.message })

    res.json(await readProfile(req))
  } catch (error) { next(error) }
})
