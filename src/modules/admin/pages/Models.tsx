import React from 'react';
import { 
  Cpu, Activity, Zap, Layers, RefreshCw, 
  Play, Pause, Trash2, Box, Terminal, 
  ExternalLink, BarChart, Server, ShieldCheck
} from 'lucide-react';

const ModelsPage = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header with Compute Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Model Registry</h1>
          <p className="text-slate-500 font-medium">Manage pre-labeling engines and auto-consensus models.</p>
        </div>
        <div className="flex gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-slate-100">
            <Server size={16} className="text-indigo-500" />
            <span className="text-xs font-black text-slate-700 uppercase">GPU Cluster: 88%</span>
          </div>
          <div className="flex items-center gap-2 px-3">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-xs font-black text-slate-700 uppercase">Latency: 120ms</span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModelStat icon={<Zap />} label="Auto-Labels Generated" value="4.2M" color="text-amber-500" />
        <ModelStat icon={<ShieldCheck />} label="Avg. Model Confidence" value="89.4%" color="text-emerald-500" />
        <ModelStat icon={<Layers />} label="Active Model Versions" value="12" color="text-indigo-500" />
      </div>

      {/* Models Catalog */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Deployed Engines</h3>
        <div className="grid grid-cols-1 gap-4">
          <ModelListItem 
            name="Vera-Vision-OCR-v2" 
            type="Computer Vision" 
            version="2.4.1" 
            usage="45k calls/hr" 
            status="Operational"
            accuracy="94%"
          />
          <ModelListItem 
            name="Llama-3-Vera-Tuned" 
            type="NLP Sentiment" 
            version="1.0.0" 
            usage="12k calls/hr" 
            status="Standby"
            accuracy="91%"
          />
          <ModelListItem 
            name="LiDAR-Segment-NextGen" 
            type="3D Point Cloud" 
            version="0.8.5-beta" 
            usage="2k calls/hr" 
            status="Maintenance"
            accuracy="87%"
            isBeta
          />
        </div>
      </div>

      {/* Model Sandbox / Playground CTA */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Terminal size={300} strokeWidth={1} />
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-bold">Model Performance Sandbox</h2>
          <p className="text-slate-400 max-w-md">Test new model versions against your "Gold Standard" datasets before deploying them to help annotators.</p>
          <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
            Open Sandbox <ExternalLink size={18} />
          </button>
        </div>
        <div className="relative z-10 flex gap-4">
           <div className="h-32 w-32 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xs font-black text-slate-500 uppercase mb-1">Cost/Inv</span>
              <span className="text-xl font-black text-indigo-400">$0.004</span>
           </div>
           <div className="h-32 w-32 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xs font-black text-slate-500 uppercase mb-1">Traffic</span>
              <span className="text-xl font-black text-emerald-400">+12%</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

const ModelListItem = ({ name, type, version, usage, status, accuracy, isBeta }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-all group">
    <div className="flex items-center gap-6">
      <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
        <Box size={28} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-slate-900 text-lg">{name}</h4>
          {isBeta && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase">Beta</span>}
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-tighter">
          <span>{type}</span>
          <span className="h-1 w-1 bg-slate-200 rounded-full" />
          <span>v{version}</span>
          <span className="h-1 w-1 bg-slate-200 rounded-full" />
          <span className="text-indigo-500">{usage}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-8">
      <div className="text-right">
        <div className="text-sm font-black text-slate-900">{accuracy}</div>
        <div className="text-[10px] text-slate-400 uppercase font-bold">Inference Acc.</div>
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
        status === 'Operational' ? 'bg-emerald-50 text-emerald-600' : 
        status === 'Standby' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'
      }`}>
        {status}
      </div>
      <div className="flex gap-2">
        <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Play size={18} /></button>
        <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
      </div>
    </div>
  </div>
);

const ModelStat = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm">
    <div className={`p-4 rounded-2xl bg-slate-50 ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 leading-none mt-1">{value}</p>
    </div>
  </div>
);

export default ModelsPage;