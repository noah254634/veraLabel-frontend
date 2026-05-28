import React, { useState, useCallback } from 'react';
import { 
  Settings, Percent, Scale, ShieldCheck, 
  Zap, Database, Save, RotateCcw, Info,
  Globe, Lock, Wallet, Terminal, Activity,
  ChevronRight, Brain, Server, Share2, RefreshCw, AlertTriangle
} from 'lucide-react';
import { datasetService } from '../services/datasetService';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('economics');
  const [config, setConfig] = useState({
    commissionRate: 15,
    minWithdrawal: 50,
    consensusThreshold: 3,
    autoApproveScore: 92,
    testTaskFrequency: 10,
    kycRequired: true,
    maintenanceMode: false,
    storageRegion: 'af-south-1',
    apiRateLimit: 1000,
    neuralBoost: true
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateConfig = (key: string, value: string | number | boolean) => {
    setConfig({ ...config, [key]: value });
    setIsDirty(true);
  };

  const tabs = [
    { id: 'economics', label: 'Market_Economics', icon: <Wallet size={16} /> },
    { id: 'governance', label: 'Quality_Governance', icon: <Scale size={16} /> },
    { id: 'infrastructure', label: 'System_Infra', icon: <Server size={16} /> },
    { id: 'security', label: 'Security_Protocols', icon: <Lock size={16} /> },
    { id: 'integrations', label: 'API_Integrations', icon: <Share2 size={16} /> },
    { id: 'operations', label: 'Batch_Operations', icon: <RefreshCw size={16} /> },
  ];

  // Global revoke state
  const [globalRevokeConfirm, setGlobalRevokeConfirm] = useState(false);
  const [isGlobalRevoking, setIsGlobalRevoking] = useState(false);
  const [globalRevokeResult, setGlobalRevokeResult] = useState<{ revoked: number; tasksReset: number } | null>(null);

  const handleGlobalRevoke = useCallback(async () => {
    if (!globalRevokeConfirm) {
      setGlobalRevokeConfirm(true);
      setTimeout(() => setGlobalRevokeConfirm(false), 6000);
      return;
    }
    setIsGlobalRevoking(true);
    setGlobalRevokeConfirm(false);
    try {
      const result = await datasetService.revokeAllExpiredBatches();
      setGlobalRevokeResult(result);
    } catch {
      setGlobalRevokeResult(null);
    } finally {
      setIsGlobalRevoking(false);
    }
  }, [globalRevokeConfirm]);

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700 font-sans">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-l-2 border-indigo-500 pl-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold">Admin_Override_v4.2.1</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter italic">
            System Physics
          </h1>
          <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed max-w-lg italic">
            Calibrate the systemic constants of the VeraLabel marketplace. All changes propagate across the neural network in real-time.
          </p>
        </div>
        <div className={`flex gap-3 transition-all duration-500 ${isDirty ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2 pointer-events-none'}`}>
          <button 
            onClick={() => setIsDirty(false)}
            className="flex items-center gap-2 px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-all"
          >
            <RotateCcw size={14} /> Discard_Override
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
            <Save size={14} /> Commit_Constants
          </button>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-12">
        <aside className="w-full xl:w-72 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-5 transition-all group border
                ${activeTab === tab.id 
                  ? 'bg-zinc-950 border-indigo-500/50 text-white shadow-xl shadow-indigo-500/5' 
                  : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`${activeTab === tab.id ? 'text-indigo-500' : 'text-zinc-800'}`}>
                   {tab.icon}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
                   {tab.label}
                </span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-500 ${activeTab === tab.id ? 'rotate-90 text-indigo-500' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
          <div className="mt-12 p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-sm space-y-4">
             <div className="flex items-center gap-2 text-indigo-500">
                <Brain size={16} />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Predictive_Sync</span>
             </div>
             <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                Systemic stability is currently <span className="text-emerald-500 font-bold">OPTIMAL</span>. No conflicting overrides detected in the current queue.
             </p>
          </div>
        </aside>
        <div className="flex-1 space-y-10">
          <div className="bg-[#020203] border border-zinc-900 p-8 md:p-12 relative overflow-hidden min-h-[600px]">
             <div className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
             {activeTab === 'economics' && (
               <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                  <header className="space-y-2">
                     <h2 className="text-2xl font-bold text-white tracking-tight italic">Marketplace Economics</h2>
                     <p className="text-xs text-zinc-500 italic max-w-lg">Define the flow of value and the extraction parameters for all system-wide settlements.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <NeoSlider 
                       label="System_Commission" 
                       value={config.commissionRate} 
                       suffix="%" 
                       min={5} max={30}
                       onChange={(v: number) => updateConfig('commissionRate', v)}
                       desc="Global systemic fee applied to all cross-node transactions."
                     />
                     <NeoInput 
                       label="Settlement_Floor" 
                       value={config.minWithdrawal} 
                       type="number"
                       onChange={(v: any) => updateConfig('minWithdrawal', v)}
                       desc="Minimum liquidity threshold required for external wallet fulfillment."
                     />
                  </div>
               </div>
             )}
             {activeTab === 'governance' && (
               <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                  <header className="space-y-2">
                     <h2 className="text-2xl font-bold text-white tracking-tight italic">Quality Governance</h2>
                     <p className="text-xs text-zinc-500 italic max-w-lg">Configure the truth-consensus and auto-approval thresholds for neural verification.</p>
                  </header>

                  <div className="space-y-12">
                     <NeoSlider 
                       label="Consensus_Nodes" 
                       value={config.consensusThreshold} 
                       suffix=" Entities" 
                       min={1} max={10}
                       onChange={(v: number) => updateConfig('consensusThreshold', v)}
                       desc="Number of independent high-tier labellers required for automated validation."
                     />
                     <NeoSlider 
                       label="Neural_Confidence_Floor" 
                       value={config.autoApproveScore} 
                       suffix="%" 
                       min={80} max={100}
                       onChange={(v: number) => updateConfig('autoApproveScore', v)}
                       desc="The minimum accuracy interval required to bypass manual administrative review."
                     />
                  </div>
               </div>
             )}
             {activeTab === 'infrastructure' && (
               <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                  <header className="space-y-2">
                     <h2 className="text-2xl font-bold text-white tracking-tight italic">Infrastructure & Core</h2>
                     <p className="text-xs text-zinc-500 italic max-w-lg">Calibrate hardware resource allocation and regional node routing.</p>
                  </header>

                  <div className="space-y-8">
                     <div className="p-8 border border-zinc-900 bg-zinc-950/50 space-y-6">
                        <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest block">Primary_Data_Region</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <RegionBtn active={config.storageRegion === 'us-east-1'} onClick={() => updateConfig('storageRegion', 'us-east-1')} label="US_EAST_01" sub="VIRGINIA" />
                           <RegionBtn active={config.storageRegion === 'eu-central-1'} onClick={() => updateConfig('storageRegion', 'eu-central-1')} label="EU_CENTRAL_01" sub="FRANKFURT" />
                           <RegionBtn active={config.storageRegion === 'af-south-1'} onClick={() => updateConfig('storageRegion', 'af-south-1')} label="AF_SOUTH_01" sub="CAPE_TOWN" />
                        </div>
                     </div>
                     <NeoToggle 
                        title="Neural_Boost_Engine" 
                        desc="Activate GPU-accelerated rendering for high-fidelity image batches."
                        active={config.neuralBoost}
                        onChange={(v: boolean) => updateConfig('neuralBoost', v)}
                     />
                  </div>
               </div>
             )}
             {activeTab === 'security' && (
               <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                  <header className="space-y-2">
                     <h2 className="text-2xl font-bold text-white tracking-tight italic">Security Protocols</h2>
                     <p className="text-xs text-zinc-500 italic max-w-lg">Modify the authentication barriers and systemic locking mechanisms.</p>
                  </header>

                  <div className="space-y-6">
                     <NeoToggle 
                        title="Mandatory_KYC_Enforcement" 
                        desc="Require government ID verification for all users claiming high-value missions."
                        active={config.kycRequired}
                        onChange={(v: boolean) => updateConfig('kycRequired', v)}
                     />
                     <NeoToggle 
                        title="System_Maintenance_Lock" 
                        desc="Disable all external mission claim requests. Nodes enter read-only mode."
                        active={config.maintenanceMode}
                        onChange={(v: boolean) => updateConfig('maintenanceMode', v)}
                     />
                  </div>
               </div>
             )}
             {activeTab === 'operations' && (
               <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <header className="space-y-2">
                     <h2 className="text-2xl font-bold text-white tracking-tight italic">Batch Operations</h2>
                     <p className="text-xs text-zinc-500 italic max-w-lg">
                       Platform-wide maintenance controls. These operations affect all labellers and datasets simultaneously.
                     </p>
                  </header>
                  <div className="border border-zinc-900 bg-zinc-950/50 p-8 space-y-6">
                     <div className="flex items-start justify-between gap-6">
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <AlertTriangle size={14} className="text-amber-500" />
                           <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global_Expired_Batch_Sweep</h3>
                         </div>
                         <p className="text-[10px] text-zinc-500 italic leading-relaxed max-w-md">
                           Scans all datasets platform-wide and revokes every batch where the labeller's assignment window has expired. 
                           Expired tasks are returned to the pool for re-claiming. This is the same operation the cron job runs automatically.
                         </p>
                         {globalRevokeResult && (
                           <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
                             <p className="text-[10px] font-mono text-emerald-400">
                               ✓ Last sweep: <span className="font-bold">{globalRevokeResult.revoked}</span> batch(es) revoked,{" "}
                               <span className="font-bold">{globalRevokeResult.tasksReset}</span> task(s) returned to pool.
                             </p>
                           </div>
                         )}
                       </div>

                       <button
                         id="global-revoke-expired-batches"
                         onClick={handleGlobalRevoke}
                         disabled={isGlobalRevoking}
                         className={`shrink-0 px-6 py-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                           globalRevokeConfirm
                             ? 'bg-amber-500/10 border-amber-500 text-amber-400 animate-pulse'
                             : isGlobalRevoking
                             ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                             : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500/50 hover:text-amber-400'
                         }`}
                       >
                         {isGlobalRevoking ? (
                           <><RefreshCw size={14} className="animate-spin" /> Sweeping...</>
                         ) : globalRevokeConfirm ? (
                           <><AlertTriangle size={14} /> Confirm_Sweep?</>
                         ) : (
                           <><RotateCcw size={14} /> Run_Sweep</>
                         )}
                       </button>
                     </div>
                     <div className="pt-4 border-t border-zinc-900">
                       <p className="text-[9px] font-mono text-zinc-700">
                         SAFE_OPERATION — Only affects batches with <span className="text-zinc-500">status: in_progress</span> AND <span className="text-zinc-500">expiresAt &lt; now</span>. Does not touch verified or submitted tasks.
                       </p>
                     </div>
                  </div>
               </div>
             )}
           </div>
          <section className="bg-black border border-zinc-900 p-8 space-y-6">
             <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2 text-zinc-600">
                   <Activity size={14} />
                   <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">Neural_Simulation_Output</h3>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                   <span className="text-[9px] font-mono text-indigo-500 font-bold uppercase">Live_Analysis_Active</span>
                </div>
             </div>
             
             <div className="space-y-2 font-mono">
                <p className="text-[10px] text-zinc-500 tracking-tighter italic">
                   {">>"} ANALYZING: COMMISSION_RATE_OVERRIDE [{config.commissionRate}%]
                </p>
                <p className="text-[10px] text-zinc-400 tracking-tighter">
                   {">>"} PREDICTION: SETTLING AT THIS LEVEL WILL RESULT IN A <span className="text-rose-500">{(config.commissionRate * 0.2).toFixed(1)}%</span> REDUCTION IN LABELLER RETENTION.
                </p>
                <p className="text-[10px] text-zinc-400 tracking-tighter">
                   {">>"} IMPACT_ANALYSIS: REVENUE GROWTH OFFSET BY NODE TURNOVER IS ESTIMATED AT <span className="text-emerald-500">+${(config.commissionRate * 1200).toLocaleString()}</span> PER QUARTER.
                </p>
                <p className="text-[10px] text-zinc-600 tracking-tighter">
                   {">>"} SYSTEM_ADVISORY: MAINTAIN COMMISSION BELOW 18.5% TO ENSURE MISSION_VELOCITY_STABILITY.
                </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- NEO COMPONENTS ---

const NeoSlider = ({ label, value, suffix, min, max, onChange, desc }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
          {label}
        </label>
        <p className="text-[10px] text-zinc-700 italic max-w-[280px] leading-tight">{desc}</p>
      </div>
      <div className="text-xl font-bold text-white tabular-nums border border-zinc-800 bg-zinc-950 px-5 py-2">
        {value}{suffix}
      </div>
    </div>
    <div className="relative pt-2">
       <input 
         type="range" 
         min={min} max={max} value={value} 
         onChange={(e) => onChange(parseInt(e.target.value))}
         className="w-full h-1 bg-zinc-900 rounded-none appearance-none cursor-pointer accent-indigo-500"
       />
       <div className="flex justify-between mt-2">
          <span className="text-[8px] font-mono text-zinc-800">{min}{suffix}</span>
          <span className="text-[8px] font-mono text-zinc-800">{max}{suffix}</span>
       </div>
    </div>
  </div>
);

const NeoInput = ({ label, value, type, onChange, desc }: any) => (
  <div className="space-y-4 group">
    <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 group-focus-within:text-indigo-500 transition-colors">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-950 border border-zinc-900 p-5 text-sm font-mono font-bold text-white outline-none focus:border-indigo-500 transition-all"
    />
    <p className="text-[10px] text-zinc-700 italic font-light">{desc}</p>
  </div>
);

const NeoToggle = ({ title, desc, active, onChange }: any) => (
  <div className={`p-8 border transition-all flex items-center justify-between gap-8 group ${active ? 'bg-zinc-950 border-zinc-800' : 'bg-transparent border-zinc-900/50 hover:border-zinc-800'}`}>
    <div className="space-y-1">
       <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-zinc-500'}`}>{title}</p>
       <p className="text-[10px] text-zinc-700 italic font-light leading-relaxed max-w-md">{desc}</p>
    </div>
    <button 
      onClick={() => onChange(!active)}
      className={`w-12 h-6 rounded-full relative transition-all duration-500 ${active ? 'bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-zinc-800'}`}
    >
       <div className={`absolute top-1.5 w-3 h-3 bg-white transition-all duration-500 ${active ? 'left-7' : 'left-1.5'}`} />
    </button>
  </div>
);

const RegionBtn = ({ active, onClick, label, sub }: any) => (
   <button 
     onClick={onClick}
     className={`p-5 border transition-all text-left space-y-1 ${active ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:text-zinc-400 hover:border-zinc-800'}`}
   >
      <p className="text-[10px] font-mono font-black uppercase tracking-tighter">{label}</p>
      <p className="text-[8px] font-mono uppercase tracking-widest opacity-60">{sub}</p>
   </button>
)

export default SettingsPage;