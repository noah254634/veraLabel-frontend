import React, { useState } from 'react';
import { 
  Settings, Percent, Scale, ShieldCheck, 
  Zap, Database, Save, RotateCcw, Info,
  Globe, Lock, Wallet, Terminal, Activity
} from 'lucide-react';

const SettingsPage = () => {
  const [config, setConfig] = useState({
    commissionRate: 15,
    minWithdrawal: 50,
    consensusThreshold: 3,
    autoApproveScore: 92,
    testTaskFrequency: 10,
    kycRequired: true,
    maintenanceMode: false,
    storageRegion: 'af-south-1',
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateConfig = (key: string, value: string | number | boolean) => {
    setConfig({ ...config, [key]: value });
    setIsDirty(true);
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* 1. Header: System Override Prompt */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Global_Gov_v.01</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
            System Configuration
          </h1>
          <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed">
            Configure global marketplace physics, economic settlement rules, and quality governance protocols.
          </p>
        </div>

        {/* Floating Action Bar for Dirty State */}
        <div className={`flex gap-3 transition-all duration-500 ${isDirty ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <button 
            onClick={() => setIsDirty(false)}
            className="flex items-center gap-2 px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white"
          >
            <RotateCcw size={14} /> Discard_Changes
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-2xl shadow-indigo-500/20">
            <Save size={14} /> Commit_Global_Physics
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Economics & Governance */}
        <div className="xl:col-span-2 space-y-10">
          
          {/* Section: Economics */}
          <section className="bg-[#050505] border border-zinc-900 p-8 rounded-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"><Wallet size={18}/></div>
              <h2 className="text-xl font-bold text-white tracking-tight italic">Economics & Settlements</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <SettingSlider 
                label="Platform Commission" 
                value={config.commissionRate} 
                suffix="%" 
                min={5} max={30}
                onChange={(val: number) => updateConfig('commissionRate', val)}
                description="The baseline systemic fee extracted from all marketplace asset transactions."
              />
              <SettingInput 
                label="Min. Withdrawal (USD)" 
                value={config.minWithdrawal} 
                type="number"
                onChange={(val: string | number) => updateConfig('minWithdrawal', val)}
                description="Threshold required for annotator liquidity fulfillment."
              />
            </div>
          </section>

          {/* Section: Quality */}
          <section className="bg-[#050505] border border-zinc-900 p-8 rounded-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"><Scale size={18}/></div>
              <h2 className="text-xl font-bold text-white tracking-tight italic">Quality Governance</h2>
            </div>

            <div className="space-y-12">
              <SettingSlider 
                label="Consensus Threshold" 
                value={config.consensusThreshold} 
                suffix=" Nodes" 
                min={1} max={10}
                onChange={(val: number) => updateConfig('consensusThreshold', val)}
                description="Number of independent validation nodes required for automated fact-truth."
              />
              <SettingSlider 
                label="Neural Review Bypass" 
                value={config.autoApproveScore} 
                suffix="%" 
                min={80} max={100}
                onChange={(val: number) => updateConfig('autoApproveScore', val)}
                description="Minimum confidence interval to bypass manual administrative auditing."
              />
            </div>
          </section>
        </div>

        {/* Right Column: Integrity & AI Prediction */}
        <aside className="space-y-10">
          <section className="bg-black border border-zinc-900 p-8 rounded-sm">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8">// System_Integrity</h3>
            
            <div className="space-y-8">
              <ToggleSwitch 
                label="Mandatory KYC_v2" 
                enabled={config.kycRequired} 
                onChange={(val: boolean) => updateConfig('kycRequired', val)}
              />
              <ToggleSwitch 
                label="Maintenance_Lock" 
                enabled={config.maintenanceMode} 
                onChange={(val: boolean) => updateConfig('maintenanceMode', val)}
              />
              
              <div className="pt-8 border-t border-zinc-900">
                <label className="text-[9px] font-mono font-bold uppercase text-zinc-600 mb-3 block tracking-widest">Active_Data_Region</label>
                <select 
                  value={config.storageRegion}
                  onChange={(e) => updateConfig('storageRegion', e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 text-zinc-400 text-xs py-4 px-4 outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="us-east-1">AWS :: US_EAST_1 (Virginia)</option>
                  <option value="eu-central-1">AWS :: EU_CENTRAL_1 (Frankfurt)</option>
                  <option value="af-south-1">AWS :: AF_SOUTH_1 (Cape Town)</option>
                </select>
              </div>
            </div>
          </section>

          {/* AI Simulation Widget */}
          <div className="bg-indigo-600 p-8 rounded-sm text-white shadow-2xl shadow-indigo-950/50 group">
            <Activity className="mb-6 text-indigo-200 group-hover:animate-pulse" size={24} />
            <h3 className="font-bold text-sm uppercase tracking-widest italic mb-3">Simulation Mode</h3>
            <p className="text-indigo-100 text-[11px] leading-relaxed font-light">
              VeraLabel Intelligence predicts that a <span className="font-bold text-white">{config.commissionRate}%</span> commission may reduce node retention by <span className="font-bold text-white">4.2%</span> over the next 90 days.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- TECHNICAL UI HELPERS ---

const SettingSlider = ({ label, value, suffix, min, max, onChange, description }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          {label} <Info size={12} className="text-zinc-700" />
        </label>
        <p className="text-[10px] text-zinc-600 max-w-[240px] font-light italic leading-tight">{description}</p>
      </div>
      <div className="text-lg font-bold text-white tabular-nums bg-zinc-900 border border-zinc-800 px-4 py-1">
        {value}{suffix}
      </div>
    </div>
    <input 
      type="range" 
      min={min} max={max} value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-zinc-900 rounded-none appearance-none cursor-pointer accent-indigo-500"
    />
  </div>
);

const SettingInput = ({ label, value, type, onChange, description }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#050505] border border-zinc-900 p-4 text-xs font-mono font-bold text-white outline-none focus:border-indigo-500 transition-all"
    />
    <p className="text-[10px] text-zinc-600 italic font-light">{description}</p>
  </div>
);

const ToggleSwitch = ({ label, enabled, onChange }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">{label}</span>
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 transition-colors relative ${enabled ? 'bg-indigo-600' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 h-3 w-3 bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsPage;