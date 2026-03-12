import React from 'react';
import { 
  Cpu, Activity, Zap, Layers, Play, Trash2, Box, Terminal, 
  ExternalLink, Server, ShieldCheck, Database, Sliders
} from 'lucide-react';

const ModelsPage = () => {
  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* Header: Compute Telemetry */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Model_Registry_v.4.2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
            Neural Engines
          </h1>
          <p className="text-zinc-500 font-light text-sm mt-4">
            Orchestrating pre-labeling automation and cross-node consensus models.
          </p>
        </div>
        
        {/* Compute Status Node */}
        <div className="flex gap-px bg-zinc-900 border border-zinc-900 shadow-2xl overflow-hidden">
          <div className="bg-[#0A0A0A] flex items-center gap-3 px-6 py-3">
            <Server size={14} className="text-indigo-500" />
            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">GPU_Cluster: <span className="text-white">88%</span></span>
          </div>
          <div className="bg-[#0A0A0A] flex items-center gap-3 px-6 py-3 border-l border-zinc-900">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Latency: <span className="text-white">120ms</span></span>
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-16 shadow-2xl">
        <ModelStat icon={<Zap size={18} />} label="Inferences_Generated" value="4.2M" color="text-amber-500" />
        <ModelStat icon={<ShieldCheck size={18} />} label="Avg_Model_Confidence" value="89.4%" color="text-emerald-500" />
        <ModelStat icon={<Layers size={18} />} label="Active_Deployments" value="12" color="text-indigo-500" />
      </div>

      {/* Models Catalog: High-Density List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-600">// Deployed_Engines</h3>
            <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all">
                <Sliders size={14} /> Tune_Parameters
            </button>
        </div>
        
        <div className="grid grid-cols-1 gap-px bg-zinc-900 border border-zinc-900">
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

      {/* Performance Sandbox: Obsidian CTA */}
      <div className="mt-20 bg-[#050505] border border-zinc-900 p-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
          <Database size={240} strokeWidth={1} className="text-indigo-500" />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white tracking-tighter italic mb-4">Inference Sandbox</h2>
            <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8">
              Validate prospective model versions against <span className="text-zinc-300 font-mono italic">"Gold_Standard"</span> verified datasets before deploying to production node helping-workers.
            </p>
            <button className="flex items-center gap-3 bg-white text-black px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-xl shadow-indigo-500/10 active:scale-95">
              Initialize_Sandbox <ExternalLink size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <MetricBox label="Cost_Per_Inv" value="$0.004" />
             <MetricBox label="Sync_Traffic" value="+12%" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TECHNICAL HELPERS ---

const ModelListItem = ({ name, type, version, usage, status, accuracy, isBeta }: any) => (
  <div className="bg-[#050505] p-6 flex flex-col md:flex-row items-center justify-between hover:bg-[#080808] transition-all group relative overflow-hidden">
    <div className="flex items-center gap-6 w-full">
      <div className="h-12 w-12 bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-indigo-500 group-hover:border-indigo-500/30 transition-all">
        <Box size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">{name}</h4>
          {isBeta && <span className="px-2 py-0.5 border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[8px] font-mono font-bold uppercase tracking-widest">BETA_SYNC</span>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
          <span>{type}</span>
          <div className="h-1 w-1 bg-zinc-800 rounded-full" />
          <span>v.{version}</span>
          <div className="h-1 w-1 bg-zinc-800 rounded-full" />
          <span className="text-indigo-500/80 italic">{usage}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between md:justify-end gap-10 mt-6 md:mt-0 w-full md:w-auto border-t md:border-none border-zinc-900 pt-4 md:pt-0">
      <div className="text-right">
        <div className="text-lg font-bold text-white tabular-nums">{accuracy}</div>
        <div className="text-[8px] font-mono text-zinc-700 uppercase font-bold tracking-widest">Inference_Acc</div>
      </div>
      <StatusBadge status={status} />
      <div className="flex gap-1">
        <button className="p-2 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"><Play size={14} /></button>
        <button className="p-2 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-rose-500 hover:border-rose-500/30 transition-all"><Trash2 size={14} /></button>
      </div>
    </div>
  </div>
);

const ModelStat = ({ icon, label, value, color }: any) => (
  <div className="bg-[#050505] p-8 flex items-center gap-6 group hover:bg-black transition-colors">
    <div className={`p-3 bg-zinc-950 border border-zinc-900 transition-colors group-hover:border-zinc-700 ${color}`}>{icon}</div>
    <div>
      <p className="text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-[0.2em] mb-1">// {label}</p>
      <p className="text-3xl font-bold text-white tracking-tighter tabular-nums leading-none">{value}</p>
    </div>
  </div>
);

const MetricBox = ({ label, value }: any) => (
  <div className="h-28 w-32 bg-black border border-zinc-900 flex flex-col items-center justify-center p-4 text-center">
    <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-2">{label}</span>
    <span className="text-xl font-bold text-white tabular-nums tracking-tighter">{value}</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    Operational: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
    Standby: "text-zinc-500 bg-zinc-900 border-zinc-800",
    Maintenance: "text-rose-500 bg-rose-500/5 border-rose-500/20",
  };
  return (
    <div className={`px-4 py-1 border text-[9px] font-mono font-bold uppercase tracking-widest whitespace-nowrap ${colors[status] || colors.Standby}`}>
      {status}
    </div>
  );
};

export default ModelsPage;