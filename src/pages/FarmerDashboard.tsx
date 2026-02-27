import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, IndianRupee, TrendingUp, ShoppingBag, X } from 'lucide-react';
import { mockProducts, Product, mockOrders, monthlyData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(mockProducts.slice(0, 4));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' });

  const stats = [
    { icon: IndianRupee, label: t('analytics.totalSales'), value: '₹31,000', color: 'text-primary' },
    { icon: ShoppingBag, label: t('analytics.totalOrders'), value: '18', color: 'text-secondary' },
    { icon: Package, label: t('dashboard.myProducts'), value: String(products.length), color: 'text-krishi-wheat' },
    { icon: TrendingUp, label: t('analytics.growth'), value: '+24%', color: 'text-krishi-leaf' },
  ];

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success(t('dashboard.productDeleted'));
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ name: product.name, price: String(product.price), quantity: String(product.quantity), category: product.category, unit: product.unit });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.quantity) {
      toast.error(t('dashboard.fillAll'));
      return;
    }
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, name: form.name, price: Number(form.price), quantity: Number(form.quantity), category: form.category, unit: form.unit } : p));
      toast.success(t('dashboard.productUpdated'));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category,
        image: '🌾',
        farmer: 'You',
        unit: form.unit,
      };
      setProducts(prev => [newProduct, ...prev]);
      toast.success(t('dashboard.productAdded'));
    }
    setShowAddModal(false);
    setEditProduct(null);
    setForm({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' });
  };

  const farmerOrders = mockOrders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-1">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('dashboard.subtitle')}</p>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* My Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t('dashboard.myProducts')}</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditProduct(null); setForm({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' }); setShowAddModal(true); }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 btn-glow"
            >
              <Plus className="h-4 w-4" /> {t('dashboard.addProduct')}
            </motion.button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <div className="text-4xl mb-3">{product.image}</div>
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-primary font-bold">₹{product.price}/{product.unit}</p>
                <p className="text-xs text-muted-foreground">{t('marketplace.available')}: {product.quantity} {product.unit}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Edit2 className="h-3 w-3" /> {t('dashboard.edit')}
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    <Trash2 className="h-3 w-3" /> {t('dashboard.delete')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Orders & Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.recentOrders')}</h2>
            <div className="space-y-3">
              {farmerOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground text-sm">{order.product}</p>
                    <p className="text-xs text-muted-foreground">{order.buyer} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">₹{order.price}</p>
                    <p className="text-xs text-muted-foreground">{t(`orders.status.${order.status}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track Your Growth Monthly (farmer-only analytics preview) */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t('landing.analyticsPreview.title')}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              {t('analytics.subtitle')}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 15%, 85%)" />
                <XAxis dataKey="month" stroke="hsl(120, 10%, 40%)" fontSize={12} />
                <YAxis stroke="hsl(120, 10%, 40%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(245, 247, 242, 0.95)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(122, 39%, 33%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">{editProduct ? t('dashboard.editProduct') : t('dashboard.addProduct')}</h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-muted/50"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('dashboard.productName')} className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder={t('dashboard.price')} type="number" className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30" />
                  <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder={t('marketplace.quantity')} type="number" className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30" />
                </div>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/30">
                  {['vegetables', 'fruits', 'grains', 'spices', 'dairy'].map(c => (
                    <option key={c} value={c}>{t(`marketplace.${c}`)}</option>
                  ))}
                </select>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow">
                  {editProduct ? t('dashboard.save') : t('dashboard.addProduct')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerDashboard;
