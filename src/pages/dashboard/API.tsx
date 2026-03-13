import React from 'react';
import { Copy, RefreshCw, Trash2, HelpCircle, Activity, Zap } from 'lucide-react';

export const DashboardAPI = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-serif italic mb-2">API Integration</h2>
        <p className="text-xs text-white/40">Manage your API keys and integrate Nova Collective services.</p>
      </div>
      <button className="px-6 py-3 bg-brand text-surface rounded-full text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all">Create New Key</button>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Key</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Last Used</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[
            { name: 'Production App', key: 'nova_live_••••••••••••••••', last: '2 mins ago', status: 'Active' },
            { name: 'Staging Environment', key: 'nova_test_••••••••••••••••', last: '3 days ago', status: 'Active' },
          ].map((key, i) => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
              <td className="px-6 py-4 text-xs font-medium">{key.name}</td>
              <td className="px-6 py-4 font-mono text-[10px] text-white/40">{key.key}</td>
              <td className="px-6 py-4 text-[10px] text-white/20 uppercase">{key.last}</td>
              <td className="px-6 py-4">
                <span className="text-[8px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded uppercase tracking-widest">{key.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button className="p-2 text-white/20 hover:text-white transition-colors"><Copy size={14} /></button>
                  <button className="p-2 text-white/20 hover:text-brand transition-colors"><RefreshCw size={14} /></button>
                  <button className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'API Documentation', desc: 'View the complete REST API reference guide', icon: HelpCircle },
        { title: 'Webhooks', desc: 'Configure real-time event notifications', icon: Activity },
        { title: 'Download SDK', desc: 'Get official Node.js and Python SDKs', icon: Zap },
      ].map((item, i) => (
        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand/50 transition-all cursor-pointer group">
          <item.icon size={20} className="text-brand mb-4" />
          <h4 className="text-sm font-bold uppercase tracking-widest mb-2 group-hover:text-brand transition-colors">{item.title}</h4>
          <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
