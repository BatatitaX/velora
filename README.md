# VELORA

Solução acadêmica de e-commerce básico organizada em três camadas:

**React (Apresentação) → Express API REST (Regras de Negócio) → Supabase (Dados/Auth/Storage)**

## Executar

1. Execute `supabase/velora.sql` em um projeto novo do Supabase. Se a VELORA antiga já estiver configurada, execute apenas `supabase/migrations/002_api_architecture.sql`.
2. Crie `frontend/.env` a partir de `frontend/.env.example`.
3. Crie `backend/.env` a partir de `backend/.env.example`.
4. Na pasta principal:

```bash
npm install
npm run ecommerce
```

O comando inicia:

- Front-end: http://localhost:5173
- API REST: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## Supabase

O projeto usa Supabase para:

- Auth: cadastro, login, sessão e recuperação de senha;
- Database: produtos, perfis, carrinho, pedidos e itens;
- Storage: fotos de perfil;
- RLS: isolamento dos dados de cada cliente;
- RPC `create_sale`: valida estoque, preço, frete e registra a compra.

A aplicação não armazena senha nem dados reais de cartão. O pagamento é demonstrativo (`fake_card`/`fake_pix`).

## Estrutura

```text
frontend/    React + controllers + views
backend/     Express + API REST + middleware de autenticação
supabase/    esquema SQL, RLS, Storage e RPC
```

Consulte `ARQUITETURA.md` e `ENDPOINTS.md`.

## Bônus REST implementado

A solução inclui os endpoints de autenticação, perfil, produtos, categorias, carrinho, frete, pedidos e webhook descritos na proposta. O webhook usa `SUPABASE_SECRET_KEY` somente no backend e exige `PAYMENT_WEBHOOK_SECRET`. Esses valores não devem ser enviados ao front-end nem versionados.
