import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }: any) => {
  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-white/5 z-[70] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingCart size={20} className="text-brand" />
                <h2 className="text-xl font-serif italic">Your Collection</h2>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState 
                    icon={ShoppingCart}
                    title="Your Vault is Empty"
                    description="The collection awaits its next masterpiece. Begin your acquisition journey today."
                    actionText="Browse Catalogue"
                    onAction={onClose}
                  />
                </div>
              ) : (
                cart.map((item: any) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 h-24 bg-neutral-900 overflow-hidden border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-serif italic">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-display font-light text-brand mb-4">¥{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center border border-white/10 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-white/40 hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-[10px] font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-white/40 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Value</span>
                  <span className="text-2xl font-display font-light gold-gradient">¥{total.toLocaleString()}</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={onClose}
                  className="w-full py-4 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand/20"
                >
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
