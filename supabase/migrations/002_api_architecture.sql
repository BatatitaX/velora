-- VELORA — evolução para arquitetura Front-end -> API REST -> Supabase
-- Execute este arquivo se o velora.sql antigo já foi executado no projeto.

-- Dados complementares do cliente
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists zip_code text;
alter table public.profiles add column if not exists street text;
alter table public.profiles add column if not exists number text;
alter table public.profiles add column if not exists complement text;
alter table public.profiles add column if not exists neighborhood text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists state text;
alter table public.profiles add column if not exists role text not null default 'customer';

-- Um usuário autenticado pode alterar os próprios dados, mas não pode se promover a admin.
revoke update on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (name, avatar_url, phone, zip_code, street, number, complement, neighborhood, city, state)
on public.profiles to authenticated;

-- Carrinho persistido no Supabase para os endpoints /api/cart.
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  size text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

alter table public.cart_items enable row level security;

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

drop policy if exists "carrinho: cliente lê o próprio" on public.cart_items;
drop policy if exists "carrinho: cliente adiciona no próprio" on public.cart_items;
drop policy if exists "carrinho: cliente atualiza o próprio" on public.cart_items;
drop policy if exists "carrinho: cliente remove do próprio" on public.cart_items;

create policy "carrinho: cliente lê o próprio"
on public.cart_items for select to authenticated
using (auth.uid() = customer_id);

create policy "carrinho: cliente adiciona no próprio"
on public.cart_items for insert to authenticated
with check (auth.uid() = customer_id);

create policy "carrinho: cliente atualiza o próprio"
on public.cart_items for update to authenticated
using (auth.uid() = customer_id)
with check (auth.uid() = customer_id);

create policy "carrinho: cliente remove do próprio"
on public.cart_items for delete to authenticated
using (auth.uid() = customer_id);

grant select, insert, update, delete on public.cart_items to authenticated;

-- Permissões administrativas do catálogo. O role só pode ser definido por SQL/dashboard.
drop policy if exists "produtos: admin cadastra" on public.products;
drop policy if exists "produtos: admin atualiza" on public.products;
drop policy if exists "produtos: admin remove" on public.products;

create policy "produtos: admin cadastra"
on public.products for insert to authenticated
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "produtos: admin atualiza"
on public.products for update to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "produtos: admin remove"
on public.products for delete to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- CEP usado no pedido.
alter table public.sales add column if not exists shipping_cep text;

-- Substitui a função antiga pela versão usada pela API REST.
drop function if exists public.create_sale(jsonb);
drop function if exists public.create_sale(jsonb, text, text);

create function public.create_sale(
  p_items jsonb,
  p_cep text default null,
  p_payment_method text default 'fake_card'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_sale_id uuid := gen_random_uuid();
  v_subtotal numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_total numeric(10,2) := 0;
  v_reference text := 'FAKE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_line_total numeric(10,2);
  v_cep text := nullif(regexp_replace(coalesce(p_cep, ''), '[^0-9]', '', 'g'), '');
  v_first_digit integer;
  v_payment_method text := case when p_payment_method in ('fake_card', 'fake_pix') then p_payment_method else 'fake_card' end;
begin
  if v_user_id is null then
    raise exception 'Faça login antes de finalizar a compra.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'A venda precisa ter pelo menos um item.';
  end if;

  if v_cep is not null and char_length(v_cep) <> 8 then
    raise exception 'CEP inválido. Informe 8 dígitos.';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(coalesce((v_item ->> 'quantity')::integer, 1), 1);

    select * into v_product
    from public.products
    where id = v_item ->> 'productId'
      and active = true
    for update;

    if not found then
      raise exception 'Produto % não encontrado.', v_item ->> 'productId';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Estoque insuficiente para %.', v_product.name;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  if v_subtotal >= 299 then
    v_shipping := 0;
  elsif v_cep is null then
    v_shipping := 19.90;
  else
    v_first_digit := substr(v_cep, 1, 1)::integer;
    if v_first_digit <= 3 then
      v_shipping := 14.90;
    elsif v_first_digit <= 6 then
      v_shipping := 19.90;
    else
      v_shipping := 24.90;
    end if;
  end if;

  v_total := v_subtotal + v_shipping;

  insert into public.sales (
    id, customer_id, status, subtotal, shipping_cost, shipping_cep, total,
    payment_method, payment_status, payment_reference
  ) values (
    v_sale_id, v_user_id, 'confirmado', v_subtotal, v_shipping, v_cep, v_total,
    v_payment_method, 'approved', v_reference
  );

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(coalesce((v_item ->> 'quantity')::integer, 1), 1);

    select * into v_product
    from public.products
    where id = v_item ->> 'productId'
    for update;

    v_line_total := v_product.price * v_quantity;

    insert into public.sale_items (
      sale_id, product_id, product_name, quantity, size, color, unit_price, subtotal
    ) values (
      v_sale_id,
      v_product.id,
      v_product.name,
      v_quantity,
      nullif(v_item ->> 'size', ''),
      nullif(v_item ->> 'color', ''),
      v_product.price,
      v_line_total
    );

    update public.products
    set stock = stock - v_quantity
    where id = v_product.id;
  end loop;

  return jsonb_build_object(
    'id', v_sale_id,
    'status', 'confirmado',
    'subtotal', v_subtotal,
    'shippingCost', v_shipping,
    'shippingCep', v_cep,
    'total', v_total,
    'createdAt', now(),
    'payment', jsonb_build_object(
      'method', v_payment_method,
      'status', 'approved',
      'reference', v_reference
    )
  );
end;
$$;

revoke all on function public.create_sale(jsonb, text, text) from public;
grant execute on function public.create_sale(jsonb, text, text) to authenticated;

-- Para transformar uma conta em administrador, rode manualmente trocando o e-mail:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@velora.com');
