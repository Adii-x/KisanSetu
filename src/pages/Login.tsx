import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sprout, Tractor, ShoppingBag, Leaf, TrendingUp, Users, BarChart3, ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserRole } from '@/context/UserRoleContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const { role: userRole } = useUserRole();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isFarmer = userRole === 'farmer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success(isLogin ? t('auth.loginSuccess') : t('auth.registerSuccess'));
    navigate(isFarmer ? '/dashboard' : '/marketplace');
  };

  const farmerFeatures = [
    { icon: Leaf, label: t('login.farmerFeature1', 'List your produce') },
    { icon: TrendingUp, label: t('login.farmerFeature2', 'Track revenue & analytics') },
    { icon: Users, label: t('login.farmerFeature3', 'Join farmer community') },
    { icon: BarChart3, label: t('login.farmerFeature4', 'Monthly sales reports') },
  ];

  const buyerFeatures = [
    { icon: ShoppingCart, label: t('login.buyerFeature1', 'Buy fresh produce directly') },
    { icon: Tag, label: t('login.buyerFeature2', 'Best prices from farmers') },
    { icon: ShoppingBag, label: t('login.buyerFeature3', 'Track your orders') },
    { icon: Users, label: t('login.buyerFeature4', 'Trusted seller network') },
  ];

  const features = isFarmer ? farmerFeatures : buyerFeatures;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-0 w-full max-w-4xl overflow-hidden grid md:grid-cols-2"
      >
        {/* Left: Role info panel */}
        <div className={`p-8 flex flex-col justify-center ${isFarmer ? 'bg-primary/10' : 'bg-accent/30'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              {isFarmer ? (
                <Tractor className="h-7 w-7 text-primary" />
              ) : (
                <ShoppingBag className="h-7 w-7 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isFarmer ? t('auth.farmer') : t('auth.buyer')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isFarmer
                  ? t('login.farmerTagline', 'Grow your business digitally')
                  : t('login.buyerTagline', 'Fresh produce at your doorstep')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{feat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              {isLogin ? t('auth.login') : t('auth.register')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isFarmer
                ? t('login.farmerLoginDesc', 'Access your farmer dashboard')
                : t('login.buyerLoginDesc', 'Start shopping fresh produce')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.name')}
                  className="w-full bg-muted/50 text-foreground pl-11 pr-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.email')}
                className="w-full bg-muted/50 text-foreground pl-11 pr-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.password')}
                className="w-full bg-muted/50 text-foreground pl-11 pr-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow"
            >
              {isLogin ? t('auth.login') : t('auth.register')}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? t('auth.switchToRegister', "Don't have an account? Register") : t('auth.switchToLogin', 'Already have an account? Login')}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
