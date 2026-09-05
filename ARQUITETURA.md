# Arquitetura da VELORA

```text
┌──────────────────────────────┐
│ Apresentação                 │
│ React + Vite                 │
└──────────────┬───────────────┘
               │ HTTP/JSON
               ▼
┌──────────────────────────────┐
│ Back-end / API Gateway       │
│ Express REST API             │
│ autenticação, catálogo,      │
│ clientes, frete e pedidos    │
└──────────────┬───────────────┘
               │ Supabase SDK + JWT
               ▼
┌──────────────────────────────┐
│ Armazenamento / Serviços     │
│ Supabase                     │
│ Database · Auth · Storage    │
│ RLS · RPC                    │
└──────────────────────────────┘
```

## Camadas

### Front-end (Apresentação)

React e Vite exibem catálogo, busca, filtros, produto, carrinho, perfil, endereço e checkout. A interface reage a eventos por meio do `EventBus` e mantém separação entre models, controllers e views.

### Back-end (API/Lógica)

A API Express funciona como Gateway de API. Ela recebe as requisições do front-end, valida dados, autentica o JWT do Supabase e direciona para os serviços de produtos, clientes, carrinho, frete e pedidos.

### Banco e serviços gerenciados

Supabase é a camada de persistência e infraestrutura. O Database armazena produtos, perfis, carrinho e histórico de compras; Auth cuida das credenciais; Storage guarda o avatar; RLS impede acesso aos dados de outro cliente; a RPC `create_sale` recalcula preço e estoque no servidor.

## Componentes essenciais

- **Gateway de API:** Express em `/api`.
- **Serviço de Produtos:** `/api/products` e `/api/categories`.
- **Serviço de Clientes:** `/api/auth`, `/api/users/profile` e avatar.
- **Serviço de Carrinho:** `/api/cart`.
- **Serviço de Frete:** `/api/checkout/shipping`.
- **Serviço de Pedidos/Pagamento:** `/api/orders` + RPC `create_sale`; pagamento é simulado.

## Segurança

- Senhas ficam exclusivamente no Supabase Auth.
- O front-end usa apenas chave publicável do Supabase.
- A API valida o Bearer Token antes de acessar dados privados.
- RLS restringe perfil, carrinho e pedidos ao usuário autenticado.
- O cliente não define o preço final do pedido: a RPC consulta os preços na tabela `products`.
- Administradores são controlados por `profiles.role`, sem permitir autopromoção pelo front-end.
