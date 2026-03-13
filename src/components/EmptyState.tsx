import React from 'react';
import { motion } from 'motion/react';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-20 px-8"
  >
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-brand/20 blur-[40px] rounded-full" />
      <div className="relative w-24 h-24 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-brand/40">
        <Icon size={40} strokeWidth={1} />
      </div>
    </div>
    <h3 className="text-2xl md:text-3xl font-serif italic mb-4">{title}</h3>
    <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-[0.3em] max-w-xs leading-relaxed mb-10">
      {description}
    </p>
    {actionText && (
      <button 
        onClick={onAction}
        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all flex items-center gap-3 group"
      >
        {actionText}
      </button>
    )}
  </motion.div>
);
