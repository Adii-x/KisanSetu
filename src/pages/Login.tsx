import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/context/UserRoleContext';
import { supabase } from '@/lib/supabaseClient';

/**
 * Single login page. Role is always fetched from public.profiles after login.
 * Redirects: farmer → /farmer/dashboard, buyer → /buyer-dashboard.
 * If no profile → redirect to /register with error toast.
 */
const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useUserRole();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!email?.trim() || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: signInError,
      } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (signInError) {
        console.error('Login error:', signInError);
        toast.error(signInError.message ?? 'Login failed. Please try again.');
        return;
      }

      if (!user) {
        console.error('Login returned no user');
        toast.error('Login failed. Please try again.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.role) {
        console.error('Profile fetch error:', profileError);
        toast.error('Profile not found. Please complete registration.');
        navigate('/register');
        return;
      }

      const role = profile.role === 'farmer' || profile.role === 'buyer' ? profile.role : 'buyer';
      setRole(role);
      toast.success(t('auth.loginSuccess'));
      navigate(role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
    } catch (err: unknown) {
      console.error('Unexpected login error:', err);
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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sprout className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">{t('auth.login')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
              className="w-full bg-muted/50 text-foreground pl-11 pr-4 py-3 rounded-xl border-none outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold btn-glow disabled:opacity-60"
          >
            {loading ? 'Signing in...' : t('auth.login')}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
