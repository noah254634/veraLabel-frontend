import React from 'react';
import { Zap } from 'lucide-react';

interface RLHFStageProps {
  task: any;
  selection: string | null;
  onSelect: (id: string) => void;
}

export const RLHFStage = ({ task, selection, onSelect }: RLHFStageProps) => {
  // In dev mode, we use taskName as the prompt.
  // Real data would fetch the two completions from task.r2_input_taskRef
  const responseA = "Response_Alpha: Standard concise output for " + task?.taskName;
  const responseB = "Response_Beta: Detailed and analytical breakdown of " + task?.taskName;

  return (
    <div className="max-w-5xl w-full flex flex-col gap-6 animate-in fade-in duration-700">
      {/* THE PROMPT BOX */}
      <div className="bg-[#050505] border border-indigo-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <span className="text-[9px] font-mono text-indigo-500 font-bold uppercase tracking-[0.2em] mb-2 block">
          Input_Prompt // Primary_Directive
        </span>
        <h2 className="text-lg font-medium text-white italic">"{task?.taskName}"</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* COMPONENT ALPHA */}
        <div 
          onClick={() => onSelect('A')}
          className={`group border ${selection === 'A' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-900 bg-black'} p-8 transition-all cursor-pointer hover:border-zinc-700`}
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-tighter">Output_Alpha</span>
            {selection === 'A' && <Zap size={14} className="text-emerald-500 fill-emerald-500" />}
          </div>
          <p className="text-sm leading-relaxed text-zinc-300 font-light italic opacity-80">{responseA}</p>
        </div>

        {/* COMPONENT BETA */}
        <div 
          onClick={() => onSelect('B')}
          className={`group border ${selection === 'B' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-900 bg-black'} p-8 transition-all cursor-pointer hover:border-zinc-700`}
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-tighter">Output_Beta</span>
            {selection === 'B' && <Zap size={14} className="text-emerald-500 fill-emerald-500" />}
          </div>
          <p className="text-sm leading-relaxed text-zinc-300 font-light italic opacity-80">{responseB}</p>
        </div>
      </div>
    </div>
  );
};