-- ============================================================
-- RLS: Allow buyers to view all products (Run in Supabase SQL Editor)
-- Farmers: can only see their own products.
-- Buyers: can see ALL products (for marketplace).
-- ============================================================

-- Remove the existing "only own" select policy
drop policy if exists "Products: select own" on public.products;

-- Farmers: select only own products
create policy "Products: farmers select own"
  on public.products
  for select
  to authenticated
  using (auth.uid() = farmer_id);

-- Buyers: select all products (for marketplace browse)
create policy "Products: buyers select all"
  on public.products
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'buyer'
    )
  );
