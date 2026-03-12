import React from 'react';
import { 
  MoreHorizontal, BarChart3, Clock, Terminal, 
  Activity, Filter, Plus, Search, ArrowUpRight,
  Database, ShieldCheck, AlertCircle
} from 'lucide-react';

const AdminProjectsPage = () => {
  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* Header: Infrastructure Provisioning */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Pipeline_Registry_v.01</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
            Project Registry
          </h1>
          <p className="text-zinc-500 font-light text-sm mt-4">
            Monitoring <span className="text-indigo-400 font-mono font-bold">24</span> active production pipelines across global nodes.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-2xl shadow-indigo-500/20 active:scale-95">
          <Plus size={16} /> Provision_New_Project
        </button>
      </header>

      {/* Global Health Aggregator: High-Density Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-12 shadow-2xl">
        <HealthMetric label="Sync_Stable" count={18} color="bg-emerald-500" />
        <HealthMetric label="Node_At_Risk" count={4} color="bg-amber-500" />
        <HealthMetric label="System_Critical" count={2} color="bg-rose-500" />
      </div>

      {/* Control Bar: Darkened Search & Filter */}
      <div className="flex items-center justify-between bg-[#050505] p-2 border border-zinc-900 mb-10">
        <div className="flex items-center gap-3 px-3 flex-1">
          <Search size={16} className="text-zinc-700" />
          <input 
            type="text" 
            placeholder="Query projects by buyer, tag, or UUID..." 
            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-800 w-full font-mono"
          />
        </div>
        <div className="flex gap-px bg-zinc-900 border border-zinc-900">
          <button className="p-3 bg-black hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-white"><Filter size={16} /></button>
          <button className="p-3 bg-black hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-white"><BarChart3 size={16} /></button>
        </div>
      </div>

      {/* Projects Grid: 1px Hairline Borders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
        <ProjectCard 
          name="Autonomous Navigation v4" 
          buyer="Tesla Autopilot Team"
          progress={78}
          accuracy={94.2}
          annotators={124}
          status="Active"
        />
        <ProjectCard 
          name="Medical MRI Segmentation" 
          buyer="Mayo Clinic Research"
          progress={32}
          accuracy={98.9}
          annotators={12}
          status="At Risk"
        />
        <ProjectCard 
          name="E-commerce Sentiment Analysis" 
          buyer="Amazon Retail"
          progress={100}
          accuracy={91.5}
          annotators={45}
          status="Completed"
        />
        <ProjectCard 
          name="Multi-Modal LiDAR Mapping" 
          buyer="Waymo Engineering"
          progress={55}
          accuracy={88.2}
          annotators={89}
          status="Active"
        />
      </div>
    </div>
  );
};

// --- TECHNICAL SUBCOMPONENTS ---

const ProjectCard = ({ name, buyer, progress, accuracy, annotators, status }: any) => (
  <div className="bg-[#050505] p-8 transition-all hover:bg-[#080808] group relative">
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className={`h-1.5 w-1.5 rounded-full ${status === 'At Risk' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
          <h3 className="font-bold text-white text-xl tracking-tight italic group-hover:text-indigo-400 transition-colors">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest font-bold">Client_Node:</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{buyer}</span>
        </div>
      </div>
      <button className="p-2 text-zinc-800 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
    </div>

    {/* Metrics Grid: Technical Table look */}
    <div className="grid grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-8 overflow-hidden">
        <MetricTile label="Completion" value={`${progress}%`} />
        <MetricTile label="Accuracy" value={`${accuracy}%`} warning={accuracy < 90} />
        <MetricTile label="Nodes_Active" value={annotators} />
    </div>

    {/* Velocity Bar: Razor Sharp */}
    <div className="space-y-3">
        <div className="flex justify-between text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-600">
            <span>// Project_Velocity</span>
            <span className="text-zinc-400 tabular-nums">{progress}/100%</span>
        </div>
        <div className="w-full h-1 bg-zinc-950 rounded-none overflow-hidden">
            <div 
                className={`h-full transition-all duration-1000 ${status === 'At Risk' ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                style={{ width: `${progress}%` }} 
            />
        </div>
    </div>

    <div className="mt-10 pt-6 border-t border-zinc-900 flex items-center justify-between">
        <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-8 w-8 rounded-sm border-2 border-[#050505] bg-zinc-900 flex items-center justify-center text-[8px] font-mono text-zinc-600">U_{i}</div>
            ))}
            <div className="h-8 w-8 rounded-sm border-2 border-[#050505] bg-indigo-500/10 text-indigo-500 text-[10px] flex items-center justify-center font-bold font-mono">+{annotators - 3}</div>
        </div>
        <button className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] group/btn">
            Audit_Pipeline <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </button>
    </div>
  </div>
);

const MetricTile = ({ label, value, warning }: any) => (
  <div className="bg-[#050505] p-4 group-hover:bg-black transition-colors">
      <p className="text-[8px] font-mono font-bold text-zinc-700 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-bold tabular-nums tracking-tighter ${warning ? 'text-rose-500' : 'text-zinc-200'}`}>{value}</p>
  </div>
);

const HealthMetric = ({ label, count, color }: any) => (
  <div className="bg-[#050505] p-6 flex items-center gap-6 group hover:bg-[#080808] transition-colors">
      <div className={`h-8 w-1 ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
      <div>
          <p className="text-3xl font-bold text-white leading-none tracking-tighter tabular-nums">{count}</p>
          <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em] mt-2">{label}</p>
      </div>
  </div>
);

export default AdminProjectsPage;