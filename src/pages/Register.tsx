import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sprout, Tractor, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/context/UserRoleContext';
import { supabase } from '@/lib/supabaseClient';

type Role = 'farmer' | 'buyer';

/**
 * Single register page. User selects role (farmer/buyer), then we signUp and insert
 * into public.profiles. Redirect to /farmer-dashboard or /buyer-dashboard.
 */
const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useUserRole();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('buyer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!email?.trim() || !password?.trim()) {
      toast.error('Please fill in email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim() || undefined } },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        toast.error(signUpError.message ?? 'Registration failed. Please try again.');
        return;
      }

      const user = data.user;
      if (!user) {
        console.warn('SignUp returned no user (e.g. email confirmation required).');
        toast.info('Check your email to confirm your account, then log in.');
        navigate('/login');
        return;
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        role: selectedRole,
      });

      if (profileError) {
        console.error('Profile insert error:', profileError);
        toast.error(profileError.message ?? 'Account created but profile failed. Please try again.');
        return;
      }

      setRole(selectedRole);
      toast.success(t('auth.registerSuccess'));
      navigate(selectedRole === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard');
    } catch (err: unknown) {
      console.error('Unexpected signup error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sprout className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">{t('auth.register')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create an account and choose your role
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.name')}
              autoComplete="name"
              className="w-full bg-muted/50 text-foreground pl-11 pr-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email')}
              autoComplete="email"
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
              autoComplete="new-password"
              minLength={6}
              className="w-full bg-muted/50 text-foreground pl-11 pr-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  selectedRole === 'farmer'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Tractor className="h-5 w-5" />
                <span>{t('auth.farmer')}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('buyer')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  selectedRole === 'buyer'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>{t('auth.buyer')}</span>
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow disabled:opacity-60"
          >
            {loading ? 'Creating account...' : t('auth.register')}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
