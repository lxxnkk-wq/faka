import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../../utils/api';
import { ApiOrder, OrderSummary } from '../../types';
import { useSite } from '../../contexts/SiteContext';
import { formatCurrencyAmount, mapApiOrderToSummary } from '../../utils/mapper';

export const DashboardOrders = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
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

    fetchOrders();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif italic">My Orders</h2>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-white/40 text-sm uppercase tracking-widest">
            No orders found.
          </div>
        ) : (
          orders.map((order) => {
            const firstItem = order.items[0];
            return (
              <div key={order.orderNo} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
                    <img src={firstItem?.image} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" alt={firstItem?.title || order.orderNo} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{order.orderNo}</p>
                    <h3 className="text-lg font-serif italic mb-1">{firstItem?.title || 'Order Items'}</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white mb-1">{formatCurrencyAmount(config?.currency || '$', order.totalAmount)}</p>
                    <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                      order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      order.status === 'processing' ? 'bg-amber-500/10 text-amber-500' :
                      order.status === 'pending' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>{order.status}</span>
                  </div>
                  <Link to="/orders" className="p-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
