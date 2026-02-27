import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, IndianRupee, ShoppingCart, Store, ArrowRight } from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

const totalOrders = mockOrders.length;
const totalSpent = mockOrders.reduce((sum, o) => sum + o.price, 0);
const activeOrders = mockOrders.filter(o => o.status !== 'delivered').length;

const BuyerDashboardPage = () => {
  const { t } = useTranslation();
  const { totalItems } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-10"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-lg">Overview of your orders and shopping.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
            </div>
          </div>
          <Link to="/buyer/orders" className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline">View orders <ArrowRight className="h-4 w-4" /></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold text-foreground">{activeOrders}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cart</p>
              <p className="text-2xl font-bold text-foreground">{totalItems} items</p>
            </div>
          </div>
          <Link to="/buyer/cart" className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline">View cart <ArrowRight className="h-4 w-4" /></Link>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link to="/buyer/marketplace">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">{t('marketplace.title')}</h2>
              <p className="text-sm text-muted-foreground">Browse and buy fresh produce from farmers</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary shrink-0 ml-auto" />
          </motion.div>
        </Link>
        <Link to="/buyer/orders">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">{t('orders.title')}</h2>
              <p className="text-sm text-muted-foreground">Track and manage your orders</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary shrink-0 ml-auto" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default BuyerDashboardPage;
