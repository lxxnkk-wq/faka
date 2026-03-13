import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useSite } from '../contexts/SiteContext';
import { LuxuryCaptcha } from '../components/LuxuryCaptcha';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const { config } = useSite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config?.captcha?.scenes?.login && !captchaVerified) {
      addToast('Please complete the human verification.', 'info');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back, Collector', 'success');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto py-20 px-6"
    >
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
        <h1 className="text-3xl font-serif italic mb-8">Access Archive</h1>
        {error && <p className="text-red-500 text-xs mb-6 uppercase tracking-widest">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-white/40">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-brand hover:underline uppercase tracking-widest">Forgot?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {config?.captcha?.scenes?.login && (
            <LuxuryCaptcha onVerify={setCaptchaVerified} />
          )}

          <button 
            type="submit" 
            disabled={loading || (config?.captcha?.scenes?.login && !captchaVerified)}
            className="w-full py-4 bg-brand text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>
        <p className="mt-8 text-center text-[10px] text-white/40 uppercase tracking-widest">
          New to Nova? <Link to="/signup" className="text-brand hover:underline">Create Identity</Link>
        </p>
      </div>
    </motion.div>
  );
};
