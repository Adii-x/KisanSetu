import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useUserRole } from '@/context/UserRoleContext';
import { useCart } from '@/context/CartContext';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400';

type ProductRow = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string | null;
  unit: string | null;
  image_url: string | null;
};

type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  unit: string;
};

/**
 * Buyer-only dashboard. Protected: must be logged in and role === 'buyer'.
 * Role is always fetched from public.profiles (never trusted from frontend).
 */
const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useUserRole();
  const { totalItems, totalPrice } = useCart();
  const [authLoading, setAuthLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile?.role) {
        console.error('Profile fetch error on buyer dashboard:', error);
        toast.error('Profile not found. Please complete registration.');
        navigate('/register');
        return;
      }

      if (profile.role !== 'buyer') {
        setRole(profile.role);
        navigate('/farmer/dashboard');
        return;
      }

      setRole('buyer');
      setAuthLoading(false);
    };

    void checkAuth();
  }, [navigate, setRole]);

  const fetchFeatured = useCallback(async () => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, quantity, category, unit, image_url')
      .order('created_at', { ascending: false })
      .limit(6);
    if (error) {
      setFeaturedProducts([]);
    } else {
      setFeaturedProducts(
        (data ?? []).map((row: ProductRow) => ({
          id: row.id,
          name: row.name,
          price: Number(row.price),
          quantity: row.quantity ?? 0,
          category: row.category ?? 'vegetables',
          image: row.image_url ?? DEFAULT_PLACEHOLDER_IMAGE,
          unit: row.unit ?? 'kg',
        }))
      );
    }
    setProductsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) void fetchFeatured();
  }, [authLoading, fetchFeatured]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        <div>
          <h1 className="text-4xl font-bold gradient-text tracking-tight mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your orders and browse fresh produce from farmers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/marketplace">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground">{t('marketplace.title')}</h2>
                <p className="text-sm text-muted-foreground">Browse and buy fresh produce</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/orders">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground">{t('orders.title')}</h2>
                <p className="text-sm text-muted-foreground">Track your orders</p>
              </div>
            </motion.div>
          </Link>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground">Cart</h2>
              <p className="text-sm text-muted-foreground">
                {totalItems} items · ₹{totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
          <Link to="/marketplace" className="sm:col-span-2 lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <span className="font-semibold text-primary">View marketplace</span>
              <ArrowRight className="h-5 w-5 text-primary" />
            </motion.div>
          </Link>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Featured from the farm</h2>
            <Link
              to="/marketplace"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {productsLoading ? (
            <p className="text-muted-foreground">Loading products…</p>
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
              <p className="text-muted-foreground mb-2">No products listed yet.</p>
              <p className="text-sm text-muted-foreground mb-4">Farmers will add produce here. Check back soon or browse the marketplace.</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                Go to marketplace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <Link key={product.id} to="/marketplace">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE; }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                      <p className="text-primary font-bold mt-1">₹{product.price}<span className="text-sm font-normal text-muted-foreground">/{product.unit}</span></p>
                      <p className="text-xs text-muted-foreground mt-1">{t('marketplace.available')}: {product.quantity} {product.unit}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
};

export default BuyerDashboard;
