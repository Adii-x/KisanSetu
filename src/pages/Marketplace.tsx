import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, X, Plus, Minus, Filter, ChevronDown, Star } from 'lucide-react';
import { mockProducts, Product } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

type LocationFilter = 'nearby' | 'district' | 'state' | 'all';

type EnhancedProduct = Product & {
  rating: number;
  reviews: number;
  location: LocationFilter;
  isOrganic: boolean;
  isSeasonal: boolean;
  discount?: number;
  isBulkAvailable: boolean;
  popularity: number;
  createdAt: string;
  updatedAt: string;
};

const RAW_PRODUCTS: EnhancedProduct[] = mockProducts.map((p, index) => {
  const locationOptions: LocationFilter[] = ['nearby', 'district', 'state', 'all'];
  const baseRating = [4.5, 4.2, 4.8, 3.9, 4.0, 4.6, 4.1, 3.7, 4.3][index % 9];

  return {
    ...p,
    rating: baseRating,
    reviews: 20 + index * 5,
    location: locationOptions[index % locationOptions.length],
    isOrganic: /organic/i.test(p.name),
    isSeasonal: /mango|tomato|onion|banana/i.test(p.name),
    discount: index % 3 === 0 ? 10 + (index % 2) * 5 : undefined,
    isBulkAvailable: p.quantity >= 400,
    popularity: 100 - index * 5,
    createdAt: new Date(2026, 1, 20 + index).toISOString(),
    updatedAt: new Date(2026, 1, 25 + index).toISOString(),
  };
});

const MIN_PRICE = Math.min(...RAW_PRODUCTS.map(p => p.price));
const MAX_PRICE = Math.max(...RAW_PRODUCTS.map(p => p.price));

type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'popular'
  | 'highest-rated'
  | 'recently-updated';

type StoredFilters = {
  categories: string[];
  priceRange: [number, number];
  location: LocationFilter;
  inStockOnly: boolean;
  minRating: number | null;
  sortBy: SortOption;
  search: string;
};

const STORAGE_KEY = 'kisansetu_marketplace_filters_v1';

