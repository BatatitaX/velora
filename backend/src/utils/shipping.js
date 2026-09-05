export function calculateShipping(cepInput, subtotal = 0) {
  const cep = String(cepInput || '').replace(/\D/g, '')
  if (cep.length !== 8) throw new Error('CEP inválido. Informe 8 dígitos.')

  if (Number(subtotal) >= 299) {
    return { cep, service: 'Padrão', cost: 0, days: 3, label: 'Frete grátis' }
  }

  const first = Number(cep[0])
  if (first <= 3) return { cep, service: 'Padrão', cost: 14.9, days: 3, label: 'Entrega estimada em 3 dias úteis' }
  if (first <= 6) return { cep, service: 'Padrão', cost: 19.9, days: 4, label: 'Entrega estimada em 4 dias úteis' }
  return { cep, service: 'Padrão', cost: 24.9, days: 5, label: 'Entrega estimada em 5 dias úteis' }
}
