import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Globe, Bell, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const FarmerSettingsPage = () => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const name = (user?.user_metadata?.name as string)?.trim() || user?.email?.split('@')[0] || '';
      setDisplayName(name);
    };
    void load();
  }, []);

  const handleSaveName = async () => {
    setSaving(true);
    setMessage('idle');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('error');
      setSaving(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({
      data: { name: displayName.trim() || undefined },
    });
    if (error) setMessage('error');
    else setMessage('saved');
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl space-y-10"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-lg">Manage your profile and preferences.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile
        </h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Display name</label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-muted/30 text-foreground px-4 py-3 rounded-xl border border-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex items-center gap-3 mt-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => void handleSaveName()}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save name'}
            </motion.button>
            {message === 'saved' && <span className="text-sm text-primary">Saved.</span>}
            {message === 'error' && <span className="text-sm text-destructive">Failed to save.</span>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Language
        </h2>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <span className="text-sm text-muted-foreground">Change app language</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h2>
        <p className="text-sm text-muted-foreground">Order and reminder notifications. Coming soon.</p>
        <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
          Notifications integration coming soon.
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security
        </h2>
        <p className="text-sm text-muted-foreground">Password and security options. Coming soon.</p>
        <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
          Security settings coming soon.
        </div>
      </div>
    </motion.div>
  );
};

export default FarmerSettingsPage;
