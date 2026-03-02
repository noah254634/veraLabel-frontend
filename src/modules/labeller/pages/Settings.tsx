import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Monitor, 
  CreditCard, 
  Bell, 
  Check, 
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Sidebar Tabs Configuration
  const tabs = [
    { id: 'profile', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'workspace', label: 'Workbench Prefs', icon: <Monitor size={18} /> },
    { id: 'payouts', label: 'Payout Methods', icon: <CreditCard size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your labeller profile and workspace configuration.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* --- LEFT: NAVIGATION --- */}
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                {tab.label}
              </div>
              <ChevronRight size={14} className={`transition-transform ${activeTab === tab.id ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </aside>

        {/* --- RIGHT: CONTENT AREA --- */}
        <div className="flex-1 bg-[#161B22] border border-white/5 rounded-[32px] p-8 shadow-2xl min-h-[500px]">
          
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 border-4 border-[#0B0E14] shadow-xl" />
                <div>
                  <h3 className="text-xl font-bold text-white">Noah Khaemba</h3>
                  <p className="text-sm text-gray-500">Computer Science Student @ Kibabii Uni</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" value="Noah Khaemba" readOnly />
                <InputGroup label="Email Address" value="noah@example.com" />
              </div>
            </div>
          )}

          {/* WORKSPACE PREFS (High-End Toggles) */}
          {activeTab === 'workspace' && (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <h3 className="text-lg font-bold mb-4">Workbench Ergonomics</h3>
              <ToggleItem 
                title="High-Precision Crosshair" 
                description="Follow cursor with intersection lines for pixel-perfect bounding boxes."
                enabled={true} 
              />
              <ToggleItem 
                title="Auto-Advance Batch" 
                description="Immediately load next task after submitting annotation."
                enabled={false} 
              />
              <ToggleItem 
                title="Performance Analytics" 
                description="Show real-time accuracy feedback during labeling sessions."
                enabled={true} 
              />
            </div>
          )}

          {/* PAYOUT METHODS (M-Pesa) */}
          {activeTab === 'payouts' && (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <h3 className="text-lg font-bold mb-4">Payout Configuration</h3>
              <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl"><Smartphone className="text-green-500" /></div>
                  <div>
                    <p className="font-bold text-white">Safaricom M-Pesa</p>
                    <p className="text-xs text-gray-500">Default: +254 7XX XXX 123</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase">
                  <Check size={14} /> Active
                </div>
              </div>
              <PrimaryButton variant="outline" className="w-full">Add Secondary Method</PrimaryButton>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-white/5 flex justify-end">
            <PrimaryButton>Save All Changes</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InputGroup = ({ label, value, readOnly = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      defaultValue={value} 
      readOnly={readOnly}
      className={`w-full bg-[#0B0E14] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);

const ToggleItem = ({ title, description, enabled }: any) => (
  <div className="flex justify-between items-center p-4 bg-[#0B0E14] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
    </div>
    <div className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${enabled ? 'bg-blue-600' : 'bg-white/10'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);