# MVP: Farmer products visible to customers

For the marketplace to show products that farmers add:

1. **Run the setup once**  
   In Supabase Dashboard → SQL Editor, run the contents of `mvp_products_setup.sql`.

2. **What it does**
   - Creates the `products` table if it doesn’t exist.
   - RLS: farmers can create/update/delete only their own products.
   - RLS: buyers (customers) can **select all** products.

3. **Flow**
   - Farmer logs in → adds a product → it is stored in `products` with their `farmer_id`.
   - Customer opens the marketplace (or buyer dashboard) → app fetches all products from `products`.
   - Because of the “buyers select all” policy, the customer sees every product as soon as it’s added (no approval step).

Customers must be **logged in as buyers** to see products; the marketplace uses the buyer’s auth to pass RLS.
