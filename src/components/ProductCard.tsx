import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useSite } from '../contexts/SiteContext';

export const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void, key?: any }) => {
  const { config } = useSite();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
      animate={isAdding ? { 
        scale: [1, 0.98, 1.02, 1],
        borderColor: ['rgba(255,255,255,0.05)', 'rgba(212,175,55,0.5)', 'rgba(255,255,255,0.05)']
      } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={`group relative flex flex-col bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-brand/30 transition-all duration-700 overflow-hidden ${isOutOfStock ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          {/* Image Container with Refined Hover */}
          <div className="relative aspect-square overflow-hidden bg-neutral-900">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out ${isOutOfStock ? 'grayscale' : ''}`}
              referrerPolicy="no-referrer"
            />
            
            {/* Sold Out Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 border border-white/10 px-4 py-2 uppercase">Sold Out</span>
              </div>
            )}

            {/* Subtle Inner Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {product.label ? (
                <span className="text-[7px] font-black tracking-[0.2em] text-brand bg-surface/90 backdrop-blur-md px-2 py-1 border border-brand/20 uppercase">
                  {product.label}
                </span>
              ) : <div />}
              
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-sm border border-white/5">
                <Star size={8} className="text-brand fill-brand" />
                <span className="text-[8px] font-bold text-white/70">{product.rating}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <motion.button 
            onClick={handleAddToCart}
            animate={isAdding ? { 
              backgroundColor: ['#D4AF37', '#FFFFFF', '#D4AF37'],
              scale: 1.1
            } : {}}
            className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl z-10 ${
              isAdding ? 'text-brand' : 'bg-brand text-surface shadow-brand/20'
            }`}
          >
            {isAdding ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
          </motion.button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-brand/60 uppercase tracking-[0.2em]">{product.category}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className={`text-[7px] font-black uppercase tracking-widest ${product.deliveryType === 'auto' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
                  {product.deliveryType === 'auto' ? 'Auto Delivery' : 'Manual Delivery'}
                </span>
              </div>
              <h3 className="text-sm font-serif italic leading-tight group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
            </div>
          </div>
        </Link>

        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4">
          {/* Stock Scarcity Bar for Low Stock */}
          {isLowStock && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Limited Availability</span>
                <span className="text-[8px] font-bold text-amber-500">{product.stock} Left</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(product.stock / 10) * 100}%` }}
                  className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                />
              </div>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Pricing</span>
              <p className={`text-base font-display font-light transition-all ${isOutOfStock ? 'text-white/20' : 'group-hover:gold-gradient'}`}>
                {config?.currency || '¥'}{product.price.toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase tracking-tighter ${
                  isOutOfStock ? 'text-red-500/50' : 
                  isLowStock ? 'text-amber-500/80' : 
                  'text-emerald-500/80'
                }`}>
                  {isOutOfStock ? 'Sold Out' : isLowStock ? 'Low Stock' : 'Available'}
                </span>
                <div className={`w-1 h-1 rounded-full ${
                  isOutOfStock ? 'bg-red-500/30' : 
                  isLowStock ? 'bg-amber-500 animate-pulse' : 
                  'bg-emerald-500'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Accent */}
      {!isOutOfStock && (
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/0 group-hover:border-brand/40 transition-all duration-700" />
      )}
    </motion.div>
  );
};
