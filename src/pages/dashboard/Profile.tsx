import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const DashboardProfile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.nickname || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(name);
      addToast('Profile updated successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-serif italic text-3xl overflow-hidden">
            {user?.nickname?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white">
            Change
          </button>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif italic mb-1">{user?.nickname || 'Nova Collector'}</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-brand/10 text-brand text-[9px] font-black uppercase tracking-widest rounded-full">Premium Member</span>
            <span className="px-3 py-1 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-full">Verified Identity</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Identity Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Public Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-all"
                placeholder="Enter your name"
              />
              <p className="text-[9px] text-white/20 mt-2 uppercase tracking-widest italic">This is how you will appear in the Nova archive.</p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm opacity-50 cursor-not-allowed"
              />
              <p className="text-[9px] text-white/20 mt-2 uppercase tracking-widest italic">Primary contact for digital key delivery.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Preferred Language</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-all appearance-none">
                <option value="en">English (US)</option>
                <option value="zh">简体中文 (Simplified Chinese)</option>
                <option value="jp">日本語 (Japanese)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Timezone</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-all appearance-none">
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                <option value="UTC">UTC (Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-4 bg-brand text-surface rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-brand/10"
          >
            {saving ? 'Synchronizing...' : 'Update Identity'}
          </button>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-4">Danger Zone</h3>
        <p className="text-xs text-white/40 mb-8 leading-relaxed">Once you delete your identity, all digital keys, order history, and wallet balance will be permanently purged from the Nova archive.</p>
        <button className="px-8 py-4 border border-red-500/30 text-red-500 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all">
          Purge Identity
        </button>
      </div>
    </div>
  );
};
