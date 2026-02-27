import { useState, useEffect, useCallback, DragEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Product } from '@/data/mockData';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

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

const FarmerProductsPage = () => {
  const { t } = useTranslation();
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
      toast.error(error.message ?? 'Failed to load products.');
      setProducts([]);
    } else {
      setProducts((data ?? []).map(mapRowToProduct));
    }
    setProductsLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        await fetchProducts(user.id);
      } else setProductsLoading(false);
    };
    void init();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error(error.message ?? 'Delete failed.');
      return;
    }
    if (currentUserId) await fetchProducts(currentUserId);
    toast.success(t('dashboard.productDeleted'));
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category,
      unit: product.unit,
    });
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
      toast.error('Price must be a valid number.');
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
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : null;
      toast.error(msg ?? 'Save failed.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof e.target?.result === 'string') setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleImageFile(e.dataTransfer.files?.[0] || null);
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

  const openAddModal = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', quantity: '', category: 'vegetables', unit: 'kg' });
    setImagePreview(null);
    setShowAddModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your product listings.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-base font-semibold shadow-lg"
        >
          <Plus className="h-5 w-5" /> {t('dashboard.addProduct')}
        </motion.button>
      </div>

      {productsLoading ? (
        <p className="text-muted-foreground text-lg">Loading products…</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground text-lg mb-2">No products yet.</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first product to start selling.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
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
                <p className="text-xl font-bold text-primary mt-1">
                  ₹{product.price}<span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">{t('marketplace.available')}: {product.quantity} {product.unit}</p>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" /> {t('dashboard.edit')}
                  </button>
                  <button
                    onClick={() => void handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> {t('dashboard.delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl border border-border bg-card p-6 w-full max-w-md shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">
                  {editProduct ? t('dashboard.editProduct') : t('dashboard.addProduct')}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-muted/50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={t('dashboard.productName')}
                  className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border border-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder={t('dashboard.price')}
                    type="number"
                    className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    placeholder={t('marketplace.quantity')}
                    type="number"
                    className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div
                  className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 bg-muted/30'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('farmer-product-image-input')?.click()}
                >
                  <input
                    id="farmer-product-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm font-medium text-foreground mb-1">{t('dashboard.uploadImage') || 'Upload product image'}</p>
                  <p className="text-xs text-muted-foreground mb-3">Drag & drop or click to browse</p>
                  {imagePreview && (
                    <div className="mt-2 flex justify-center">
                      <img src={imagePreview} alt="Preview" className="h-20 w-28 object-cover rounded-lg shadow-sm" />
                    </div>
                  )}
                </div>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {['vegetables', 'fruits', 'grains', 'spices', 'dairy'].map(c => (
                    <option key={c} value={c}>{t(`marketplace.${c}`)}</option>
                  ))}
                </select>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => void handleSave()}
                  disabled={saveLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                  {saveLoading ? 'Saving…' : editProduct ? t('dashboard.save') : t('dashboard.addProduct')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FarmerProductsPage;
