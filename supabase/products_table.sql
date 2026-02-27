-- ============================================================
-- Products table for farmer uploads (Run in Supabase SQL Editor)
-- ============================================================

-- Table: public.products
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

-- Enable RLS
alter table public.products enable row level security;
alter table public.products force row level security;

-- Grant usage to authenticated role
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.products to authenticated;

-- Policy: Insert — only own row (auth.uid() = farmer_id)
drop policy if exists "Products: insert own" on public.products;
create policy "Products: insert own"
  on public.products
  for insert
  to authenticated
  with check (auth.uid() = farmer_id);

-- Policy: Select — only own products
drop policy if exists "Products: select own" on public.products;
create policy "Products: select own"
  on public.products
  for select
  to authenticated
  using (auth.uid() = farmer_id);

-- Policy: Update — only own products
drop policy if exists "Products: update own" on public.products;
create policy "Products: update own"
  on public.products
  for update
  to authenticated
  using (auth.uid() = farmer_id)
  with check (auth.uid() = farmer_id);

-- Policy: Delete — only own products
drop policy if exists "Products: delete own" on public.products;
create policy "Products: delete own"
  on public.products
  for delete
  to authenticated
  using (auth.uid() = farmer_id);
