import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400';

const CartPage = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {t('marketplace.cart')}
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Review your items and proceed to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg mb-2">{t('marketplace.emptyCart')}</p>
          <p className="text-sm text-muted-foreground mb-6">Add products from the marketplace.</p>
          <Link
            to="/buyer/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Go to Marketplace
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm flex gap-4"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted/30 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.farmer}</p>
                  <p className="text-primary font-bold mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 text-destructive transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Total items</span>
              <span className="font-semibold text-foreground">{totalItems}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-4">
              <span className="text-foreground">{t('marketplace.total')}</span>
              <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
            <button
              type="button"
              className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('marketplace.checkout')} (UI only)
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CartPage;
