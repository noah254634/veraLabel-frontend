import { useState } from 'react';
import { Zap, AlertTriangle, Edit3, Globe } from 'lucide-react';

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

export const UnifiedRLHFStage = ({ task }: { task?: TaskData | null }) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  if (!task) {
    return (
      <div className="w-full min-h-full px-8 py-6 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center">
        No active RLHF task loaded
      </div>
    );
  }

  const derivedPrompt = task.prompt || task.taskName || task.instruction || 'No prompt available for this task.';
  const isComparison = task.type === 'comparison';
  const responseList = Array.isArray(task.responses)
    ? task.responses
    : Array.isArray(task.response)
      ? task.response.map((item, index) => ({
          id: item?.id || `resp-${index + 1}`,
          content: item?.content || '',
          label: item?.label || `Response ${index + 1}`,
        }))
      : Array.isArray(task.result?.responses)
        ? task.result.responses.map((item, index) => ({
            id: item?.id || `resp-${index + 1}`,
            content: item?.content || '',
            label: item?.label || `Response ${index + 1}`,
          }))
        : Array.isArray(task.result?.response)
          ? task.result.response.map((item, index) => ({
              id: item?.id || `resp-${index + 1}`,
              content: item?.content || '',
              label: item?.label || `Response ${index + 1}`,
            }))
          : Array.isArray(task.data?.responses)
            ? task.data.responses.map((item, index) => ({
                id: item?.id || `resp-${index + 1}`,
                content: item?.content || '',
                label: item?.label || `Response ${index + 1}`,
              }))
            : Array.isArray(task.data?.response)
              ? task.data.response.map((item, index) => ({
                  id: item?.id || `resp-${index + 1}`,
                  content: item?.content || '',
                  label: item?.label || `Response ${index + 1}`,
                }))
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

  return (
    <div className="w-full min-h-full px-8 py-6 flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* 1. THE CONTEXT BAR (Critical for Sheng/Local Dialects) */}
      <div className="flex items-center gap-4 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-sm">
        <Globe size={16} className="text-indigo-400" />
        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
          Linguistic_Target // {task.context || "General_Swahili"}
        </span>
      </div>

      {/* 2. THE PROMPT BOX */}
      <div className="bg-[#050505] border-l-4 border-indigo-500 p-6">
        <span className="text-[9px] font-mono text-zinc-500 uppercase mb-2 block">Input_Prompt</span>
        <h2 className="text-xl font-medium text-white font-serif">"{derivedPrompt}"</h2>
      </div>

      {/* 3. DYNAMIC WORKSPACE */}
      <div className={`grid ${isComparison ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {normalizedResponses.length === 0 ? (
          <div className="border border-amber-700/40 bg-amber-900/10 p-6 text-amber-300 text-xs font-mono uppercase tracking-wider">
            Task payload has no inline model responses yet. Source ref: {task.r2_input_taskRef || 'unavailable'}
          </div>
        ) : normalizedResponses.map((resp) => (
          <div 
            key={resp.id}
            onClick={() => !isEditing && setSelection(resp.id)}
            className={`group relative border transition-all p-8 cursor-pointer
              ${selection === resp.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-black hover:border-zinc-600'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{resp.label}</span>
              {selection === resp.id && <Zap size={16} className="text-emerald-500 fill-emerald-500" />}
            </div>

            {/* Response Content */}
            <div className="space-y-4">
              <p className="text-md leading-relaxed text-zinc-300 font-light italic">
                {resp.content}
              </p>
              
              {/* "Edit to Gold" functionality for Single Model Reviews */}
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
        ))}
      </div>

      {/* 4. THE AFRICAN-CONTEXT RUBRIC (Sidebar or Bottom Panel) */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm mt-4">
        <h3 className="text-[11px] font-mono text-zinc-400 uppercase mb-4 tracking-widest">Evaluation_Rubric</h3>
        <div className="flex flex-wrap gap-3">
          {["Natural Sheng", "Ufasaha (Fluency)", "Cultural Relevance", "No Hallucination"].map(tag => (
            <button key={tag} className="px-3 py-1 border border-zinc-700 text-[10px] text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
              + {tag}
            </button>
          ))}
          <button className="px-3 py-1 border border-red-900/50 text-[10px] text-red-500 flex items-center gap-2 bg-red-500/5">
            <AlertTriangle size={12} /> Flag: Direct Translation (Literal)
          </button>
        </div>
      </div>
    </div>
  );
};