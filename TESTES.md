# Testes rápidos

1. `GET http://localhost:3001/api/health` deve retornar `ok: true`.
2. Cadastro cria usuário no Supabase Auth e perfil em `public.profiles`.
3. Login retorna sessão e libera `/api/users/profile`.
4. Recuperação de senha solicita e-mail pelo Supabase Auth.
5. `/api/products` aceita busca, categoria, preço e paginação.
6. Perfil permite alterar dados de entrega e foto.
7. `/api/checkout/shipping` valida CEP e retorna valor/prazo demonstrativo.
8. Checkout registra `sales` e `sale_items`, recalcula preço e reduz estoque.
9. `/api/orders` retorna somente os pedidos do usuário autenticado.
10. RLS impede que um cliente consulte perfil, carrinho ou pedido de outro usuário.
11. Endpoints de criação/edição de produto retornam 403 para cliente comum.
12. Webhook de pagamento rejeita requisição sem `x-webhook-secret` válido.
