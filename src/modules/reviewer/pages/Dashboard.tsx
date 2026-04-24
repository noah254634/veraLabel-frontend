import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { 
  Mic2, Zap, Crosshair, Terminal, 
  Activity, ChevronRight, Cpu, Fingerprint 
} from 'lucide-react';
import { detectDeviceCapabilities } from '../../../shared/utils/deviceCapabilities';

const signalData = [
  { segment: 'Sheng', frequency: 85, variance: 12 },
  { segment: 'Swahili', frequency: 62, variance: 5 },
  { segment: 'Coastal', frequency: 30, variance: 18 },
  { segment: 'Slang', frequency: 95, variance: 22 },
];

const ReviewerDashboard = () => {
  React.useEffect(() => {
    // Auto-detect device capabilities on dashboard load
    detectDeviceCapabilities();
  }, []);
  return (
    <div className="w-full min-h-screen bg-[#020408] p-8 font-mono text-slate-500">
      
      {/* --- TOP HUD: TACTICAL STATUS (Cyan/Indigo Pivot) --- */}
      <header className="flex justify-between items-start mb-12">
        <div className="flex gap-8">
          <div className="relative h-16 w-16 bg-cyan-500/5 border border-cyan-500/20 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full border-t-cyan-500 animate-spin duration-[3s]" />
            <Mic2 className="text-cyan-500" size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Node_<span className="text-cyan-500">BUNGOMA_01</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" /> Live_Signal_Feed
              </span>
              <span className="text-slate-800">//</span>
              <span>Operator: Noah_K.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TopMetric label="Signal_Latency" value="12ms" />
          <TopMetric label="Neural_Load" value="0.42" />
        </div>
      </header>

      {/* --- CORE AUDIT METRICS --- */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        
        {/* Signal Variance Chart (Linguistic Nuance) */}
        <div className="col-span-8 bg-[#05070A] border border-slate-900 p-8 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <h3 className="text-white text-sm font-black uppercase tracking-widest">Linguistic_Variance_Map</h3>
              <p className="text-[9px] text-slate-600 italic">Tracking regional dialect deviation against standard models.</p>
            </div>
            <div className="flex gap-2">
               <div className="h-2 w-2 bg-cyan-500" />
               <div className="h-2 w-2 bg-slate-800" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signalData}>
                <XAxis dataKey="segment" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="stepAfter" 
                  dataKey="frequency" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  fill="url(#fadeCyan)" 
                />
                <defs>
                  <linearGradient id="fadeCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Efficiency Dial */}
        <div className="col-span-4 bg-[#05070A] border border-slate-900 p-8 flex flex-col">
           <div className="flex items-center gap-3 mb-8">
              <Zap className="text-cyan-500" size={18} />
              <h3 className="text-white text-sm font-black uppercase tracking-widest">Audit_Velocity</h3>
           </div>
           <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-6xl font-black text-white italic tracking-tighter mb-2">92%</div>
              <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">Quota_Efficiency</p>
              <div className="w-full h-1 bg-slate-900 mt-8 relative overflow-hidden">
                 <div className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" style={{ width: '92%' }} />
              </div>
           </div>
        </div>
      </div>

      {/* --- LOWER HUB: QUEUE & TELEMETRY --- */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Critical Overrides List */}
        <div className="col-span-2 bg-[#05070A] border border-slate-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Crosshair size={14} className="text-cyan-500" />
              <span className="text-xs text-white font-black uppercase italic">High_Ambiguity_Buffer</span>
            </div>
            <span className="text-[9px] text-slate-700 underline underline-offset-4 cursor-pointer hover:text-cyan-500">VIEW_ALL_SIGNALS</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <SignalRow id="SIG_992" tag="Nairobi_Sheng" conf="42%" />
             <SignalRow id="SIG_104" tag="Coastal_Dialect" conf="58%" />
             <SignalRow id="SIG_441" tag="Slang_Sentiment" conf="31%" />
             <SignalRow id="SIG_082" tag="Urban_Lingo" conf="49%" />
          </div>
        </div>

        {/* System Uptime Monitor */}
        <div className="bg-[#05070A] border border-slate-900 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <SystemInfo label="Neural_Engine" value="LLM_BATCH_V2" />
            <SystemInfo label="Data_Residency" value="R2_EAST_AFRICA" />
            <SystemInfo label="Enc_Protocol" value="AES_256_T" />
          </div>
          <button className="w-full py-4 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            Enter_Audit_Mode
          </button>
        </div>

      </div>
    </div>
  );
};

// --- COMPONENTS ---

const TopMetric = ({ label, value }) => (
  <div className="text-right px-4 border-r border-slate-900 last:border-0">
    <p className="text-[8px] font-black uppercase text-slate-700 tracking-widest">{label}</p>
    <p className="text-xl font-bold text-slate-300 italic">{value}</p>
  </div>
);

const SignalRow = ({ id, tag, conf }) => (
  <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-900 hover:border-cyan-500/30 transition-all cursor-pointer group">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-white">{id}</p>
      <p className="text-[8px] text-slate-600 uppercase tracking-tighter">{tag}</p>
    </div>
    <div className="text-right">
      <p className="text-[8px] text-slate-800 uppercase">AI_Conf</p>
      <p className="text-xs font-black text-cyan-500">{conf}</p>
    </div>
  </div>
);

const SystemInfo = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
    <span className="text-[9px] text-slate-700 font-bold uppercase">{label}</span>
    <span className="text-[10px] text-slate-300 font-mono italic">{value}</span>
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-cyan-500/50 p-2 text-[10px] font-mono shadow-2xl">
        <p className="text-cyan-500 uppercase">Freq: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default ReviewerDashboard;