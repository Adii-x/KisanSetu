import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Sprout,
  Menu,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useUserRole } from '@/context/UserRoleContext';

const navItems = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'products', label: 'Products', icon: Package },
  { to: 'orders', label: 'Orders', icon: ShoppingBag },
  { to: 'analytics', label: 'Analytics', icon: BarChart3 },
  { to: 'community', label: 'Community', icon: Users },
  { to: 'settings', label: 'Settings', icon: Settings },
] as const;

const FarmerLayout = () => {
  const navigate = useNavigate();
  const { setRole } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login', { replace: true });
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile?.role) {
        navigate('/register', { replace: true });
        setLoading(false);
        return;
      }

      if (profile.role !== 'farmer') {
        setRole(profile.role);
        navigate(profile.role === 'buyer' ? '/buyer/dashboard' : '/', { replace: true });
        setLoading(false);
        return;
      }

      setRole('farmer');
      setLoading(false);
    };

    void checkAuth();
  }, [navigate, setRole]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole('buyer');
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay (mobile) */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        style={{ display: sidebarOpen ? 'block' : 'none' }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 flex flex-col
          bg-card border-r border-border
          shadow-lg md:shadow-none
          transition-transform duration-200 ease-out md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          <NavLink to="/farmer/dashboard" className="flex items-center gap-2">
            <div className="rounded-xl bg-primary p-2">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary">KisanSetu</span>
          </NavLink>
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`/farmer/${to}`}
              end={to === 'dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 md:px-8">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">Farmer Portal</span>
        </header>
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;
