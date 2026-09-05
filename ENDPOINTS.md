# Endpoints REST

Base local: `http://localhost:3001/api`

## Autenticação e usuários

| Método | Endpoint | Função |
|---|---|---|
| POST | `/auth/register` | Cria cliente usando Supabase Auth |
| POST | `/auth/login` | Autentica e retorna sessão Supabase |
| POST | `/auth/recover` | Solicita recuperação de senha por e-mail |
| GET | `/users/profile` | Retorna perfil do usuário logado |
| PUT | `/users/profile` | Atualiza nome, telefone e endereço |
| POST | `/users/avatar` | Envia foto para Supabase Storage |

## Produtos e categorias

| Método | Endpoint | Função |
|---|---|---|
| GET | `/products` | Lista produtos; aceita `q`, `category`, `minPrice`, `maxPrice`, `page`, `limit` |
| GET | `/products/:id` | Detalha um produto |
| POST | `/products` | Cadastra produto (Admin) |
| PUT | `/products/:id` | Atualiza produto/estoque (Admin) |
| DELETE | `/products/:id` | Desativa produto (Admin) |
| GET | `/categories` | Lista categorias |

## Carrinho

| Método | Endpoint | Função |
|---|---|---|
| GET | `/cart` | Retorna o carrinho do usuário |
| POST | `/cart/items` | Adiciona/aumenta produto |
| PUT | `/cart/items/:productId` | Altera quantidade/opções |
| DELETE | `/cart/items/:productId` | Remove produto |

## Checkout e pedidos

| Método | Endpoint | Função |
|---|---|---|
| POST | `/checkout/shipping` | Calcula frete demonstrativo a partir do CEP |
| POST | `/orders` | Cria o pedido, valida estoque/preços e simula pagamento |
| GET | `/orders` | Histórico do usuário |
| GET | `/orders/:id` | Detalhes de um pedido |
| POST | `/orders/webhook` | Recebe atualização do pagamento; protegido por `x-webhook-secret` |

## Exemplos

### Filtros de produto

```http
GET /api/products?q=blazer&category=Jaquetas&minPrice=100&maxPrice=300
```

### Frete

```json
POST /api/checkout/shipping
{
  "cep": "12580-360",
  "subtotal": 189.90
}
```

### Criar pedido

```json
POST /api/orders
Authorization: Bearer <token>
{
  "cep": "12580-360",
  "paymentMethod": "fake_pix",
  "items": [
    { "productId": "hoodie-aura", "quantity": 1, "size": "M", "color": "#c8b9db" }
  ]
}
```
