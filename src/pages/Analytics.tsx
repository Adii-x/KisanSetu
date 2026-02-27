import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, IndianRupee, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { monthlyData } from '@/data/mockData';

const AnalyticsPage = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: IndianRupee, label: t('analytics.totalSales'), value: '₹31,000', color: 'text-primary' },
    { icon: ShoppingBag, label: t('analytics.totalOrders'), value: '40', color: 'text-secondary' },
    { icon: Award, label: t('analytics.topProduct'), value: 'Organic Tomatoes', color: 'text-krishi-wheat' },
    { icon: TrendingUp, label: t('analytics.growth'), value: '+24%', color: 'text-krishi-leaf' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-1">{t('analytics.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('analytics.subtitle')}</p>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('analytics.revenue')} - {t('analytics.thisMonth')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 15%, 85%)" />
              <XAxis dataKey="month" stroke="hsl(120, 10%, 40%)" fontSize={12} />
              <YAxis stroke="hsl(120, 10%, 40%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(245, 247, 242, 0.95)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Bar dataKey="sales" fill="hsl(122, 39%, 33%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
