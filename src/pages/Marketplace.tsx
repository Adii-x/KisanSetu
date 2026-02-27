import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, X, Plus, Minus } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const categories = ['all', 'vegetables', 'fruits', 'grains', 'spices', 'dairy'];

const MarketplacePage = () => {
  const { t } = useTranslation();
  const { addItem, items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = filter === 'all' ? mockProducts : mockProducts.filter(p => p.category === filter);

  const handleAddToCart = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, farmer: product.farmer });
    toast.success(`${product.name} ${t('marketplace.addToCart')}!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{t('marketplace.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('marketplace.subtitle')}</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative glass-card p-3 rounded-xl hover:bg-primary/5 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-primary text-primary-foreground btn-glow'
                  : 'glass-card text-foreground hover:bg-primary/5'
              }`}
            >
              {t(`marketplace.${cat}`)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="absolute top-3 right-3 p-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4 text-foreground" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.farmer}</p>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium btn-glow"
                  >
                    {t('marketplace.addToCart')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-md w-full overflow-hidden"
              style={{ background: 'rgba(245, 247, 242, 0.95)' }}
            >
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-56 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
                    <p className="text-muted-foreground">{selectedProduct.farmer}</p>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg hover:bg-muted/50">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">₹{selectedProduct.price}<span className="text-sm text-muted-foreground font-normal">/{selectedProduct.unit}</span></span>
                  <span className="glass-card px-3 py-1 text-sm text-muted-foreground">{selectedProduct.quantity} {selectedProduct.unit} {t('marketplace.available')}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t('marketplace.addToCart')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full max-w-sm p-6 overflow-y-auto"
              style={{ background: 'rgba(245, 247, 242, 0.95)', backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{t('marketplace.cart')} ({totalItems})</h2>
                <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-muted/50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t('marketplace.emptyCart')}</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="glass-card p-3 flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                          <p className="text-primary font-bold">₹{item.price * item.quantity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-md bg-muted/50">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-md bg-muted/50">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-1 rounded-lg hover:bg-destructive/10">
                          <X className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex justify-between text-lg font-bold text-foreground mb-4">
                      <span>{t('marketplace.total')}</span>
                      <span className="text-primary">₹{totalPrice}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { toast.success('Checkout coming soon with Razorpay!'); }}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow"
                    >
                      {t('marketplace.checkout')}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplacePage;
