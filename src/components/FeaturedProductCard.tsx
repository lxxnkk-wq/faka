import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, CheckCircle2, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { useSite } from '../contexts/SiteContext';

export const FeaturedProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void, key?: any }) => {
  const { config } = useSite();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      animate={isAdding ? { 
        scale: [1, 0.99, 1.01, 1],
        backgroundColor: ['rgba(212,175,55,0.03)', 'rgba(212,175,55,0.1)', 'rgba(212,175,55,0.03)']
      } : {}}
      transition={{ 
        duration: 1.2, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={`group relative grid grid-cols-1 md:grid-cols-2 bg-brand/[0.03] border border-brand/20 hover:border-brand/50 transition-all duration-700 overflow-hidden ${isOutOfStock ? 'opacity-70 grayscale-[0.3]' : ''}`}
    >
      {/* Image Side */}
      <div className="relative aspect-square md:aspect-auto overflow-hidden bg-neutral-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ${isOutOfStock ? 'grayscale' : ''}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent md:hidden" />
        
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-sm font-black tracking-[0.6em] text-white/60 border-y border-white/10 py-4 uppercase">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content Side */}
      <div className="p-8 md:p-12 flex flex-col justify-center relative">
        {/* Label & Status */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[10px] font-black tracking-[0.4em] text-brand bg-brand/10 px-4 py-2 border border-brand/30 uppercase">
            {product.label || 'FEATURED'}
          </span>
          {isLowStock && (
            <span className="text-[9px] font-bold text-amber-500 animate-pulse uppercase tracking-widest">
              Only {product.stock} Left
            </span>
          )}
        </div>

        <h3 className="text-3xl md:text-4xl font-serif italic mb-4 leading-tight">{product.name}</h3>
        <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-md">
          {product.description}
        </p>

        <div className="flex items-center gap-8 mb-10">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Premium Price</span>
            <p className={`text-2xl font-display font-light ${isOutOfStock ? 'text-white/20' : 'gold-gradient'}`}>{config?.currency || '¥'}{product.price.toLocaleString()}</p>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Rating</span>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-brand fill-brand" />
              <span className="text-lg font-display font-medium">{product.rating}</span>
            </div>
          </div>
        </div>

        {!isOutOfStock ? (
          <motion.button 
            onClick={handleAddToCart}
            animate={isAdding ? { 
              backgroundColor: ['#D4AF37', '#FFFFFF', '#D4AF37'],
              scale: 1.02
            } : {}}
            className={`w-full md:w-max px-10 py-4 text-[10px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 ${
              isAdding ? 'text-brand' : 'bg-brand text-surface hover:bg-white'
            }`}
          >
            {isAdding ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
            {isAdding ? 'Added to Collection' : 'Acquire Now'}
          </motion.button>
        ) : (
          <button disabled className="w-full md:w-max px-10 py-4 bg-white/5 text-white/20 text-[10px] font-black tracking-[0.3em] uppercase cursor-not-allowed">
            Currently Unavailable
          </button>
        )}

        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <TrendingUp size={120} className="text-brand" />
        </div>
      </div>
    </motion.div>
  );
};
