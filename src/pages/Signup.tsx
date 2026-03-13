import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useSite } from '../contexts/SiteContext';
import { LuxuryCaptcha } from '../components/LuxuryCaptcha';
import { api } from '../utils/api';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { signup } = useAuth();
  const { addToast } = useToast();
  const { config } = useSite();

  const handleSendCode = async () => {
    if (!email) {
      addToast('Please enter your email first.', 'error');
      return;
    }
    if (config?.captcha?.scenes?.send_verify_code && !captchaVerified) {
      addToast('Please complete the human verification.', 'info');
      return;
    }

    setSendingCode(true);
    try {
      await api.post('/auth/send-verify-code', {
        email,
        purpose: 'register',
        // captcha_payload would be added here if implemented fully
      });
      addToast('Verification code sent to your email.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to send verification code.', 'error');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config?.captcha?.scenes?.register && !captchaVerified) {
      addToast('Please complete the human verification.', 'info');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signup(email, password, code);
      addToast('Identity created successfully', 'success');
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
        <h1 className="text-3xl font-serif italic mb-8">Create Identity</h1>
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
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Verification Code</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="6-digit code"
                required
              />
              <button 
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || !email}
                className="px-6 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {sendingCode ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {(config?.captcha?.scenes?.register || config?.captcha?.scenes?.send_verify_code) && (
            <LuxuryCaptcha onVerify={setCaptchaVerified} />
          )}

          <button 
            type="submit" 
            disabled={loading || ((config?.captcha?.scenes?.register || config?.captcha?.scenes?.send_verify_code) && !captchaVerified)}
            className="w-full py-4 bg-brand text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Initialize Identity'}
          </button>
        </form>
        <p className="mt-8 text-center text-[10px] text-white/40 uppercase tracking-widest">
          Already have an identity? <Link to="/login" className="text-brand hover:underline">Access Archive</Link>
        </p>
      </div>
    </motion.div>
  );
};
