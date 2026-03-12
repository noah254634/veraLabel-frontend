import React from 'react';
import { useAuthStore } from '../../auth/useAuthstore';
import { User, Shield, Bell, Globe, Terminal, Save, RotateCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuthStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System configurations updated.');
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Page Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-indigo-500 mb-4">
          <Terminal size={16} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">User_Config_v2.0</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tighter">Account Settings</h1>
        <p className="text-zinc-500 mt-2 font-light">Manage your global identity, security protocols, and regional preferences.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-12">
        
        {/* 1. Profile Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-zinc-900 pt-10">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">
              <User size={18} className="text-indigo-500" /> Identity
            </h3>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">Your public identifier and communication endpoint across the infrastructure.</p>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingField label="Full Name" defaultValue={user?.name} disabled />
              <SettingField label="Email Endpoint" defaultValue={user?.email} disabled />
            </div>
          </div>
        </section>

        {/* 2. Regional & Settlement Section (New) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-zinc-900 pt-10">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">
              <Globe size={18} className="text-indigo-500" /> Localization
            </h3>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">Configure how the system handles regional data and currency settlement.</p>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Preferred Currency</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-sm p-3 text-sm focus:border-indigo-500 outline-none transition-all">
                  <option>USD - United States Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Primary Node Region</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-sm p-3 text-sm focus:border-indigo-500 outline-none transition-all">
                  <option>Automatic (Lowest Latency)</option>
                  <option>Africa East (Nairobi)</option>
                  <option>Africa West (Lagos)</option>
                  <option>Europe North (Dublin)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Security Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-zinc-900 pt-10">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">
              <Shield size={18} className="text-indigo-500" /> Security
            </h3>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">Update access keys and manage multi-factor authentication protocols.</p>
          </div>
          <div className="lg:col-span-2 max-w-md space-y-6">
            <SettingField label="Current Access Key" type="password" placeholder="••••••••" />
            <SettingField label="New Access Key" type="password" placeholder="••••••••" />
          </div>
        </section>

        {/* 4. Notification Toggles */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-zinc-900 pt-10">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">
              <Bell size={18} className="text-indigo-500" /> Alerts
            </h3>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">Configure systemic triggers and marketplace intelligence updates.</p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <CheckboxLabel label="Telemetry updates for purchased datasets" defaultChecked />
            <CheckboxLabel label="Weekly marketplace liquidity & data report" />
            <CheckboxLabel label="Security alerts for unauthorized node access" defaultChecked />
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-12 border-t border-zinc-900">
          <button type="button" className="flex items-center justify-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            <RotateCcw size={14} /> Discard_Changes
          </button>
          <button type="submit" className="flex items-center justify-center gap-2 bg-white text-black px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-[0.98]">
            <Save size={14} /> Save_System_Config
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper Components
const SettingField = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600">{label}</label>
    <input 
      {...props} 
      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-sm p-3 text-sm focus:border-indigo-500 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed font-light" 
    />
  </div>
);

const CheckboxLabel = ({ label, defaultChecked }: any) => (
  <label className="flex items-center gap-4 cursor-pointer group py-2">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        defaultChecked={defaultChecked} 
        className="peer h-5 w-5 bg-zinc-950 border border-zinc-800 checked:bg-indigo-600 checked:border-indigo-600 transition-all appearance-none rounded-sm" 
      />
      <div className="absolute text-white scale-0 peer-checked:scale-100 transition-transform left-1 pointer-events-none">
        <svg size={12} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
    </div>
    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{label}</span>
  </label>
);

export default Settings;