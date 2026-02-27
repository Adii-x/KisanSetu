import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Sprout, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUserRole } from '@/context/UserRoleContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const { role, setRole, isFarmer } = useUserRole();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const farmerLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/marketplace', label: t('nav.marketplace') },
    { to: '/community', label: t('nav.community') },
    { to: '/orders', label: t('nav.orders') },
  ];

  const buyerLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/marketplace', label: t('nav.marketplace') },
    { to: '/orders', label: t('nav.orders') },
  ];

  const isLanding = location.pathname === '/';
  const links = isFarmer ? farmerLinks : buyerLinks;
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-navbar sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-primary p-2">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">KisanSetu</span>
        </Link>



        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {!isLanding && (
            <Link to="/marketplace" className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          )}
          <Link to="/select-role?mode=login" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">{t('auth.login')}</span>
          </Link>
          <Link to="/select-role?mode=signup" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground btn-glow transition-colors">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('auth.register')}</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted/50">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>


    </nav>
  );
};

export default Navbar;
