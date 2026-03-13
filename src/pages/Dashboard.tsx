import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, ShoppingCart, Key, Shield, User, LayoutGrid, LogOut 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardOverview } from './dashboard/Overview';
import { DashboardOrders } from './dashboard/Orders';
import { DashboardWallet } from './dashboard/Wallet';
import { DashboardAPI } from './dashboard/API';
import { DashboardSecurity } from './dashboard/Security';
import { DashboardProfile } from './dashboard/Profile';

export const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'api', label: 'API Integration', icon: Key },
    { id: 'security', label: 'Security Center', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="px-8 md:px-16 pb-32">
      <header className="mb-16">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[9px] font-black tracking-[0.5em] text-brand uppercase mb-6"
        >
          USER DASHBOARD — CONTROL CENTER
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold italic leading-[0.9]"
          >
            Welcome, <br /> <span className="gold-gradient">{user?.nickname || 'Collector'}.</span>
          </motion.h1>
            <div className="flex items-center gap-6 pb-2">
            <div className="text-right">
              <p className="text-xs font-bold text-white uppercase tracking-widest">{user?.nickname || 'Premium Member'}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">{user?.email}</p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-brand p-1">
              <div className="w-full h-full rounded-full bg-brand/20 flex items-center justify-center text-brand font-serif italic text-xl">
                {user?.nickname?.charAt(0) || user?.email?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand text-surface shadow-lg shadow-brand/20' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <div className="pt-8">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'orders' && <DashboardOrders />}
              {activeTab === 'wallet' && <DashboardWallet />}
              {activeTab === 'api' && <DashboardAPI />}
              {activeTab === 'security' && <DashboardSecurity />}
              {activeTab === 'profile' && <DashboardProfile />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
