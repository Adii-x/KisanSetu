import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tractor, ShoppingBag, ArrowRight, Sprout } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserRole } from '@/context/UserRoleContext';

const RoleSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useUserRole();
  const mode = searchParams.get('mode') || 'login';

  const handleSelect = (role: 'farmer' | 'buyer') => {
    setRole(role);
    navigate(`/login?mode=${mode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Sprout className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {t('roleSelect.title', 'Who are you?')}
        </h1>
        <p className="text-muted-foreground mb-10">
          {t('roleSelect.subtitle', 'Select your role to continue')}
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <motion.button
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect('farmer')}
            className="glass-card p-8 text-left group cursor-pointer transition-all hover:ring-2 hover:ring-primary/40"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <Tractor className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{t('auth.farmer')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('roleSelect.farmerDesc', 'Sell your produce, track analytics, and connect with buyers')}
            </p>
            <div className="flex items-center gap-1 text-primary font-semibold text-sm">
              {t('roleSelect.continue', 'Continue')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Customer Card */}
          <motion.button
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect('buyer')}
            className="glass-card p-8 text-left group cursor-pointer transition-all hover:ring-2 hover:ring-primary/40"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{t('auth.buyer')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('roleSelect.buyerDesc', 'Browse fresh produce, place orders, and get doorstep delivery')}
            </p>
            <div className="flex items-center gap-1 text-primary font-semibold text-sm">
              {t('roleSelect.continue', 'Continue')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
