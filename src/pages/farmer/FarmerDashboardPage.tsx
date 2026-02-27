import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  TrendingUp,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { mockOrders, monthlyData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabaseClient';

const FarmerDashboardPage = () => {
  const { t } = useTranslation();
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async (farmerId: string) => {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('farmer_id', farmerId);
    if (!error) setProductCount(count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await fetchCount(user.id);
      else setLoading(false);
    };
    void init();
  }, [fetchCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-10"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Overview of your products, orders, and revenue.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('dashboard.myProducts')}</p>
              <p className="text-2xl font-bold text-foreground">
                {loading ? '—' : productCount}
              </p>
            </div>
          </div>
          <Link
            to="/farmer/products"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Manage <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.totalOrders')}</p>
              <p className="text-2xl font-bold text-foreground">18</p>
            </div>
          </div>
          <Link
            to="/farmer/orders"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View orders <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.totalSales')}</p>
              <p className="text-2xl font-bold text-foreground">₹31,000</p>
            </div>
          </div>
          <Link
            to="/farmer/analytics"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('analytics.growth')}</p>
              <p className="text-2xl font-bold text-foreground">+24%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment & Recent orders + Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment & earnings
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Payouts and transaction history. Payments are processed after order delivery.
        </p>
        <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
          Payments integration coming soon.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.recentOrders')}</h2>
          <div className="space-y-3">
            {mockOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
              >
                <div>
                  <p className="font-medium text-foreground">{order.product}</p>
                  <p className="text-xs text-muted-foreground">{order.buyer} · {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{order.price}</p>
                  <p className="text-xs text-muted-foreground">{t(`orders.status.${order.status}`)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/farmer/orders"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all orders <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">{t('landing.analyticsPreview.title')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('analytics.subtitle')}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 15%, 85%)" />
              <XAxis dataKey="month" stroke="hsl(120, 10%, 40%)" fontSize={12} />
              <YAxis stroke="hsl(120, 10%, 40%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(245, 247, 242, 0.95)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="sales" fill="hsl(122, 39%, 33%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <Link
            to="/farmer/analytics"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Full analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FarmerDashboardPage;
