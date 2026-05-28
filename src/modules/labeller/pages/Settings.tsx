import { useState } from 'react';
import { 
  User, Shield, Monitor, CreditCard, 
   ChevronRight, Settings,
  Database, Bell, Activity, Key
} from 'lucide-react';
import { useLabelerStore } from '../store/labelerStore';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
   const { labeller } = useLabelerStore();

    const expertise = typeof labeller?.expertise === 'object' && labeller.expertise !== null
       ? labeller.expertise
       : undefined;
   const profile = labeller?.profile;
   const user = labeller?.userId && typeof labeller.userId === 'object' ? (labeller.userId as any) : null;
   const displayName = user?.name || 'Operator';
   const displayEmail = user?.email || 'n/a';
   const location = profile?.location || labeller?.location;
   const languages = profile?.languages || labeller?.languages || [];
    const skills = expertise?.skills || [];

  const tabs = [
    { id: 'profile', label: 'Identity_Profile', icon: <User size={16} /> },
    { id: 'mission', label: 'Mission_Preferences', icon: <Database size={16} /> },
    { id: 'workspace', label: 'Workspace_Ergonomics', icon: <Monitor size={16} /> },
    { id: 'payouts', label: 'Financial_Settlement', icon: <CreditCard size={16} /> },
    { id: 'security', label: 'Node_Security', icon: <Shield size={16} /> },
  ];

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700 font-sans">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-indigo-500 mb-2">
           <Settings size={16} />
           <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold">System_Preferences_v4</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic">
               Labeller Configuration
        </h1>
        <p className="text-zinc-500 font-light text-sm">
               Modify the live labeller profile and mission preferences synced from the backend.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-72 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 transition-all group border
                ${activeTab === tab.id 
                  ? 'bg-zinc-950 border-indigo-500/50 text-white shadow-xl shadow-indigo-500/5' 
                  : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`${activeTab === tab.id ? 'text-indigo-500' : 'text-zinc-700'}`}>
                   {tab.icon}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
                   {tab.label}
                </span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-500 ${activeTab === tab.id ? 'rotate-90 text-indigo-500' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </aside>
        <div className="flex-1 bg-[#020203] border border-zinc-900 p-8 md:p-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
           {activeTab === 'profile' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-8 pb-10 border-b border-zinc-900">
                   <div className="relative">
                      <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden">
                         <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 opacity-80" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white border-4 border-[#020203]">
                         <Activity size={12} />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white tracking-tight italic">{displayName}</h3>
                      <p className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest font-bold">{labeller?.tier || 'Trainee'} // Labeller_Profile</p>
                      <p className="text-xs text-zinc-500">Node_ID: {labeller?._id || 'unassigned'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <NeoInput label="OPERATOR_NAME" value={displayName} readOnly />
                   <NeoInput label="CONTACT_ENDPOINT" value={displayEmail} readOnly />
                   <NeoInput label="REGIONAL_NODE" value={location ? [location.country, location.city, location.region].filter(Boolean).join(' / ') : 'Unspecified'} readOnly />
                   <NeoInput label="LANGUAGE_PROTOCOLS" value={Array.isArray(languages) ? languages.join(', ') : String(languages || '')} readOnly />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <NeoInput label="ANNOTATION_SKILLS" value={skills.length > 0 ? skills.join(', ') : 'None'} readOnly />
                  <NeoInput label="ONBOARDING_STATE" value={labeller?.isOnboarded ? 'Completed' : 'In Progress'} readOnly />
                </div>
             </div>
           )}
           {activeTab === 'mission' && (
             <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <header className="space-y-2">
                   <h3 className="text-xl font-bold text-white">Target_Optimization</h3>
                   <p className="text-xs text-zinc-500 leading-relaxed max-w-lg italic">
                      Configure your specialized mission intake filters. Higher specialization improves accuracy bonuses.
                   </p>
                </header>
                
                <div className="space-y-4">
                   <NeoToggle 
                     icon={<Database size={14}/>} 
                     title="RLHF_Specialization" 
                     desc="Prioritize Large Language Model feedback loops and response ranking."
                     active={true}
                   />
                   <NeoToggle 
                     icon={<Activity size={14}/>} 
                     title="Visual_Bounding_Nodes" 
                     desc="High-precision image and video annotation tasks."
                     active={true}
                   />
                   <NeoToggle 
                     icon={<Bell size={14}/>} 
                     title="Priority_Mission_Alerts" 
                     desc="Flash notification for time-sensitive, high-reward batches."
                     active={false}
                   />
                </div>
             </div>
           )}
           {activeTab === 'workspace' && (
             <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <header className="space-y-2">
                   <h3 className="text-xl font-bold text-white">Neural_Interface_Calibration</h3>
                   <p className="text-xs text-zinc-500 leading-relaxed italic">
                      Calibrate the workbench for maximum ergonomics and throughput.
                   </p>
                </header>
                
                <div className="space-y-4">
                   <NeoToggle 
                     title="High_Frequency_Refresh" 
                     desc="Enable sub-millisecond viewport synchronization."
                     active={true}
                   />
                   <NeoToggle 
                     title="Auto_Advance_Registry" 
                     desc="Immediately bridge to next asset upon transfer completion."
                     active={false}
                   />
                   <NeoToggle 
                     title="Developer_Logs" 
                     desc="Display technical terminal output during sync phases."
                     active={true}
                   />
                </div>
             </div>
           )}
           {activeTab === 'security' && (
             <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div className="p-8 border border-zinc-900 bg-zinc-950 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="space-y-2 text-center md:text-left">
                      <div className="flex justify-center md:justify-start items-center gap-2 text-rose-500 mb-2">
                         <Key size={14} />
                         <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Security_Protocol_Override</span>
                      </div>
                      <h4 className="text-lg font-bold text-white">Multi-Factor Authentication</h4>
                      <p className="text-xs text-zinc-500 italic max-w-sm">Requires node-specific authorization for all asset withdrawals.</p>
                   </div>
                   <button className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                      Initialize_MFA
                   </button>
                </div>
             </div>
           )}

           <div className="mt-16 pt-8 border-t border-zinc-900 flex justify-end gap-4">
              <button className="px-8 py-3 text-[10px] font-mono font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest">
                 Discard_Changes
              </button>
              <button className="px-10 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-xl shadow-white/5">
                 Synchronize_Settings
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- NEO COMPONENTS ---

const NeoInput = ({ label, value, readOnly }: any) => (
  <div className="space-y-3 group">
    <label className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-[0.3em] group-focus-within:text-indigo-500 transition-colors">
       {label}
    </label>
    <div className="relative">
       <input 
         type="text" 
         defaultValue={value} 
         readOnly={readOnly}
         className={`w-full bg-zinc-950 border border-zinc-900 px-5 py-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-all ${readOnly ? 'opacity-40 cursor-not-allowed bg-transparent' : ''}`}
       />
       {!readOnly && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-indigo-500 animate-pulse" />}
    </div>
  </div>
);

const NeoToggle = ({ icon, title, desc, active }: any) => (
  <div className={`p-6 border transition-all flex items-center justify-between gap-6 group ${active ? 'bg-zinc-950 border-zinc-800' : 'bg-transparent border-zinc-900/50 hover:border-zinc-800'}`}>
    <div className="flex items-center gap-5">
       {icon && <div className={`${active ? 'text-indigo-500' : 'text-zinc-700'}`}>{icon}</div>}
       <div className="space-y-1">
          <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-zinc-500'}`}>{title}</p>
          <p className="text-[10px] text-zinc-600 italic font-light leading-relaxed">{desc}</p>
       </div>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-all duration-500 ${active ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-zinc-800'}`}>
       <div className={`absolute top-1 w-3 h-3 bg-white transition-all duration-500 ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </div>
);