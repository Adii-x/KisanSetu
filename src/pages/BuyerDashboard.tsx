import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useUserRole } from '@/context/UserRoleContext';

/**
 * Buyer-only dashboard. Protected: must be logged in and role === 'buyer'.
 * Role is always fetched from public.profiles (never trusted from frontend).
 */
const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useUserRole();
  const [authLoading, setAuthLoading] = useState(true);

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
        navigate('/farmer-dashboard');
        return;
      }

      setRole('buyer');
      setAuthLoading(false);
    };

    void checkAuth();
  }, [navigate, setRole]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-1">Buyer Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Manage your orders and browse fresh produce from farmers.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          <Link to="/marketplace">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t('marketplace.title')}</h2>
                <p className="text-sm text-muted-foreground">
                  Browse and buy fresh produce
                </p>
              </div>
            </motion.div>
          </Link>
          <Link to="/orders">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t('orders.title')}</h2>
                <p className="text-sm text-muted-foreground">
                  Track your orders
                </p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BuyerDashboard;
