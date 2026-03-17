import React from 'react';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ name, buyer, progress, accuracy, nodes, status }) => {
  const isCritical = status === 'At Risk';

  return (
    <div className="bg-[#050505] p-8 hover:bg-[#080808] transition-all group relative border-b border-zinc-900 xl:border-none">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${isCritical ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <h3 className="font-bold text-white text-xl italic group-hover:text-indigo-400 transition-colors">{name}</h3>
          </div>
          <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
            Client_Node: <span className="text-zinc-300">{buyer}</span>
          </p>
        </div>
        <button className="text-zinc-700 hover:text-white"><MoreHorizontal size={20} /></button>
      </div>

      <div className="grid grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-8">
        <Metric label="Completion" value={`${progress}%`} />
        <Metric label="Accuracy" value={`${accuracy}%`} warning={accuracy < 90} />
        <Metric label="Nodes_Active" value={nodes} />
      </div>

      {/* Progress Velocity */}
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-mono text-zinc-600 font-bold uppercase">
          <span>// Velocity_Index</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="h-1 w-full bg-zinc-950">
          <div 
            className={`h-full transition-all duration-1000 ${isCritical ? 'bg-rose-600' : 'bg-indigo-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center">
        <div className="flex -space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-7 w-7 bg-zinc-900 border border-black flex items-center justify-center text-[8px] font-mono text-zinc-500">U_{i}</div>
          ))}
          <div className="h-7 w-7 bg-indigo-500/10 text-indigo-400 text-[10px] flex items-center justify-center font-bold">+ {nodes - 3}</div>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest group/btn">
          Audit_Pipeline <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Metric = ({ label, value, warning }) => (
  <div className="bg-[#050505] p-4">
    <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block mb-1">{label}</span>
    <span className={`text-lg font-bold tabular-nums ${warning ? 'text-rose-500' : 'text-white'}`}>{value}</span>
  </div>
);

export default ProjectCard;