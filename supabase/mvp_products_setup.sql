-- ============================================================
-- MVP: Products table + RLS so customers see farmer products
-- Run this in Supabase SQL Editor once. After this:
-- - Farmers can add/edit/delete their own products.
-- - Customers see all products in the marketplace as soon as
--   farmers add them (no approval step).
-- ============================================================

-- 1) Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  price numeric not null,
  quantity integer not null default 0,
  category text,
  unit text default 'kg',
  image_url text,
  created_at timestamptz not null default now()
);

-- 2) RLS
alter table public.products enable row level security;
alter table public.products force row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.products to authenticated;

-- 3) Drop old select policy if present (from initial setup)
drop policy if exists "Products: select own" on public.products;

-- 4) Farmers: select only their own products (for their dashboard)
create policy "Products: farmers select own"
  on public.products for select to authenticated
  using (auth.uid() = farmer_id);

-- 5) Buyers: select ALL products (marketplace visible to customers)
create policy "Products: buyers select all"
  on public.products for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'buyer'
    )
  );

-- 6) Farmers: insert own
drop policy if exists "Products: insert own" on public.products;
create policy "Products: insert own"
  on public.products for insert to authenticated
  with check (auth.uid() = farmer_id);

-- 7) Farmers: update own
drop policy if exists "Products: update own" on public.products;
create policy "Products: update own"
  on public.products for update to authenticated
  using (auth.uid() = farmer_id)
  with check (auth.uid() = farmer_id);

-- 8) Farmers: delete own
drop policy if exists "Products: delete own" on public.products;
create policy "Products: delete own"
  on public.products for delete to authenticated
  using (auth.uid() = farmer_id);
