import React, { useMemo, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, List, X, Zap, Star, BookOpen } from 'lucide-react';



interface Rubric {
  tag: string;
  type: 'reward' | 'penalty' | 'neutral';
  description: string;
  weight?: number;
  severity?: string;
  positiveExample?: string;
  negativeExample?: string;
  required?: boolean;
  conditional?: boolean;
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

// Mirrors the full backend DatasetInstruction / InstructionTemplate shape
interface Protocol {
  templateId?: { name?: string; version?: string } | string;
  name?: string;
  version?: string;
  finalDirectives?: string[];
  baseDirectives?: string[];   // template fallback uses baseDirectives
  antiPatterns?: string[];
  rubrics?: Rubric[];
  goldenExamples?: GoldenExample[];
  edgeCases?: EdgeCase[];
  buyerVisibleSummary?: string;
}

interface ProtocolBriefingProps {
  protocol: Protocol;
  onAccept: () => void;
}



const SECTION_REGISTRY: {
  key: keyof Protocol;
  label: string;
  icon: React.ReactNode;
  render: (items: any[]) => React.ReactNode;
}[] = [
  {
    key: 'finalDirectives',
    label: 'Directives',
    icon: <List size={12} />,
    render: (items: string[]) => (
      <div className="space-y-0">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-5">
          Follow these steps precisely for every annotation task.
        </p>
        {items.map((text, i) => (
          <div key={i} className="flex gap-3 items-start py-3 border-b border-zinc-900/60 last:border-0">
            <span className="text-indigo-400 font-bold text-sm tabular-nums shrink-0 mt-0.5 select-none w-7">
              {i + 1}.
            </span>
            <p className="text-sm text-zinc-300 leading-relaxed flex-1">{text.trim()}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'antiPatterns',
    label: 'Anti-Patterns',
    icon: <X size={12} className="text-red-400" />,
    render: (items: string[]) => (
      <div className="space-y-3">
        <p className="text-[10px] text-red-500 uppercase tracking-widest mb-5">
          CRITICAL — Never perform these actions when annotating.
        </p>
        {items.map((text, i) => (
          <div key={i} className="flex gap-3 items-start bg-red-950/10 border border-red-900/20 p-4">
            <span className="text-red-400 font-bold text-sm tabular-nums shrink-0 mt-0.5 select-none w-7">
              {i + 1}.
            </span>
            <p className="text-sm text-zinc-300 leading-relaxed flex-1">{text.trim()}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'rubrics',
    label: 'Rubrics',
    icon: <Zap size={12} />,
    render: (items: Rubric[]) => (
      <div className="space-y-4">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-5">
          These criteria define how each annotation is evaluated.
        </p>
        {items.map((r, i) => (
          <div
            key={i}
            className={`border-l-4 p-5 bg-black border-y border-r border-zinc-900 ${
              r.type === 'reward' ? 'border-l-emerald-500'
              : r.type === 'penalty' ? 'border-l-red-500'
              : 'border-l-zinc-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-zinc-600 font-bold text-xs tabular-nums select-none">{i + 1}.</span>
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
              {r.severity && (
                <span className="text-[9px] text-zinc-500 font-mono border border-zinc-800 px-2 py-0.5 rounded-sm">
                  {r.severity}
                </span>
              )}
              {r.weight != null && r.weight !== 1 && (
                <span className="text-[9px] text-zinc-500 font-mono ml-auto">×{r.weight} weight</span>
              )}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">{r.description?.trim()}</p>
            {(r.positiveExample || r.negativeExample) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {r.positiveExample && (
                  <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-sm">
                    <p className="text-[9px] text-emerald-500 font-bold uppercase mb-1">✓ Good Example</p>
                    <p className="text-[10px] text-emerald-200 leading-relaxed">{r.positiveExample.trim()}</p>
                  </div>
                )}
                {r.negativeExample && (
                  <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-sm">
                    <p className="text-[9px] text-red-500 font-bold uppercase mb-1">✗ Bad Example</p>
                    <p className="text-[10px] text-red-200 leading-relaxed">{r.negativeExample.trim()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'goldenExamples',
    label: 'Golden Examples',
    icon: <Star size={12} />,
    render: (items: GoldenExample[]) => (
      <div className="space-y-8">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-5">
          Study these calibration examples carefully — they define the quality standard expected.
        </p>
        {items.map((ex, i) => (
          <div key={i} className="bg-black border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-800">
              <p className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">
                Example {i + 1} — Prompt Context
              </p>
              <p className="text-sm text-white mt-1 font-medium">{ex.promptContext}</p>
            </div>
            <div className="p-5 space-y-4">
              {(ex.responseA || ex.responseB) && (
                <div className="grid grid-cols-2 gap-4">
                  {ex.responseA !== undefined && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Response A</p>
                      <div className={`p-4 text-xs text-zinc-300 leading-relaxed border rounded-sm ${ex.correctPreference === 'A' ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950'}`}>
                        {ex.responseA || '—'}
                        {ex.correctPreference === 'A' && <span className="block mt-2 text-emerald-400 text-[9px] font-bold">✓ PREFERRED</span>}
                      </div>
                    </div>
                  )}
                  {ex.responseB !== undefined && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Response B</p>
                      <div className={`p-4 text-xs text-zinc-300 leading-relaxed border rounded-sm ${ex.correctPreference === 'B' ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950'}`}>
                        {ex.responseB || '—'}
                        {ex.correctPreference === 'B' && <span className="block mt-2 text-emerald-400 text-[9px] font-bold">✓ PREFERRED</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-sm">
                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Explanation</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{ex.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'edgeCases',
    label: 'Edge Cases',
    icon: <AlertTriangle size={12} />,
    render: (items: EdgeCase[]) => (
      <div className="space-y-4">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-5">
          Common situations where mistakes happen — follow the guidance precisely.
        </p>
        {items.map((ec, i) => (
          <div
            key={i}
            className={`p-5 border rounded-sm ${
              ec.type === 'Hard Block'
                ? 'bg-red-950/20 border-red-500/30'
                : 'bg-amber-950/10 border-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-zinc-600 font-bold text-xs tabular-nums select-none">{i + 1}.</span>
              <AlertTriangle size={14} className={ec.type === 'Hard Block' ? 'text-red-500' : 'text-amber-500'} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${ec.type === 'Hard Block' ? 'text-red-400' : 'text-amber-400'}`}>
                {ec.type}
              </span>
            </div>
            <p className="text-sm font-bold text-white mb-2">When: {ec.trigger?.trim()}</p>
            <p className="text-xs text-zinc-300 leading-relaxed">→ {ec.guidance?.trim()}</p>
          </div>
        ))}
      </div>
    ),
  },
];



export const ProtocolBriefing: React.FC<ProtocolBriefingProps> = ({ protocol, onAccept }) => {
  const [confirmed, setConfirmed] = useState(false);

  // Resolve name/version: backend sends either templateId.name or name directly
  const templateName =
    (typeof protocol.templateId === 'object' ? protocol.templateId?.name : undefined) ||
    protocol.name ||
    'Labeling Protocol';

  const version =
    (typeof protocol.templateId === 'object' ? protocol.templateId?.version : undefined) ||
    protocol.version ||
    '1.0.0';

  // Normalize: DatasetInstruction uses finalDirectives, template fallback uses baseDirectives
  const normalized = {
    ...protocol,
    finalDirectives: (protocol.finalDirectives?.length ? protocol.finalDirectives : protocol.baseDirectives) ?? [],
  };

  // Dynamically build tabs from SECTION_REGISTRY — only include sections with data
  const tabs = useMemo(() =>
    SECTION_REGISTRY
      .map((section, idx) => {
        const items = (normalized as any)[section.key];
        if (!Array.isArray(items) || items.length === 0) return null;
        return { ...section, items, count: items.length, tabIndex: idx };
      })
      .filter(Boolean) as {
        key: string;
        label: string;
        icon: React.ReactNode;
        items: any[];
        count: number;
        render: (items: any[]) => React.ReactNode;
      }[],
  [protocol]); // eslint-disable-line react-hooks/exhaustive_deps

  const [activeKey, setActiveKey] = useState<string>(() => tabs[0]?.key ?? '');

  // Keep activeKey valid if protocol changes
  const currentTab = tabs.find(t => t.key === activeKey) ?? tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl font-mono">
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#050505] border border-zinc-800 shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in zoom-in-95 duration-300"
        style={{ minHeight: 0 }}
      >


        <div className="relative border-b border-zinc-800 px-8 py-6 flex items-start justify-between bg-black shrink-0">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent" />
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Protocol_Briefing_Required</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">{templateName}</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">v{version} · Read carefully before starting</p>
            {protocol.buyerVisibleSummary && (
              <p className="text-xs text-zinc-400 leading-relaxed mt-2 max-w-xl">{protocol.buyerVisibleSummary}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-2 rounded-sm shrink-0">
            <AlertTriangle size={12} /> Read Before Proceeding
          </div>
        </div>


        <div className="flex border-b border-zinc-900 bg-black shrink-0 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={`flex items-center gap-1.5 px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                currentTab?.key === tab.key
                  ? 'border-indigo-500 text-white bg-indigo-950/20'
                  : 'border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <span className="tabular-nums text-zinc-500 font-normal">{idx + 1}.</span>
              {tab.icon}
              {tab.label}
              <span className="text-zinc-600 text-[8px] tabular-nums font-normal">({tab.count})</span>
            </button>
          ))}
        </div>


        <div className="flex-1 overflow-y-auto min-h-0 p-8 pb-10">
          {currentTab ? currentTab.render(currentTab.items) : null}
        </div>


        <div className="border-t border-zinc-800 bg-black px-8 py-6 flex items-center justify-between shrink-0">
          <label className="flex items-center gap-3 text-xs text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
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
