import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sprout, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useUserRole } from '@/context/UserRoleContext';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import LanguageSwitcher from './LanguageSwitcher';

type Role = 'farmer' | 'buyer';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role: contextRole, setRole } = useUserRole();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role | null>(null);

  // Sync role to context when we have it (for rest of app)
  useEffect(() => {
    if (role) setRole(role);
  }, [role, setRole]);

  // Check session on mount and subscribe to auth changes
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser ?? null);

      if (!currentUser) {
        setRoleState(null);
        setAuthLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      const r =
        profile?.role === 'farmer' || profile?.role === 'buyer' ? profile.role : null;
      setRoleState(r);
      setAuthLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setRoleState(null);
        return;
      }
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          const r = data?.role === 'farmer' || data?.role === 'buyer' ? data.role : null;
          setRoleState(r);
        });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRoleState(null);
    setMobileOpen(false);
    navigate('/');
  };

  const displayName =
    (user?.user_metadata?.name as string)?.trim() ||
    user?.email?.split('@')[0] ||
    user?.email ||
    '';

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

          {authLoading ? (
            <div className="h-9 w-24 rounded-xl bg-muted/50 animate-pulse" aria-hidden />
          ) : user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground max-w-[140px] truncate" title={user.email ?? ''}>
                {displayName}
              </span>
              <Link
                to={role === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.dashboard')}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                type="button"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t('auth.login')}</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground btn-glow transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('auth.register')}</span>
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
