import { useState } from 'react';
import { Zap, AlertTriangle, Edit3, Globe, Info } from 'lucide-react';
import type { ContentType } from '../../../../shared/utils/labellingProtocol';
import { RlhfResponseContent } from './RlhfResponseContent';

interface TaskData {
  id: string;
  type: 'comparison' | 'evaluation';
  prompt: string;
  responses: { id: string; content: string; label: string }[];
  context?: string; // e.g., "Nairobi Estate Context"
  response?: { id?: string; content?: string; label?: string }[];
  contentPreview?: string;
  taskName?: string;
  instruction?: string;
  result?: {
    responses?: { id?: string; content?: string; label?: string }[];
    response?: { id?: string; content?: string; label?: string }[];
    content?: string;
  } | null;
  data?: {
    responses?: { id?: string; content?: string; label?: string }[];
    response?: { id?: string; content?: string; label?: string }[];
    content?: string;
  } | null;
  r2_input_taskRef?: string;
}

// Scoring anchor tooltip — shown when hovering a dimension or its score buttons
const AnchorTooltip = ({ dim, anchors }: { dim: string; anchors?: { min?: string; max?: string } }) => {
  if (!anchors?.min && !anchors?.max) return null;
  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0a0a0f] border border-zinc-800 p-3 rounded-sm text-[9px] font-mono shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
      <div className="text-zinc-500 uppercase tracking-widest font-bold mb-2">{dim} — Scale Guide</div>
      {anchors.min && (
        <div className="flex gap-2 mb-1">
          <span className="text-rose-400 font-bold shrink-0">1 =</span>
          <span className="text-zinc-400 leading-relaxed">{anchors.min}</span>
        </div>
      )}
      {anchors.max && (
        <div className="flex gap-2">
          <span className="text-emerald-400 font-bold shrink-0">5 =</span>
          <span className="text-zinc-400 leading-relaxed">{anchors.max}</span>
        </div>
      )}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
    </div>
  );
};

