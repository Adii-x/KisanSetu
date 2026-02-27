import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { mockOrders } from '@/data/mockData';

const statusConfig: Record<string, { icon: typeof Clock; step: number; colorClass: string }> = {
  pending: { icon: Clock, step: 0, colorClass: 'text-krishi-wheat' },
  accepted: { icon: Package, step: 1, colorClass: 'text-secondary' },
  outForDelivery: { icon: Truck, step: 2, colorClass: 'text-primary' },
  delivered: { icon: CheckCircle, step: 3, colorClass: 'text-krishi-leaf' },
};

const steps = ['pending', 'accepted', 'outForDelivery', 'delivered'] as const;

const OrdersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-8">{t('orders.title')}</h1>

        <div className="space-y-4">
          {mockOrders.map((order, i) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{order.product}</h3>
                    <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-5 w-5 ${config.colorClass}`} />
                    <span className={`text-sm font-medium ${config.colorClass}`}>
                      {t(`orders.status.${order.status}`)}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-1">
                  {steps.map((step, si) => (
                    <div key={step} className="flex-1 flex items-center gap-1">
                      <div className={`h-2 flex-1 rounded-full transition-all ${
                        si <= config.step ? 'bg-primary' : 'bg-muted'
                      }`} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {steps.map(step => (
                    <span key={step} className="text-[10px] text-muted-foreground">
                      {t(`orders.status.${step}`)}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-border text-sm">
                  <span className="text-muted-foreground">{t('marketplace.quantity')}: {order.quantity}</span>
                  <span className="font-bold text-primary">₹{order.price}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default OrdersPage;
