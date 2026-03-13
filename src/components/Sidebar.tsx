import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, LayoutGrid, Search, History, HelpCircle, User } from 'lucide-react';
import { api } from '../utils/api';
import { Category } from '../types';
import { useSite } from '../contexts/SiteContext';

export const Sidebar = ({ activeCategory, setActiveCategory }: any) => {
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

  return (
    <aside className="hidden lg:flex flex-col w-20 xl:w-64 h-screen sticky top-0 sidebar-luxury py-12 px-4 xl:px-8">
      <Link to="/" className="flex items-center justify-center xl:justify-start gap-3 mb-20">
        <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center">
          <Zap className="text-surface fill-surface" size={20} />
        </div>
        <span className="hidden xl:block text-xl font-serif font-bold tracking-tight italic">Nova.</span>
      </Link>

      <nav className="flex-grow space-y-12">
        <div className="space-y-6">
          <p className="hidden xl:block text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Collections</p>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center justify-center xl:justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all group whitespace-nowrap ${
                  activeCategory === cat.name 
                  ? 'bg-white/5 text-brand' 
                  : 'text-white/40 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-1 h-1 rounded-full transition-all ${activeCategory === cat.name ? 'bg-brand scale-100' : 'bg-transparent scale-0'}`} />
                  <span className="hidden xl:block whitespace-nowrap">{cat.name}</span>
                </span>
                <span className="hidden xl:block text-[10px] opacity-30 ml-4">{cat.count}</span>
                <LayoutGrid size={18} className="xl:hidden" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="hidden xl:block text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Support</p>
          <div className="space-y-4 flex flex-col items-center xl:items-start">
            <Link to="/lookup" className="text-white/40 hover:text-brand transition-colors whitespace-nowrap flex items-center gap-3">
              <Search size={20} />
              <span className="hidden xl:block text-xs">Track Order</span>
            </Link>
            <Link to="/orders" className="text-white/40 hover:text-brand transition-colors whitespace-nowrap flex items-center gap-3">
              <History size={20} />
              <span className="hidden xl:block text-xs">Order History</span>
            </Link>
            <button className="text-white/40 hover:text-brand transition-colors whitespace-nowrap flex items-center gap-3">
              <HelpCircle size={20} />
              <span className="hidden xl:block text-xs">Concierge</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5 flex justify-center xl:justify-start">
        <button className="w-10 h-10 xl:w-full xl:h-auto xl:py-3 rounded-full xl:rounded-xl bg-white/5 flex items-center justify-center gap-3 text-white/40 hover:text-white transition-all">
          <User size={18} />
          <span className="hidden xl:block text-xs font-bold">Account</span>
        </button>
      </div>
    </aside>
  );
};
