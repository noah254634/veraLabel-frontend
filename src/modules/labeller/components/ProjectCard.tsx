import React from 'react';
import { PrimaryButton } from "./PrimaryButton";
import { Terminal, Database, ChevronRight, Zap, Target } from "lucide-react";

interface ProjectProps {
  title: string;
  type: 'Image' | 'Audio' | 'Text' | string;
  reward: string;
  totalTasks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
}

export const ProjectCard: React.FC<ProjectProps> = ({ title, type, reward, totalTasks, difficulty }) => {
  const difficultyColors: any = {
    Easy: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
    Medium: "text-amber-500 border-amber-500/20 bg-amber-500/5",
    Hard: "text-rose-500 border-rose-500/20 bg-rose-500/5",
  };

  return (
    <div className="group relative bg-[#050505] border border-zinc-900 p-8 rounded-sm hover:bg-black transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* 1. TELEMETRY HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-[0.2em]">
            // {type.toUpperCase()}_ASSET_NODE
          </span>
          <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-tighter ${difficultyColors[difficulty] || difficultyColors.Medium}`}>
            <div className="h-1 w-1 rounded-full bg-current animate-pulse" />
            {difficulty}_Priority
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-emerald-500 tabular-nums tracking-tighter">{reward}</span>
          <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest mt-1">Per_Validation</p>
        </div>
      </div>

      {/* 2. PROJECT TITLE */}
      <h3 className="text-lg font-bold text-white tracking-tight italic group-hover:text-indigo-400 transition-colors mb-4 min-h-[56px]">
        {title}
      </h3>

      {/* 3. ASSET COUNTER */}
      <div className="bg-zinc-950 border border-zinc-900 p-4 mb-8 flex items-center justify-between group-hover:border-zinc-800 transition-colors">
        <div className="flex items-center gap-2 text-zinc-600">
           <Database size={12} />
           <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Unverified_Queue:</span>
        </div>
        <span className="text-xs font-bold text-zinc-400 tabular-nums">
          {totalTasks.toLocaleString()} <span className="text-[10px] font-light">Assets</span>
        </span>
      </div>

      {/* 4. ACTION INTERFACE */}
      <div className="mt-auto">
        <PrimaryButton 
          className="w-full !rounded-sm !py-3 !bg-transparent !border-zinc-800 !text-zinc-500 hover:!text-white hover:!border-zinc-600 !text-[10px] !font-bold uppercase tracking-[0.2em] transition-all group-hover:!bg-zinc-900" 
          variant="outline"
        >
          Initialize_Preview
          <ChevronRight size={14} className="ml-2 inline-block opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
        </PrimaryButton>
      </div>

      {/* Subtle bottom scanline accent */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-zinc-900 group-hover:bg-indigo-500/50 transition-colors" />
    </div>
  );
};