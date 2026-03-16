import React, { useEffect, useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import { useSite } from '../../contexts/SiteContext';
import { api } from '../../utils/api';
import { WalletAccountData } from '../../types';
import { formatCurrencyAmount } from '../../utils/mapper';

export const DashboardWallet = () => {
  const { config } = useSite();
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await api.get<WalletAccountData>('/wallet');
        setBalance(response.data.balance || '0.00');
      } catch (error) {
        console.error('Fetch wallet error:', error);
        setBalance('0.00');
      }
    };

    fetchWallet();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-brand p-10 rounded-3xl text-surface relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-2 opacity-60">Available Balance</p>
          <h2 className="text-5xl font-serif font-bold italic mb-8">{formatCurrencyAmount(config?.currency || '$', balance)}</h2>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-surface text-white rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all">Top Up</button>
            <button className="px-8 py-3 border border-surface/20 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-surface/10 transition-all">Withdraw</button>
          </div>
        </div>
        <Wallet className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Payment Methods</h3>
          <div className="space-y-4">
            <div className="p-4 border border-white/10 rounded-xl flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                <p className="text-xs font-medium">**** 4242</p>
              </div>
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Default</span>
            </div>
            <button className="w-full p-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-white/40 hover:text-white hover:border-white/30 transition-all">
              <Plus size={14} /> Add New Method
            </button>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Financial Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">This Month's Spending</span>
              <span className="text-xs font-mono">{formatCurrencyAmount(config?.currency || '$', '0.00')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">This Month's Top Up</span>
              <span className="text-xs font-mono">{formatCurrencyAmount(config?.currency || '$', '0.00')}</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold">Pending Refunds</span>
              <span className="text-xs font-mono text-brand">{formatCurrencyAmount(config?.currency || '$', '0.00')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
