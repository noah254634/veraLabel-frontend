import React from 'react';
import { Activity, Cpu, Fingerprint } from 'lucide-react';

export interface LinguisticTask {
  id: string;
  signal: string;
  taskType: 'LINGUISTIC';
  text: string;
  highlight: string;
  aiDiagnostic: {
    match: string;
    confidence: number;
    category?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  note: string;
  metadata?: {
    createdAt?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    estimatedTime?: number;
  };
}

const LinguisticTaskRenderer: React.FC<{ task: LinguisticTask }> = ({ task }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-zinc-600">
        <Fingerprint size={14} />
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em]">
          Signal_ID: <span className="text-rose-400">{task.signal}</span>
        </span>
      </div>

      <div className="p-12 bg-zinc-950/40 border border-zinc-900 rounded-sm relative group hover:border-zinc-800 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-5 transition-opacity">
          <Activity size={24} className="text-indigo-500" />
        </div>
        <h2 className="text-4xl font-light italic text-white/90 leading-tight">
          "{task.text.split(task.highlight).map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < task.text.split(task.highlight).length - 1 && (
                <span className="text-cyan-400 border-b-2 border-cyan-400 px-1 bg-cyan-500/10 font-normal">{task.highlight}</span>
              )}
            </React.Fragment>
          ))}"
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-8 border-t border-zinc-900 pt-12">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} className="text-indigo-500" /> AI_Diagnostic
          </p>
          <div className="p-6 bg-black border border-zinc-900 text-xs text-indigo-400/80 font-mono italic space-y-2 leading-relaxed">
            <div className="text-zinc-700">// Classification Report</div>
            <div>Match: <span className="text-indigo-300">{task.aiDiagnostic.match}</span></div>
            <div>Category: <span className="text-indigo-300">{task.aiDiagnostic.category || 'Unclassified'}</span></div>
            <div>Confidence: <span className="text-indigo-300">{(task.aiDiagnostic.confidence * 100).toFixed(0)}%</span></div>
            <div>Risk: <span className={task.aiDiagnostic.riskLevel === 'HIGH' ? 'text-rose-400' : task.aiDiagnostic.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}>
              {task.aiDiagnostic.riskLevel || 'UNKNOWN'}
            </span></div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Review_Context</p>
            <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700 pl-4">
              "{task.note}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinguisticTaskRenderer;
