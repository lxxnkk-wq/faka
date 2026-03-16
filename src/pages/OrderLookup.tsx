import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { ApiOrder, OrderSummary } from '../types';
import { LuxuryCaptcha } from '../components/LuxuryCaptcha';
import { api } from '../utils/api';
import { formatCurrencyAmount, mapApiOrderToSummary } from '../utils/mapper';
import { useSite } from '../contexts/SiteContext';

export const OrderLookupPage = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNo = searchParams.get('order_no') || '';
  const initialEmail = searchParams.get('email') || '';

  const [orderNo, setOrderNo] = useState(initialOrderNo);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<OrderSummary | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { addToast } = useToast();
  const { config, locale } = useSite();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNo.trim() || !email.trim() || !password.trim()) {
      addToast('Please provide order number, email, and order password.', 'info');
      return;
    }
    if (config?.captcha?.scenes?.guest_create_order && !captchaVerified) {
      addToast('Please complete the human verification.', 'info');
      return;
    }

    setSearching(true);
    try {
      const response = await api.get<ApiOrder>(
        `/guest/orders/by-order-no/${encodeURIComponent(orderNo.trim())}?email=${encodeURIComponent(email.trim())}&order_password=${encodeURIComponent(password.trim())}`,
      );
      setResult(mapApiOrderToSummary(response.data, locale));
      addToast('Order located successfully.', 'success');
    } catch (error: any) {
      console.error('Lookup error:', error);
      setResult(null);
      addToast(error.message || 'No order found with these credentials.', 'error');
    } finally {
      setSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32 max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Track Order</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Guest Inquiry | Nova Collective</p>
      </div>

      {!result ? (
        <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl">
          <form onSubmit={handleLookup} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order Number</label>
                <input
                  type="text"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="e.g., DJ202603150001"
                  className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email used for checkout"
                    className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Order lookup password"
                    className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    required
                  />
                </div>
              </div>
              <p className="text-[9px] text-white/10 uppercase tracking-widest text-center">
                Guest lookup requires the order number, checkout email, and order password.
              </p>
            </div>

            {config?.captcha?.scenes?.guest_create_order && (
              <LuxuryCaptcha onVerify={setCaptchaVerified} />
            )}

            <button
              type="submit"
              disabled={searching || (config?.captcha?.scenes?.guest_create_order && !captchaVerified)}
              className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-brand/10"
            >
              {searching ? 'Verifying Archive...' : 'Locate Order'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
              Members can view their full history in the <Link to="/orders" className="text-brand hover:underline">Personal Archive</Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <button onClick={() => setResult(null)} className="text-[10px] font-bold text-white/40 hover:text-brand uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Search
            </button>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Order Verified</span>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-wrap gap-12">
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Order Number</span>
                  <span className="text-xs font-mono text-white/60">{result.orderNo}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{result.status}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total Value</span>
                  <span className="text-xs font-display gold-gradient">{formatCurrencyAmount(config?.currency || '$', result.totalAmount)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Created At</span>
                  <span className="text-xs text-brand">{new Date(result.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {result.items.map((item) => (
                <div key={item.id} className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-900 rounded border border-white/5 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-serif italic">{item.title}</h4>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">
                      Qty: {item.quantity} | {formatCurrencyAmount(config?.currency || '$', item.totalAmount)}
                    </p>
                  </div>
                </div>
              ))}

              {result.deliverables.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Deliverables</h4>
                  <div className="space-y-4">
                    {result.deliverables.map((deliverable, idx) => (
                      <div key={`${result.orderNo}-${idx}`} className="p-4 bg-white/5 rounded border border-white/10">
                        <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap break-all">{deliverable.content}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
