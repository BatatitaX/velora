export const productFromRow = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  oldPrice: row.old_price == null ? null : Number(row.old_price),
  badge: row.badge,
  image: row.image,
  colors: Array.isArray(row.colors) ? row.colors : [],
  sizes: Array.isArray(row.sizes) ? row.sizes : [],
  description: row.description || '',
  stock: Number(row.stock || 0),
  active: row.active,
  sortOrder: Number(row.sort_order || 0),
})

export const productToRow = (body, partial = false) => {
  const map = {
    id: body.id,
    name: body.name,
    category: body.category,
    price: body.price,
    old_price: body.oldPrice,
    badge: body.badge,
    image: body.image,
    colors: body.colors,
    sizes: body.sizes,
    description: body.description,
    stock: body.stock,
    active: body.active,
    sort_order: body.sortOrder,
  }

  if (!partial) return map
  return Object.fromEntries(Object.entries(map).filter(([, value]) => value !== undefined))
}

export const saleFromRow = (row) => ({
  id: row.id,
  status: row.status,
  subtotal: Number(row.subtotal),
  shippingCost: Number(row.shipping_cost || 0),
  shippingCep: row.shipping_cep || null,
  total: Number(row.total),
  createdAt: row.created_at,
  payment: {
    method: row.payment_method,
    status: row.payment_status,
    reference: row.payment_reference,
  },
  items: (row.sale_items || []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    unitPrice: Number(item.unit_price),
    subtotal: Number(item.subtotal),
  })),
})

export const profileFromRows = (user, profile) => ({
  id: user.id,
  name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Cliente',
  email: user.email,
  avatarUrl: profile?.avatar_url || null,
  phone: profile?.phone || '',
  address: {
    cep: profile?.zip_code || '',
    street: profile?.street || '',
    number: profile?.number || '',
    complement: profile?.complement || '',
    neighborhood: profile?.neighborhood || '',
    city: profile?.city || '',
    state: profile?.state || '',
  },
  role: profile?.role || 'customer',
})