const MarketplacePage = () => {
  const { t } = useTranslation();
  const { addItem, items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<EnhancedProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [location, setLocation] = useState<LocationFilter>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as StoredFilters;
      setCategories(parsed.categories || []);
      setPriceRange(parsed.priceRange || [MIN_PRICE, MAX_PRICE]);
      setLocation(parsed.location || 'all');
      setInStockOnly(parsed.inStockOnly || false);
      setMinRating(parsed.minRating ?? null);
      setSortBy(parsed.sortBy || 'newest');
      setSearch(parsed.search || '');
      setDebouncedSearch(parsed.search || '');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const payload: StoredFilters = {
      categories,
      priceRange,
      location,
      inStockOnly,
      minRating,
      sortBy,
      search,
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }, [categories, priceRange, location, inStockOnly, minRating, sortBy, search]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const handleAddToCart = (product: EnhancedProduct) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, farmer: product.farmer });
    toast.success(`${product.name} ${t('marketplace.addToCart')}!`);
  };

  const toggleCategory = (value: string) => {
    setCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    setPriceRange(prev => {
      const next: [number, number] = [...prev] as [number, number];
      next[index] = value;
      if (next[0] > next[1]) {
        if (index === 0) next[1] = next[0];
        else next[0] = next[1];
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setCategories([]);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setLocation('all');
    setInStockOnly(false);
    setMinRating(null);
    setSortBy('newest');
    setSearch('');
    setDebouncedSearch('');
  };

  const filteredProducts = useMemo(() => {
    let list = [...RAW_PRODUCTS];

    if (categories.length) {
      list = list.filter(p => {
        const hasCategory = categories.some(c =>
          ['vegetables', 'fruits', 'grains', 'dairy', 'spices'].includes(c)
            ? p.category === c
            : false
        );
        const wantsOrganic = categories.includes('organic') ? p.isOrganic : true;
        const wantsSeasonal = categories.includes('seasonal') ? p.isSeasonal : true;
        return hasCategory || (!['vegetables', 'fruits', 'grains', 'dairy', 'spices'].some(c => categories.includes(c)) && wantsOrganic && wantsSeasonal);
      });
    }

    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (location !== 'all') {
      list = list.filter(p => p.location === location);
    }

    if (inStockOnly) {
      list = list.filter(p => p.quantity > 0);
    }

    if (minRating) {
      list = list.filter(p => p.rating >= minRating);
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'highest-rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        list.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'recently-updated':
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  }, [categories, priceRange, location, inStockOnly, minRating, sortBy, debouncedSearch]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    categories.forEach(cat => {
      if (cat === 'organic') {
        chips.push({
          key: 'organic',
          label: 'Organic',
          onRemove: () => toggleCategory('organic'),
        });
      } else if (cat === 'seasonal') {
        chips.push({
          key: 'seasonal',
          label: 'Seasonal',
          onRemove: () => toggleCategory('seasonal'),
        });
      } else {
        const label = cat[0].toUpperCase() + cat.slice(1);
        chips.push({
          key: `cat-${cat}`,
          label,
          onRemove: () => toggleCategory(cat),
        });
      }
    });

    if (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE) {
      chips.push({
        key: 'price',
        label: `₹${priceRange[0]}–₹${priceRange[1]}`,
        onRemove: () => setPriceRange([MIN_PRICE, MAX_PRICE]),
      });
    }

    if (location !== 'all') {
      const labelMap: Record<LocationFilter, string> = {
        nearby: 'Nearby',
        district: 'Same District',
        state: 'Same State',
        all: 'All Locations',
      };
      chips.push({
        key: 'location',
        label: labelMap[location],
        onRemove: () => setLocation('all'),
      });
    }

    if (inStockOnly) {
      chips.push({
        key: 'stock',
        label: 'In Stock Only',
        onRemove: () => setInStockOnly(false),
      });
    }

    if (minRating) {
      chips.push({
        key: 'rating',
        label: `${minRating}★ & above`,
        onRemove: () => setMinRating(null),
      });
    }

    if (search.trim()) {
      chips.push({
        key: 'search',
        label: `Search: "${search}"`,
        onRemove: () => setSearch(''),
      });
    }

    return chips;
  }, [categories, priceRange, location, inStockOnly, minRating, search]);

  const resultCount = filteredProducts.length;

  const renderFilters = (isMobile = false) => (
    <div
      className={`space-y-6 ${isMobile ? '' : 'glass-card rounded-2xl p-4 lg:sticky lg:top-24'}`}
      style={
        isMobile
          ? undefined
          : { background: 'rgba(245, 247, 242, 0.9)', backdropFilter: 'blur(20px)' }
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">Filters</p>
          <p className="text-xs text-muted-foreground">Refine marketplace results</p>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs text-primary hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2">Category</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['vegetables', 'fruits', 'grains', 'dairy', 'organic', 'seasonal'].map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-2.5 py-1.5 rounded-xl border text-left transition-all ${
                  categories.includes(cat)
                    ? 'bg-emerald-600/90 border-emerald-500 text-white shadow-sm'
                    : 'bg-background/60 border-border/60 text-foreground hover:bg-primary/5'
                }`}
              >
                <span className="capitalize text-[11px]">
                  {cat === 'organic'
                    ? 'Organic'
                    : cat === 'seasonal'
                    ? 'Seasonal'
                    : cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-base font-semibold mb-1.5">Price Range</p>
          <p className="text-sm text-muted-foreground mb-3">
            ₹{priceRange[0]} — ₹{priceRange[1]}
          </p>
          <div className="space-y-2">
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationFilter)}
            className="w-full text-sm rounded-xl border border-border bg-background/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="nearby">Nearby</option>
            <option value="district">Same District</option>
            <option value="state">Same State</option>
            <option value="all">All Locations</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">In Stock Only</p>
            <p className="text-xs text-muted-foreground">Hide out of stock items</p>
          </div>
          <button
            onClick={() => setInStockOnly(v => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              inStockOnly ? 'bg-emerald-600' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                inStockOnly ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Farmer Rating</p>
          <div className="flex gap-2 text-xs">
            {[4, 3].map(r => (
              <button
                key={r}
                onClick={() => setMinRating(prev => (prev === r ? null : r))}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border transition-all ${
                  minRating === r
                    ? 'bg-amber-500 border-amber-400 text-white shadow-sm'
                    : 'bg-background/60 border-border/60 text-foreground hover:bg-primary/5'
                }`}
              >
                <Star className="h-3 w-3 fill-current" />
                <span>{r}★ &amp; up</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSortSelect = () => (
    <div className="relative inline-flex items-center">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="appearance-none text-xs sm:text-sm rounded-xl border border-border bg-background/70 pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest Listings</option>
        <option value="popular">Most Popular</option>
        <option value="highest-rated">Highest Rated</option>
        <option value="recently-updated">Recently Updated</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{t('marketplace.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('marketplace.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">{renderSortSelect()}</div>
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
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, farmer or category"
                className="w-full rounded-2xl border border-border bg-background/70 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{resultCount}</span> products
              </p>
              <div className="sm:hidden">{renderSortSelect()}</div>
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilterChips.map(chip => (
                <button
                  key={chip.key}
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800 border border-emerald-100"
                >
                  <span>{chip.label}</span>
                  <span className="text-emerald-700 text-[10px]">✕</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <div className="hidden lg:block">
            {renderFilters(false)}
          </div>

          <div className="space-y-4">
            <div className="lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background/80 px-4 py-2 text-sm shadow-sm"
              >
                <Filter className="h-4 w-4" />
                <span>Filter &amp; Sort</span>
              </button>
            </div>

            {resultCount === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Filter className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">No products match your filters.</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or clearing them to see more results.
                  </p>
                </div>
                <button
                  onClick={handleClearAll}
                  className="mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium btn-glow"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="glass-card overflow-hidden group rounded-2xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {product.discount && (
                          <span className="rounded-full bg-rose-500/90 text-white text-[10px] px-2 py-1 font-semibold shadow-sm">
                            {product.discount}% OFF
                          </span>
                        )}
                        {product.isOrganic && (
                          <span className="rounded-full bg-emerald-600/90 text-white text-[10px] px-2 py-1 font-semibold shadow-sm">
                            Organic Certified
                          </span>
                        )}
                        {product.isBulkAvailable && (
                          <span className="rounded-full bg-amber-500/90 text-white text-[10px] px-2 py-1 font-semibold shadow-sm">
                            Bulk Available
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="absolute top-3 right-3 p-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.farmer}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="font-semibold">{product.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {product.quantity} {product.unit} available
                        </span>
                        <span className="capitalize">
                          {product.location === 'nearby'
                            ? 'Nearby'
                            : product.location === 'district'
                            ? 'Same District'
                            : product.location === 'state'
                            ? 'Same State'
                            : 'All Locations'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-primary">₹{product.price}</span>
                          <span className="text-xs text-muted-foreground">/{product.unit}</span>
                          {product.discount && (
                            <span className="text-[10px] text-muted-foreground line-through ml-1">
                              ₹{Math.round(product.price / (1 - product.discount / 100))}
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAddToCart(product)}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs sm:text-sm font-medium btn-glow"
                        >
                          {t('marketplace.addToCart')}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

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
              className="glass-card max-w-md w-full overflow-hidden rounded-2xl"
              style={{ background: 'rgba(245, 247, 242, 0.95)' }}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-56 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
                    <p className="text-muted-foreground text-sm">{selectedProduct.farmer}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-semibold">{selectedProduct.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg hover:bg-muted/50">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">
                    ₹{selectedProduct.price}
                    <span className="text-sm text-muted-foreground font-normal">
                      /{selectedProduct.unit}
                    </span>
                  </span>
                  <span className="glass-card px-3 py-1 text-sm text-muted-foreground rounded-full">
                    {selectedProduct.quantity} {selectedProduct.unit} {t('marketplace.available')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  {selectedProduct.isOrganic && (
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Organic Certified
                    </span>
                  )}
                  {selectedProduct.isBulkAvailable && (
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                      Bulk Orders Available
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 capitalize">
                    {selectedProduct.location === 'nearby'
                      ? 'Nearby'
                      : selectedProduct.location === 'district'
                      ? 'Same District'
                      : selectedProduct.location === 'state'
                      ? 'Same State'
                      : 'All Locations'}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t('marketplace.addToCart')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h2 className="text-xl font-bold text-foreground">
                  {t('marketplace.cart')} ({totalItems})
                </h2>
                <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-muted/50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  {t('marketplace.emptyCart')}
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="glass-card p-3 flex gap-3 items-center rounded-2xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-primary font-bold text-sm">
                            ₹{item.price * item.quantity}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-md bg-muted/50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-md bg-muted/50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded-lg hover:bg-destructive/10"
                        >
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

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-4 pb-5 max-h-[80vh] overflow-y-auto"
              style={{ background: 'rgba(245, 247, 242, 0.98)', backdropFilter: 'blur(24px)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <p className="text-sm font-semibold">Filter &amp; Sort</p>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {renderFilters(true)}

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold btn-glow"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplacePage;
