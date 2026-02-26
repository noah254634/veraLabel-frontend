import React, { useState } from 'react';
import { 
  Settings, Percent, Scale, ShieldCheck, 
  Zap, Database, Save, RotateCcw, Info,
  Globe, Lock, Wallet
} from 'lucide-react';

const SettingsPage = () => {
  // Mock Data mimicking a Backend Configuration Object
  const [config, setConfig] = useState({
    commissionRate: 15,
    minWithdrawal: 50,
    consensusThreshold: 3,
    autoApproveScore: 92,
    testTaskFrequency: 10,
    kycRequired: true,
    maintenanceMode: false,
    storageRegion: 'us-east-1',
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateConfig = (key: string, value: string | number | boolean) => {
    setConfig({ ...config, [key]: value });
    setIsDirty(true);
  };

  return (
    <div className="lg:pb-20 space-y-8 ">
      {/* Header with Save State */}
      <div className="flex p-3xl  justify-between items-center sticky top-0 bg-gray-900 backdrop-blur-md rounded-2xl py-4 z-20">
        <div className=' py-2 px-3'>
          <h1 className="text-3xl font-bold text-white-900 tracking-tight pb-1 ">System Configuration</h1>
          <p className="text-white-100  900 text-sm font-sm ">Configure global marketplace physics and governance.</p>
        </div>
        
        {isDirty && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-right-4">
            <button 
              onClick={() => {setIsDirty(false)}}
              className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-200 rounded-xl transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} /> Discard
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Save size={16} /> Apply Global Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Marketplace Economics */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Wallet size={20}/></div>
              <h2 className="text-xl font-bold text-slate-800">Economics & Payouts</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <SettingSlider 
                label="Platform Commission" 
                value={config.commissionRate} 
                suffix="%" 
                min={5} max={30}
                onChange={(val) => updateConfig('commissionRate', val)}
                description="The percentage VeraLabel takes from every buyer transaction."
              />
              <SettingInput 
                label="Min. Withdrawal (USD)" 
                value={config.minWithdrawal} 
                type="number"
                onChange={(val) => updateConfig('minWithdrawal', val)}
                description="Minimum earnings required for annotators to cash out."
              />
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Scale size={20}/></div>
              <h2 className="text-xl font-bold text-slate-800">Quality Governance</h2>
            </div>

            <div className="space-y-8">
              <SettingSlider 
                label="Consensus Threshold" 
                value={config.consensusThreshold} 
                suffix=" Annotators" 
                min={1} max={10}
                onChange={(val) => updateConfig('consensusThreshold', val)}
                description="Number of independent annotators required to agree for auto-approval."
              />
              <SettingSlider 
                label="Auto-Approve Accuracy" 
                value={config.autoApproveScore} 
                suffix="%" 
                min={80} max={100}
                onChange={(val) => updateConfig('autoApproveScore', val)}
                description="Minimum IoU/Accuracy score to bypass manual admin review."
              />
            </div>
          </section>
        </div>

        {/* Right Column: Platform & Security */}
        <div className="space-y-6">
          <section className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">System Integrity</h3>
            
            <div className="space-y-6">
              <ToggleSwitch 
                label="Strict KYC" 
                enabled={config.kycRequired} 
                onChange={(val) => updateConfig('kycRequired', val)}
              />
              <ToggleSwitch 
                label="Maintenance Mode" 
                enabled={config.maintenanceMode} 
                onChange={(val) => updateConfig('maintenanceMode', val)}
              />
              
              <div className="pt-4 border-t border-slate-800">
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Data Region</label>
                <select 
                  value={config.storageRegion}
                  onChange={(e) => updateConfig('storageRegion', e.target.value)}
                  className="w-full bg-slate-800 border-none rounded-xl text-sm py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="us-east-1">AWS - US East (N. Virginia)</option>
                  <option value="eu-central-1">AWS - Europe (Frankfurt)</option>
                  <option value="af-south-1">AWS - Africa (Cape Town)</option>
                </select>
              </div>
            </div>
          </section>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
            <Zap className="mb-4 opacity-50" />
            <h3 className="font-bold text-lg leading-tight mb-2">Simulation Mode</h3>
            <p className="text-indigo-100 text-xs leading-relaxed">
              VeraLabel's AI predicts that increasing commission to {config.commissionRate}% might reduce annotator retention by 4.2%.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Custom Styled UI Components ---

interface SettingSliderProps {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  onChange: (val: number) => void;
  description: string;
}
const SettingSlider = ({ label, value, suffix, min, max, onChange, description }: SettingSliderProps) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end">
      <div>
        <label className="text-sm font-black text-slate-800 flex items-center gap-1">
          {label} <Info size={14} className="text-slate-300" />
        </label>
        <p className="text-[11px] text-slate-400 max-w-[200px]">{description}</p>
      </div>
      <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{value}{suffix}</span>
    </div>
    <input 
      type="range" 
      min={min} max={max} value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

interface SettingInputProps {
  label: string;
  value: string | number;
  type: string;
  onChange: (val: string) => void;
  description: string;
}
const SettingInput = ({ label, value, type, onChange, description }: SettingInputProps) => (
  <div className="space-y-4">
    <label className="text-sm font-black text-slate-800 block">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    />
    <p className="text-[11px] text-slate-400 italic leading-relaxed">{description}</p>
  </div>
);

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}
const ToggleSwitch = ({ label, enabled, onChange }: ToggleSwitchProps) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-slate-300">{label}</span>
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsPage;