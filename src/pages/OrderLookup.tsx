import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { PublicOrder } from '../types';
import { LuxuryCaptcha } from '../components/LuxuryCaptcha';
import { api } from '../utils/api';
import { useSite } from '../contexts/SiteContext';
import { getLocalizedString } from '../utils/mapper';

export const OrderLookupPage = () => {
  const [searchParams] = useSearchParams();
  const initialTradeNo = searchParams.get('trade_no') || '';
  
  const [orderId, setOrderId] = useState(initialTradeNo);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<PublicOrder | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const { addToast } = useToast();
  const { config } = useSite();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config?.captcha?.scenes?.order_lookup && !captchaVerified) {
      addToast('Please complete the human verification.', 'info');
      return;
    }
    setSearching(true);
    
    try {
      const params = new URLSearchParams({
        trade_no: orderId,
        email: email,
      });
      if (password) {
        params.append('password', password);
      }
      
      const response = await api.get<PublicOrder>(`/public/orders/lookup?${params.toString()}`);
      setResult(response.data);
      addToast('Order located successfully', 'success');
    } catch (error: any) {
      console.error('Lookup error:', error);
      setResult(null);
      addToast(error.message || 'No order found with these credentials.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setRecoverySent(true);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32 max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Track Order</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Guest Inquiry — Nova Collective</p>
      </div>

      {!result ? (
        <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl">
          {!showRecovery ? (
            <form onSubmit={handleLookup} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order ID (Trade No)</label>
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., 20240101123456789" 
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
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order Password</label>
                      <button 
                        type="button"
                        onClick={() => setShowRecovery(true)}
                        className="text-[8px] font-bold text-brand hover:underline uppercase tracking-widest"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your inquiry password (if set)" 
                      className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-white/10 uppercase tracking-widest text-center">Provide your Order ID and either your email or password to verify.</p>
              </div>

              {config?.captcha?.scenes?.order_lookup && (
                <LuxuryCaptcha onVerify={setCaptchaVerified} />
              )}

              <button 
                type="submit"
                disabled={searching || (config?.captcha?.scenes?.order_lookup && !captchaVerified)}
                className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-brand/10"
              >
                {searching ? 'Verifying Archive...' : 'Locate Order'}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setShowRecovery(false)} className="text-white/40 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-serif italic">Password Recovery</h2>
              </div>
              
              {!recoverySent ? (
                <form onSubmit={handleRecovery} className="space-y-6">
                  <p className="text-xs text-white/40 leading-relaxed">Enter the email address associated with your order. We will send a secure link to reset your inquiry password.</p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Recovery Email</label>
                    <input 
                      type="email" 
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={searching}
                    className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50"
                  >
                    {searching ? 'Sending Link...' : 'Send Recovery Link'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-brand" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic mb-2">Recovery Link Sent</h3>
                    <p className="text-xs text-white/30 leading-relaxed">If an order exists for <span className="text-white">{recoveryEmail}</span>, you will receive a reset link shortly.</p>
                  </div>
                  <button 
                    onClick={() => setShowRecovery(false)}
                    className="text-[10px] font-bold text-brand hover:underline uppercase tracking-widest"
                  >
                    Return to Lookup
                  </button>
                </div>
              )}
            </div>
          )}
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
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Order ID</span>
                  <span className="text-xs font-mono text-white/60">{result.trade_no}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{result.status}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total Value</span>
                  <span className="text-xs font-display gold-gradient">{config?.currency}{parseFloat(result.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Created At</span>
                  <span className="text-xs text-brand">{new Date(result.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-neutral-900 rounded border border-white/5 overflow-hidden">
                  <img src={result.product.images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} alt={getLocalizedString(result.product.title)} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-serif italic">{getLocalizedString(result.product.title)}</h4>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Qty: {result.quantity} — {config?.currency}{parseFloat(result.total_amount).toLocaleString()}</p>
                </div>
              </div>
              
              {result.deliverables && result.deliverables.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Deliverables</h4>
                  <div className="space-y-4">
                    {result.deliverables.map((del, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded border border-white/10">
                        <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap">{del.content}</pre>
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
