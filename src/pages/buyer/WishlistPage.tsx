import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const WISHLIST_STORAGE_KEY = 'kisansetu-wishlist';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  farmer: string;
  unit: string;
};

const loadWishlist = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveWishlist = (items: WishlistItem[]) => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400';

const WishlistPage = () => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(loadWishlist());
  }, []);

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    saveWishlist(next);
  };

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      farmer: item.farmer,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Wishlist
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Your saved products. Add to cart when you&apos;re ready.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg mb-2">No saved items</p>
          <p className="text-sm text-muted-foreground mb-6">
            Save products from the marketplace to see them here.
          </p>
          <Link
            to="/buyer/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
                <p className="text-primary font-bold mt-1">₹{item.price}/{item.unit}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.farmer}</p>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WishlistPage;
