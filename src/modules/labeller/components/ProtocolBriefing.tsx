import React, { useState } from 'react';
import {
  ShieldCheck, ChevronRight, X, CheckCircle2, AlertTriangle,
  BookOpen, Star, Zap, List
} from 'lucide-react';

interface Rubric {
  tag: string;
  type: 'reward' | 'penalty' | 'neutral';
  description: string;
  weight?: number;
  positiveExample?: string;
  negativeExample?: string;
}

interface GoldenExample {
  promptContext: string;
  responseA?: string;
  responseB?: string;
  correctPreference?: 'A' | 'B' | 'Tie';
  explanation: string;
}

interface EdgeCase {
  trigger: string;
  guidance: string;
  type: 'Warning' | 'Hard Block';
}

interface Protocol {
  templateId?: {
    name?: string;
    version?: string;
  };
  finalDirectives?: string[];
  antiPatterns?: string[];
  rubrics?: Rubric[];
  goldenExamples?: GoldenExample[];
  edgeCases?: EdgeCase[];
}

interface ProtocolBriefingProps {
  protocol: Protocol;
  onAccept: () => void;
}

type Tab = 'directives' | 'anti_patterns' | 'rubrics' | 'examples' | 'edge_cases';

export const ProtocolBriefing: React.FC<ProtocolBriefingProps> = ({ protocol, onAccept }) => {
  const [activeTab, setActiveTab] = useState<Tab>('directives');
  const [confirmed, setConfirmed] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'directives', label: 'Directives', icon: <List size={12} /> },
    { id: 'anti_patterns', label: 'Anti-Patterns', icon: <X size={12} className="text-red-500" />, count: protocol.antiPatterns?.length },
    { id: 'rubrics', label: 'Rubrics', icon: <Zap size={12} />, count: protocol.rubrics?.length },
    { id: 'examples', label: 'Golden Examples', icon: <Star size={12} />, count: protocol.goldenExamples?.length },
    { id: 'edge_cases', label: 'Edge Cases', icon: <AlertTriangle size={12} />, count: protocol.edgeCases?.length },
  ].filter(t => {
    if (t.id === 'directives') return (protocol.finalDirectives?.length ?? 0) > 0;
    if (t.id === 'anti_patterns') return (protocol.antiPatterns?.length ?? 0) > 0;
    if (t.id === 'rubrics') return (protocol.rubrics?.length ?? 0) > 0;
    if (t.id === 'examples') return (protocol.goldenExamples?.length ?? 0) > 0;
    if (t.id === 'edge_cases') return (protocol.edgeCases?.length ?? 0) > 0;
    return false;
  });

  const templateName = protocol.templateId?.name || 'Labeling Protocol';
  const version = protocol.templateId?.version || '1.0.0';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl font-mono">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#050505] border border-zinc-800 shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative border-b border-zinc-800 px-8 py-6 flex items-start justify-between bg-black">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Protocol_Briefing_Required</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{templateName}</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">v{version} • Read carefully before starting</p>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-2 rounded-sm">
            <AlertTriangle size={12} /> Read Before Proceeding
          </div>
        </div>
        {tabs.length > 0 && (
          <div className="flex border-b border-zinc-900 bg-black shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-white bg-indigo-950/20'
                    : 'border-transparent text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5 text-[8px]">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === 'directives' && (
            <div className="space-y-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
                Follow these steps precisely for every annotation task.
              </p>
              {protocol.finalDirectives?.map((d, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-indigo-500 font-bold text-sm tabular-nums w-8 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{d}</p>
                </div>
              ))}
              {!protocol.finalDirectives?.length && (
                <p className="text-zinc-600 text-xs italic">No specific directives defined for this protocol.</p>
              )}
            </div>
          )}
          {activeTab === 'anti_patterns' && (
            <div className="space-y-4">
              <p className="text-[10px] text-red-500 uppercase tracking-widest mb-6">
                CRITICAL: NEVER perform these actions when annotating this dataset.
              </p>
              {protocol.antiPatterns?.map((ap, i) => (
                <div key={i} className="flex gap-4 items-start bg-red-950/10 border border-red-900/20 p-4 rounded-sm animate-in fade-in duration-355">
                  <span className="text-red-500 font-bold text-[14px] shrink-0 mt-0.5">
                    ❌
                  </span>
                  <p className="text-sm text-zinc-305 leading-relaxed">{ap}</p>
                </div>
              ))}
              {!protocol.antiPatterns?.length && (
                <p className="text-zinc-600 text-xs italic">No specific anti-patterns defined for this protocol.</p>
              )}
            </div>
          )}
          {activeTab === 'rubrics' && (
            <div className="space-y-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
                These criteria define how you should evaluate each response.
              </p>
              {protocol.rubrics?.map((r, i) => (
                <div key={i} className={`border-l-4 p-5 bg-black border-y border-r border-zinc-900 ${
                  r.type === 'reward' ? 'border-l-emerald-500' : r.type === 'penalty' ? 'border-l-red-500' : 'border-l-zinc-500'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                      r.type === 'reward'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : r.type === 'penalty'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}>
                      {r.type === 'reward' ? '🟢 Reward' : r.type === 'penalty' ? '🔴 Penalty' : '⚪ Neutral'}
                    </span>
                    <span className="text-white font-bold text-sm">{r.tag}</span>
                    {r.weight && r.weight !== 1 && (
                      <span className="text-[9px] text-zinc-500 font-mono ml-auto">×{r.weight} weight</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{r.description}</p>
                  {(r.positiveExample || r.negativeExample) && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {r.positiveExample && (
                        <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-sm">
                          <p className="text-[9px] text-emerald-500 font-bold uppercase mb-1">Good Example</p>
                          <p className="text-[10px] text-emerald-200">{r.positiveExample}</p>
                        </div>
                      )}
                      {r.negativeExample && (
                        <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-sm">
                          <p className="text-[9px] text-red-500 font-bold uppercase mb-1">Bad Example</p>
                          <p className="text-[10px] text-red-200">{r.negativeExample}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {activeTab === 'examples' && (
            <div className="space-y-8">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
                Study these calibration examples carefully. They define the standard of quality expected.
              </p>
              {protocol.goldenExamples?.map((ex, i) => (
                <div key={i} className="bg-black border border-zinc-800 overflow-hidden">
                  <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-800">
                    <p className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">Example {i + 1} / Prompt Context</p>
                    <p className="text-sm text-white mt-1 font-medium">{ex.promptContext}</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Response A</p>
                        <div className={`p-4 text-xs text-zinc-300 leading-relaxed border rounded-sm ${
                          ex.correctPreference === 'A' ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950'
                        }`}>
                          {ex.responseA || '—'}
                          {ex.correctPreference === 'A' && (
                            <span className="block mt-2 text-emerald-400 text-[9px] font-bold">✓ PREFERRED</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Response B</p>
                        <div className={`p-4 text-xs text-zinc-300 leading-relaxed border rounded-sm ${
                          ex.correctPreference === 'B' ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950'
                        }`}>
                          {ex.responseB || '—'}
                          {ex.correctPreference === 'B' && (
                            <span className="block mt-2 text-emerald-400 text-[9px] font-bold">✓ PREFERRED</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-sm">
                      <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Explanation</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">{ex.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'edge_cases' && (
            <div className="space-y-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
                These are common situations where labellers make mistakes. Follow the guidance precisely.
              </p>
              {protocol.edgeCases?.map((ec, i) => (
                <div key={i} className={`p-5 border rounded-sm ${
                  ec.type === 'Hard Block'
                    ? 'bg-red-950/20 border-red-500/30'
                    : 'bg-amber-950/10 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className={ec.type === 'Hard Block' ? 'text-red-500' : 'text-amber-500'} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${ec.type === 'Hard Block' ? 'text-red-400' : 'text-amber-400'}`}>
                      {ec.type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mb-2">When: {ec.trigger}</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">→ {ec.guidance}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-zinc-800 bg-black px-8 py-6 flex items-center justify-between shrink-0">
          <label className="flex items-center gap-3 text-xs text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            I have read and understood the protocol requirements.
          </label>
          <button
            onClick={onAccept}
            disabled={!confirmed}
            className={`flex items-center gap-3 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
              confirmed
                ? 'bg-white text-black hover:bg-indigo-50 shadow-xl shadow-indigo-500/10'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={14} /> Begin_Annotation
          </button>
        </div>
      </div>
    </div>
  );
};
