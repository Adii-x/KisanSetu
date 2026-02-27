import { useState, useEffect, useCallback, DragEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, IndianRupee, ShoppingBag, Package, TrendingUp, CreditCard } from 'lucide-react';
import { Product, mockOrders, monthlyData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useUserRole } from '@/context/UserRoleContext';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400';

type ProductRow = {
  id: string;
  farmer_id: string;
  name: string;
  price: number;
  quantity: number;
  category: string | null;
  unit: string | null;
  image_url: string | null;
  created_at: string;
};

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    quantity: row.quantity ?? 0,
    category: row.category ?? 'vegetables',
    image: row.image_url ?? DEFAULT_PLACEHOLDER_IMAGE,
    farmer: 'You',
    unit: row.unit ?? 'kg',
  };
}

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useUserRole();
  const [authLoading, setAuthLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProducts = useCallback(async (farmerId: string) => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch products error:', error);
      toast.error(error.message ?? 'Failed to load products.');
      setProducts([]);
    } else {
      setProducts((data ?? []).map(mapRowToProduct));
    }
    setProductsLoading(false);
  }, []);

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
        console.error('Profile fetch error on farmer dashboard:', error);
        toast.error('Profile not found. Please complete registration.');
        navigate('/register');
        return;
      }

      if (profile.role !== 'farmer') {
        setRole(profile.role);
        navigate('/buyer-dashboard');
        return;
      }

      setRole('farmer');
      setCurrentUserId(user.id);
      setAuthLoading(false);
      await fetchProducts(user.id);
    };

    void checkAuth();
  }, [navigate, setRole, fetchProducts]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Delete product error:', error);
      toast.error(error.message ?? t('dashboard.delete') + ' failed.');
      return;
    }
    if (currentUserId) await fetchProducts(currentUserId);
    toast.success(t('dashboard.productDeleted'));
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ name: product.name, price: String(product.price), quantity: String(product.quantity), category: product.category, unit: product.unit });
    setImagePreview(product.image || null);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.price?.trim() || !form.quantity?.trim()) {
      toast.error(t('dashboard.fillAll'));
      return;
    }
    if (!currentUserId) return;
    const priceNum = Number(form.price);
    const quantityNum = Math.max(0, Math.floor(Number(form.quantity)));
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error(t('dashboard.price') + ' must be a valid number.');
      return;
    }

    setSaveLoading(true);
    try {
      if (editProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: form.name.trim(),
            price: priceNum,
            quantity: quantityNum,
            category: form.category,
            unit: form.unit,
            image_url: imagePreview || null,
          })
          .eq('id', editProduct.id)
          .eq('farmer_id', currentUserId);

        if (error) throw error;
        toast.success(t('dashboard.productUpdated'));
      } else {
        const { error } = await supabase.from('products').insert({
          farmer_id: currentUserId,
          name: form.name.trim(),
          price: priceNum,
          quantity: quantityNum,
          category: form.category,
          unit: form.unit,
          image_url: imagePreview || null,
        });

        if (error) throw error;
        toast.success(t('dashboard.productAdded'));
      }
      await fetchProducts(currentUserId);
      setShowAddModal(false);
      setEditProduct(null);
      setForm({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' });
      setImagePreview(null);
    } catch (err: unknown) {
      console.error('Save product error:', err);
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : null;
      toast.error(msg ?? (editProduct ? 'Update failed.' : 'Failed to add product.'));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof e.target?.result === 'string') {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleImageFile(file || null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleImageFile(file);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <p className="text-muted-foreground">Loading your farmer dashboard…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold gradient-text tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground mt-2 text-lg">{t('dashboard.subtitle')}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditProduct(null); setForm({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' }); setShowAddModal(true); }}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-base font-semibold btn-glow shadow-lg"
          >
            <Plus className="h-5 w-5" /> {t('dashboard.addProduct')}
          </motion.button>
        </div>

        <section>
          {productsLoading ? (
            <p className="text-muted-foreground text-lg">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">No products yet.</p>
              <p className="text-sm text-muted-foreground mb-4">Add your first product to start selling.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setEditProduct(null); setForm({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' }); setShowAddModal(true); }}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium"
              >
                {t('dashboard.addProduct')}
              </motion.button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl bg-card border border-border shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE; }}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xl font-bold text-primary mt-1">₹{product.price}<span className="text-sm font-normal text-muted-foreground">/{product.unit}</span></p>
                    <p className="text-sm text-muted-foreground mt-2">{t('marketplace.available')}: {product.quantity} {product.unit}</p>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <Edit2 className="h-4 w-4" /> {t('dashboard.edit')}
                      </button>
                      <button onClick={() => void handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                        <Trash2 className="h-4 w-4" /> {t('dashboard.delete')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Stats + Payments + Analytics + Orders */}
        <div className="mt-12 space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('analytics.totalSales')}</p>
                  <p className="text-xl font-bold text-foreground">₹31,000</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('analytics.totalOrders')}</p>
                  <p className="text-xl font-bold text-foreground">18</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('dashboard.myProducts')}</p>
                  <p className="text-xl font-bold text-foreground">{products.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('analytics.growth')}</p>
                  <p className="text-xl font-bold text-foreground">+24%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment &amp; earnings
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              View your payouts, bank details, and transaction history. Payments are processed securely after order delivery.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <span>Payments integration coming soon.</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.recentOrders')}</h2>
              <div className="space-y-3">
                {mockOrders.slice(0, 4).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
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
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(122, 39%, 33%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                <div
                  className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 bg-muted/30'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('product-image-input')?.click()}
                >
                  <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {t('dashboard.uploadImage') || 'Upload product image'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Drag & drop an image here, or click to browse
                  </p>
                  {imagePreview && (
                    <div className="mt-2 flex justify-center">
                      <img src={imagePreview} alt="Preview" className="h-20 w-28 object-cover rounded-lg shadow-sm" />
                    </div>
                  )}
                </div>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/30">
                  {['vegetables', 'fruits', 'grains', 'spices', 'dairy'].map(c => (
                    <option key={c} value={c}>{t(`marketplace.${c}`)}</option>
                  ))}
                </select>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void handleSave()}
                  disabled={saveLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow disabled:opacity-60"
                >
                  {saveLoading ? 'Saving…' : editProduct ? t('dashboard.save') : t('dashboard.addProduct')}
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
