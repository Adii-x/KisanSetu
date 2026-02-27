import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { mockOrders } from '@/data/mockData';

type OrderStatus = 'pending' | 'accepted' | 'outForDelivery' | 'delivered';

const statusConfig: Record<OrderStatus, { icon: typeof Clock; step: number; badgeClass: string }> = {
  pending: { icon: Clock, step: 0, badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  accepted: { icon: Package, step: 1, badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  outForDelivery: { icon: Truck, step: 2, badgeClass: 'bg-orange-100 text-orange-800 border-orange-200' },
  delivered: { icon: CheckCircle, step: 3, badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

const steps: OrderStatus[] = ['pending', 'accepted', 'outForDelivery', 'delivered'];

const FarmerOrdersPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1 text-lg">View and manage orders for your products.</p>
      </div>

      <div className="space-y-6">
        {mockOrders.map((order, i) => {
          const config = statusConfig[order.status as OrderStatus] ?? statusConfig.pending;
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{order.product}</h3>
                    <p className="text-xs text-muted-foreground">{order.id} · {order.date} · {order.buyer}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border ${config.badgeClass}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {t(`orders.status.${order.status}`)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {steps.map((step, si) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div
                        className={`h-2.5 w-full rounded-full transition-colors ${
                          si <= config.step ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                      {si < steps.length - 1 && <div className="w-1 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-2">
                  {steps.map(step => (
                    <span key={step} className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {t(`orders.status.${step}`)}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-5 pt-5 border-t border-border">
                  <span className="text-base text-muted-foreground">
                    {t('marketplace.quantity')}: <span className="font-semibold text-foreground">{order.quantity}</span>
                  </span>
                  <span className="text-xl font-bold text-primary">₹{order.price}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FarmerOrdersPage;
