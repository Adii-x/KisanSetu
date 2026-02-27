import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { monthlyData } from '@/data/mockData';

const FarmerAnalyticsPage = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: IndianRupee, label: t('analytics.totalSales'), value: '₹31,000' },
    { icon: ShoppingBag, label: t('analytics.totalOrders'), value: '40' },
    { icon: Award, label: t('analytics.topProduct'), value: 'Organic Tomatoes' },
    { icon: TrendingUp, label: t('analytics.growth'), value: '+24%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-10"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {t('analytics.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">{t('analytics.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('analytics.revenue')} — {t('analytics.thisMonth')}
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 15%, 85%)" />
            <XAxis dataKey="month" stroke="hsl(120, 10%, 40%)" fontSize={12} />
            <YAxis stroke="hsl(120, 10%, 40%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: 'rgba(245, 247, 242, 0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="sales" fill="hsl(122, 39%, 33%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default FarmerAnalyticsPage;