export const UnifiedRLHFStage = ({ 
  task, 
  selection, 
  setSelection,
  protocol,
  selectedRubrics,
  setSelectedRubrics,
  ratings,
  setRatings,
  rationale,
  setRationale,
  tieJustification,
  setTieJustification,
  contentType = 'text',
}: { 
  task?: TaskData | null, 
  selection: string | null, 
  setSelection: (id: string) => void,
  contentType?: ContentType,
  protocol?: any,
  selectedRubrics: Record<string, boolean>,
  setSelectedRubrics: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  ratings: Record<string, number>,
  setRatings: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  rationale: string,
  setRationale: (val: string) => void,
  tieJustification: string,
  setTieJustification: (val: string) => void
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredRubric, setHoveredRubric] = useState<any>(null);
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);

  if (!task) {
    return (
      <div className="w-full min-h-full px-8 py-6 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center">
        No active RLHF task loaded
      </div>
    );
  }

  const derivedPrompt = task.prompt || task.taskName || task.instruction || 'No prompt available for this task.';
  const isComparison = task.type === 'comparison';

  // A/B labels — not 1/2. The alphabet avoids numeric ordering bias.
  const RESPONSE_LABELS = ['A', 'B', 'C', 'D', 'E'];

  const normalizeArray = (arr: any[]) => arr.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `resp-${index}`,
        content: item,
        label: `Response ${RESPONSE_LABELS[index] || index + 1}`,
      };
    }
    return {
      id: item?.id || `resp-${index}`,
      content: item?.content || item?.text || '',
      label: `Response ${RESPONSE_LABELS[index] || index + 1}`,
    };
  });

  const responseList = Array.isArray(task.responses)
    ? normalizeArray(task.responses)
    : Array.isArray(task.response)
      ? normalizeArray(task.response)
      : Array.isArray(task.result?.responses)
        ? normalizeArray(task.result.responses)
        : Array.isArray(task.result?.response)
          ? normalizeArray(task.result.response)
          : Array.isArray(task.data?.responses)
            ? normalizeArray(task.data.responses)
            : Array.isArray(task.data?.response)
              ? normalizeArray(task.data.response)
      : [];

  const normalizedResponses = responseList.length
    ? responseList
    : (() => {
        const fallbackContent =
          task.result?.content ||
          task.data?.content ||
          task.contentPreview ||
          '';

        if (!fallbackContent) return [];

        return [
          {
            id: 'fallback-1',
            content: fallbackContent,
            label: 'Response',
          },
        ];
      })();

  const rubricsList = protocol?.rubrics || [];
  const scoringConfig = protocol?.scoringConfig;
  const isPreferenceRequired = scoringConfig?.taskTypes?.includes('Preference Ranking (A vs B)');
  const tieRequiresJustification = scoringConfig?.tieRequiresJustification !== false; // default true

  // Parse scoringAnchors — Mongoose Map comes as plain object via JSON
  const scoringAnchors: Record<string, { min?: string; max?: string }> = (() => {
    const raw = scoringConfig?.scoringAnchors;
    if (!raw) return {};
    // Handle both Map-serialized format and plain object
    if (raw instanceof Map) return Object.fromEntries(raw);
    return raw;
  })();

  return (
    <div className="w-full min-h-full px-8 py-6 flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-sm">
        <Globe size={16} className="text-indigo-400" />
        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
          Linguistic_Target // {protocol?.languageRegion || task.context || "General_Swahili"}
        </span>
      </div>
      <div className="bg-[#050505] border-l-4 border-indigo-500 p-6">
        <span className="text-[9px] font-mono text-zinc-500 uppercase mb-2 block">Input_Prompt</span>
        <h2 className="text-xl font-medium text-white font-serif">"{derivedPrompt}"</h2>
      </div>
      <div className={`grid ${isComparison ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {normalizedResponses.length === 0 ? (
          <div className="border border-amber-700/40 bg-amber-900/10 p-6 text-amber-300 text-xs font-mono uppercase tracking-wider">
            Task payload has no inline model responses yet. Source ref: {task.r2_input_taskRef || 'unavailable'}
          </div>
        ) : normalizedResponses.map((resp) => (
          <div 
            key={resp.id}
            onClick={() => isPreferenceRequired && !isEditing && setSelection(resp.id)}
            className={`group relative border transition-all p-8 flex flex-col justify-between
              ${isPreferenceRequired ? 'cursor-pointer' : 'cursor-default'}
              ${selection === resp.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-black hover:border-zinc-600'}`}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`flex items-center gap-2 px-3 py-1 border text-[11px] font-mono font-bold uppercase tracking-widest
                  ${selection === resp.id 
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400' 
                    : 'border-zinc-800 text-zinc-500'}`}>
                  {resp.label}
                  {selection === resp.id && <Zap size={12} className="text-emerald-500 fill-emerald-500" />}
                </div>
                {selection === resp.id && (
                  <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest animate-pulse">
                    ✓ Selected
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <RlhfResponseContent
                  content={resp.content}
                  contentType={contentType}
                  label={resp.label}
                />
                {!isComparison && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-indigo-400 hover:text-indigo-300"
                  >
                    <Edit3 size={12} /> {isEditing ? "Save Gold Response" : "Correct this Response"}
                  </button>
                )}
              </div>
            </div>
            {scoringConfig?.taskTypes?.includes('Dimensional Scoring (1-5)') && scoringConfig?.scoreDimensions?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-900 space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  Dimensional_Scoring // Hover for scale guide
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {scoringConfig.scoreDimensions.map((dim: string) => {
                    const ratingKey = `${resp.id}_${dim}`;
                    const currentRating = ratings[ratingKey] || 0;
                    const anchor = scoringAnchors[dim];
                    const hasAnchor = anchor?.min || anchor?.max;

                    return (
                      <div key={dim} className="flex justify-between items-center bg-[#030304] border border-zinc-950 px-4 py-2 hover:border-zinc-800 transition-colors">
                        <div
                          className="relative group/dim flex items-center gap-1.5"
                          onMouseEnter={() => setHoveredDim(`${resp.id}_${dim}`)}
                          onMouseLeave={() => setHoveredDim(null)}
                        >
                          <span className="text-[9px] text-zinc-400 font-mono cursor-help">{dim}</span>
                          {hasAnchor && (
                            <Info size={9} className="text-zinc-700 group-hover/dim:text-indigo-500 transition-colors" />
                          )}
                          {hoveredDim === `${resp.id}_${dim}` && hasAnchor && (
                            <AnchorTooltip dim={dim} anchors={anchor} />
                          )}
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              title={score === 1 ? anchor?.min : score === 5 ? anchor?.max : undefined}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRatings(prev => ({
                                  ...prev,
                                  [ratingKey]: score
                                }));
                              }}
                              className={`w-6 h-6 rounded-sm text-[10px] font-mono font-bold transition-all active:scale-90
                                ${currentRating === score 
                                  ? score <= 2
                                    ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                                    : score === 3
                                    ? 'bg-amber-600 text-white shadow-[0_0_8px_rgba(217,119,6,0.4)]'
                                    : 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                  : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {isComparison && isPreferenceRequired && scoringConfig?.allowTie && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSelection('tie')}
            className={`w-full py-4 border font-mono text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 flex items-center justify-center gap-2
              ${selection === 'tie' 
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
          >
            <Zap size={14} className={selection === 'tie' ? "text-indigo-400 animate-pulse" : "text-zinc-600"} />
            Declare_Tie // Both_Responses_Equal
          </button>
          {selection === 'tie' && tieRequiresJustification && (
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-5 font-mono animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  Tie_Justification // Required
                </span>
                <span className={`text-[9px] ${tieJustification.trim().length >= 20 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {tieJustification.trim().length} / 20 min chars
                </span>
              </div>
              <p className="text-[9px] text-indigo-400/60 italic mb-3">
                Tie means genuinely equal quality — not uncertainty. Explain specifically why both responses are equally good.
              </p>
              <div className="border border-indigo-500/20 p-1 bg-black">
                <textarea
                  value={tieJustification}
                  onChange={(e) => setTieJustification(e.target.value)}
                  rows={3}
                  autoFocus
                  className="w-full bg-transparent p-3 text-white text-xs outline-none resize-none font-sans"
                  placeholder="e.g. Both responses use natural Sheng fluency and answer the question with equal accuracy..."
                />
              </div>
            </div>
          )}
        </div>
      )}
      {scoringConfig?.requireRationale && (
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm mt-2 font-mono">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Linguistic_Rationale // Rationale_Required
            </h3>
            <span className={`text-[9px] ${rationale.length >= (scoringConfig.minLength || 20) ? 'text-emerald-500' : 'text-amber-500'}`}>
              {rationale.length} / {scoringConfig.minLength || 20} Min Chars
            </span>
          </div>
          <div className="border border-zinc-900 p-1 bg-black">
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={3}
              className="w-full bg-transparent p-4 text-white text-xs outline-none resize-none font-sans"
              placeholder="Provide a detailed reasoning in Swahili/Sheng explaining why one response is linguistically or culturally superior..."
            />
          </div>
        </div>
      )}
      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm mt-2 font-mono relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Evaluation_Rubric // Directive_Validation
          </h3>
          <span className="text-[9px] text-zinc-600">
            {Object.values(selectedRubrics).filter(Boolean).length} / {rubricsList.length} Active
          </span>
        </div>
        
        {rubricsList.length === 0 ? (
          <p className="text-xs text-zinc-600 italic">No evaluation rubrics specified for this protocol.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {rubricsList.map((rubric: any) => {
              const isSelected = !!selectedRubrics[rubric.tag];
              const isReward = rubric.type === 'reward';
              const isPenalty = rubric.type === 'penalty';
              
              let styleClass = "";
              if (isSelected) {
                if (isReward) styleClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                else if (isPenalty) styleClass = "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
                else styleClass = "bg-zinc-800 border-zinc-500 text-zinc-200";
              } else {
                if (isReward) styleClass = "bg-black border-zinc-900 text-zinc-500 hover:border-emerald-500/40 hover:text-emerald-400/80";
                else if (isPenalty) styleClass = "bg-black border-zinc-900 text-zinc-500 hover:border-rose-500/40 hover:text-rose-400/80";
                else styleClass = "bg-black border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300";
              }
              
              return (
                <button
                  key={rubric.tag}
                  onMouseEnter={() => setHoveredRubric(rubric)}
                  onMouseLeave={() => setHoveredRubric(null)}
                  onClick={() => {
                    setSelectedRubrics(prev => ({
                      ...prev,
                      [rubric.tag]: !prev[rubric.tag]
                    }));
                  }}
                  className={`px-3 py-1.5 border text-[10px] font-bold uppercase transition-all duration-200 rounded-sm flex items-center gap-1.5 active:scale-95 ${styleClass}`}
                >
                  {isPenalty && <AlertTriangle size={11} className={isSelected ? "text-rose-400" : "text-zinc-600"} />}
                  {isReward && <Zap size={11} className={isSelected ? "text-emerald-400 animate-pulse" : "text-zinc-600"} />}
                  {rubric.tag}
                </button>
              );
            })}
          </div>
        )}
        {hoveredRubric && (
          <div className="mt-4 p-4 bg-[#030304] border border-zinc-900 rounded-sm text-[10px] space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className={`font-bold tracking-widest uppercase ${hoveredRubric.type === 'reward' ? 'text-emerald-400' : hoveredRubric.type === 'penalty' ? 'text-rose-400' : 'text-zinc-400'}`}>
                {hoveredRubric.type.toUpperCase()}: {hoveredRubric.tag}
              </span>
              <span className="text-zinc-600">Weight: x{hoveredRubric.weight || 1.0}</span>
            </div>
            <p className="text-zinc-400 leading-relaxed font-light">{hoveredRubric.description}</p>
            {(hoveredRubric.positiveExample || hoveredRubric.negativeExample) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-950">
                {hoveredRubric.positiveExample && (
                  <div>
                    <span className="text-emerald-500 font-bold tracking-wider uppercase block mb-1">✓ Positive Example:</span>
                    <span className="text-zinc-500 italic">"{hoveredRubric.positiveExample}"</span>
                  </div>
                )}
                {hoveredRubric.negativeExample && (
                  <div>
                    <span className="text-rose-500 font-bold tracking-wider uppercase block mb-1">✗ Negative Example:</span>
                    <span className="text-zinc-500 italic">"{hoveredRubric.negativeExample}"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};