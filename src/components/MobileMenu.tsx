import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, X, LayoutGrid, Search, ArrowUpRight, History, HelpCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Category } from '../types';
import { useSite } from '../contexts/SiteContext';

export const MobileMenu = ({ isOpen, onClose, activeCategory, setActiveCategory }: any) => {
  const { user, logout } = useAuth();
  const { getLocalizedString } = useSite();
  const [categories, setCategories] = useState<{name: string, count?: number}[]>([
    { name: 'All Products' }
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>('/public/categories');
        const mappedCategories = res.data.map(c => ({
          name: getLocalizedString(c.name)
        }));
        setCategories([{ name: 'All Products' }, ...mappedCategories]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [getLocalizedString]);

  const menuVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
    open: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40, staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden"
          />
          <motion.aside
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-surface border-r border-white/5 z-50 lg:hidden p-8 flex flex-col overflow-y-auto"
          >
            <motion.div variants={menuItemVariants} className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                  <Zap className="text-surface fill-surface" size={16} />
                </div>
                <span className="text-lg font-serif font-bold italic">Nova.</span>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>

            <nav className="space-y-10">
              <motion.div variants={menuItemVariants} className="space-y-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Collections</p>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl text-xs font-bold transition-all group ${
                        activeCategory === cat.name 
                        ? 'bg-brand text-surface' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutGrid size={16} className={activeCategory === cat.name ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'} />
                        <span>{cat.name}</span>
                      </div>
                      <span className={`text-[10px] font-black ${activeCategory === cat.name ? 'opacity-60' : 'opacity-20'}`}>{cat.count}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={menuItemVariants} className="space-y-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Account & Support</p>
                <div className="flex flex-col gap-1">
                  <Link 
                    to="/lookup" 
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group"
                  >
                    <Search size={18} className="opacity-30 group-hover:opacity-100" />
                    <span>Track Order</span>
                    <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-30 transition-all" />
                  </Link>
                  <Link 
                    to="/orders" 
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group"
                  >
                    <History size={18} className="opacity-30 group-hover:opacity-100" />
                    <span>Order History</span>
                    <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-30 transition-all" />
                  </Link>
                  <button className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group">
                    <HelpCircle size={18} className="opacity-30 group-hover:opacity-100" />
                    <span>Concierge Support</span>
                    <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-30 transition-all" />
                  </button>
                </div>
              </motion.div>
            </nav>

            <motion.div variants={menuItemVariants} className="mt-auto pt-8 border-t border-white/5">
              {user ? (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-serif italic">
                      {user.nickname?.charAt(0) || user.email.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Logged in as</span>
                      <span className="text-xs font-bold">{user.nickname || 'Nova Collector'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={onClose}
                  className="w-full py-4 bg-brand text-black rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  <User size={16} />
                  Authorize Access
                </Link>
              )}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
