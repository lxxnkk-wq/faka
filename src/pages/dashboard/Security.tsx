import React from 'react';
import { Shield, CheckCircle2, Activity } from 'lucide-react';

export const DashboardSecurity = () => (
  <div className="space-y-8">
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-lg font-serif italic">Security Center</h3>
          <p className="text-xs text-white/40">Protect your account from unauthorized access.</p>
        </div>
      </div>

      <div className="space-y-6">
        {[
          { title: 'Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security to your account using an authenticator app.', status: 'Not Enabled', action: 'Set Up Now', active: false },
          { title: 'Login Password', desc: 'Change your password regularly to keep your account secure.', status: 'Last changed: 30 days ago', action: 'Change Password', active: true },
          { title: 'Security Questions', desc: 'Serve as an additional verification method when recovering your account.', status: 'Set', action: 'Update', active: true },
        ].map((item, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-white/5 rounded-xl">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-sm font-bold uppercase tracking-widest">{item.title}</h4>
                {item.active ? (
                  <CheckCircle2 size={12} className="text-emerald-500" />
                ) : (
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded uppercase">Recommended</span>
                )}
              </div>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.status}</span>
              <button className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                {item.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Recent Login Activity</h3>
      <div className="space-y-4">
        {[
          { device: 'Chrome on macOS', location: 'Shanghai, China', ip: '192.168.1.1', time: 'Online Now' },
          { device: 'Safari on iPhone', location: 'Beijing, China', ip: '110.24.56.12', time: '2 hours ago' },
        ].map((log, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-xs font-medium">{log.device}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">{log.location} • {log.ip}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${log.time === 'Online Now' ? 'text-brand' : 'text-white/20'}`}>
              {log.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
