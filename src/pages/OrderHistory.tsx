import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, History, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSite } from '../contexts/SiteContext';
import { ApiOrder, OrderSummary } from '../types';
import { EmptyState } from '../components/EmptyState';
import { api } from '../utils/api';
import { formatCurrencyAmount, mapApiOrderToSummary } from '../utils/mapper';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const { user } = useAuth();
  const { config, locale } = useSite();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<ApiOrder[]>('/orders');
        setOrders(response.data.map((order) => mapApiOrderToSummary(order, locale)));
      } catch (error) {
        console.error('Fetch orders error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, locale]);

  const toggleOrder = (orderNo: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderNo) ? prev.filter((id) => id !== orderNo) : [...prev, orderNo],
    );
  };

  if (loading) {
    return (
      <div className="px-8 md:px-16 py-40 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Accessing Archives...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-8 md:px-16 py-40">
        <EmptyState
          icon={Lock}
          title="Archive Locked"
          description="Please authorize your identity to access your personal acquisition history."
          actionText="Authorize Access"
          onAction={() => {
            window.location.href = '/login';
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32"
    >
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Order History</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Your Digital Archive | Nova Collective</p>
      </div>

      <div className="space-y-8">
        {orders.length > 0 ? (
          orders.map((order) => {
            const isExpanded = expandedOrders.includes(order.orderNo);

            return (
              <div key={order.orderNo} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Order Number</span>
                      <span className="text-xs font-mono text-white/60">{order.orderNo}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Date</span>
                      <span className="text-xs text-white/60">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total Amount</span>
                      <span className="text-xs font-display gold-gradient">{formatCurrencyAmount(config?.currency || '$', order.totalAmount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      order.status === 'completed' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                      order.status === 'processing' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      order.status === 'pending' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                      'border-red-500/20 text-red-500 bg-red-500/5'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => toggleOrder(order.orderNo)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={14} />
                      </motion.div>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 md:p-8 bg-black/20">
                        <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-6">Acquired Items</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-neutral-900 rounded border border-white/5 overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <h4 className="text-[11px] font-serif italic">{item.title}</h4>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.deliverables.length > 0 && (
                        <div className="p-6 md:p-8 border-t border-white/5 bg-black/40">
                          <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-6">Deliverables</h3>
                          <div className="space-y-4">
                            {order.deliverables.map((deliverable, idx) => (
                              <div key={`${order.orderNo}-${idx}`} className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap break-all">{deliverable.content}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <EmptyState
              icon={History}
              title="No Archives Found"
              description="Your acquisition history is currently empty. Every great collection begins with a single choice."
              actionText="Start Exploring"
              onAction={() => {
                window.location.href = '/';
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
