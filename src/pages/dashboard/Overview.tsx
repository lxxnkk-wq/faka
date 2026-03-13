import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet, ShoppingCart, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSite } from '../../contexts/SiteContext';
import { api } from '../../utils/api';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const { config } = useSite();
  const [orderCount, setOrderCount] = useState<number | string>('...');

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await api.get<any[]>('/me/orders');
        setOrderCount(response.data.length);
      } catch (error) {
        console.error('Failed to fetch orders for overview:', error);
        setOrderCount(0);
      }
    };
    fetchOrderCount();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Account Balance', value: `${config?.currency} ${user?.balance || '0.00'}`, icon: Wallet, color: 'text-brand' },
          { label: 'Total Orders', value: orderCount.toString(), icon: ShoppingCart, color: 'text-white' },
          { label: 'API Calls (This Month)', value: '0', icon: Activity, color: 'text-white' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={20} className="text-white/20" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Live</span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-serif italic ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest">Recent Activity</h3>
          <button className="text-[10px] font-bold text-brand uppercase tracking-widest">View All</button>
        </div>
        <div className="divide-y divide-white/5">
          <div className="p-10 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
};
