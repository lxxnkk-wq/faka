import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Search, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header = ({ cartCount, onOpenCart, searchQuery, setSearchQuery, cartBump }: any) => {
  const { scrollY, scrollYProgress } = useScroll();
  const { user } = useAuth();
  
  // Dynamic header styles based on scroll
  const headerPadding = useTransform(scrollY, [0, 100], ['1.5rem', '0.5rem']);
  const headerBg = useTransform(
    scrollY, 
    [0, 100], 
    ['rgba(10, 10, 10, 1)', 'rgba(10, 10, 10, 0.6)']
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)']
  );

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.header 
      style={{ 
        paddingTop: headerPadding, 
        paddingBottom: headerPadding,
        backgroundColor: headerBg,
        borderBottomColor: headerBorder
      }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-16 backdrop-blur-xl border-b"
    >
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[1px] bg-brand origin-left z-[110]"
        style={{ scaleX }}
      />
      <div className="flex items-center gap-12">
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-brand transition-colors">Boutique</Link>
          <Link to="/news" className="hover:text-brand transition-colors">Journal</Link>
          <a href="#" className="hover:text-brand transition-colors">Archive</a>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH CATALOGUE" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-white/10 pl-8 pr-4 py-2 text-[10px] font-bold tracking-widest focus:outline-none focus:border-brand transition-all w-48"
          />
        </div>
        <button 
          onClick={onOpenCart}
          className="relative text-white/60 hover:text-white transition-colors"
        >
          <motion.div
            animate={cartBump ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ShoppingCart size={20} />
          </motion.div>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand text-[8px] font-black flex items-center justify-center rounded-full text-surface">
              {cartCount}
            </span>
          )}
        </button>
        {user ? (
          <Link to="/dashboard" className="flex items-center gap-3 px-6 py-2.5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            <span className="text-brand uppercase">{user.nickname || 'Collector'}</span>
          </Link>
        ) : (
          <Link to="/login" className="px-6 py-2.5 bg-brand text-black rounded-full text-[10px] font-black tracking-widest hover:bg-white transition-all">
            LOGIN
          </Link>
        )}
      </div>
    </motion.header>
  );
};
