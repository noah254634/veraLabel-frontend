import { useState, useEffect } from 'react';
import { FileText, AlignLeft, Info, CheckCircle2 } from 'lucide-react';

interface TextStageProps {
  task: {
    prompt?: string;
    content?: string;
    context?: string;
    taskObject?: any;
    taskId: string;
    labellingMethod?: string;
    // Categories/labels can come from the task payload itself
    categories?: string[];
    labels?: string[];
    options?: string[];
    instruction?: string;
  };
  // Bug #5 fix: expose selected label up to the Workbench so it can be
  // included in the annotation payload on submit
  onLabelSelect?: (label: string) => void;
  selectedLabel?: string | null;
}

export const TextStage = ({ task, onLabelSelect, selectedLabel }: TextStageProps) => {
  const payload = task.taskObject || task;
  const content = payload.content || payload.prompt || payload.text || "No text content available.";
  const context = payload.context || "General_Context";

  // Resolve label options from multiple possible payload locations
  const rawCategories: string[] =
    payload.categories ||
    payload.labels ||
    payload.options ||
    task.categories ||
    task.labels ||
    task.options ||
    [];

  // For classification tasks, show the label picker
  const isClassification =
    task.labellingMethod === 'classification' ||
    payload.labellingMethod === 'classification' ||
    rawCategories.length > 0;

  const [localSelected, setLocalSelected] = useState<string | null>(selectedLabel ?? null);

  // Sync if parent provides controlled value
  useEffect(() => {
    if (selectedLabel !== undefined) setLocalSelected(selectedLabel);
  }, [selectedLabel]);

  const handleSelect = (label: string) => {
    setLocalSelected(label);
    onLabelSelect?.(label);
  };

  return (
    <div className="w-full h-full p-12 flex flex-col bg-[#050505] animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-sm">
           <FileText size={14} className="text-indigo-400" />
           <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Type // Plain_Text</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm">
           <Info size={14} className="text-zinc-500" />
           <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Context // {context}</span>
        </div>
        {isClassification && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
              Mode // Classification
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 bg-[#020203] border border-zinc-900 p-10 relative overflow-y-auto mb-6">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <AlignLeft size={120} />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xl leading-relaxed text-zinc-300 font-light font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-indigo-500 first-letter:mr-2">
            {content}
          </p>
        </div>
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-800" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-800" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-800" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-zinc-800" />
      </div>
      {isClassification && rawCategories.length > 0 && (
        <div className="space-y-3 shrink-0">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
            Assign_Label:
          </p>
          <div className="flex flex-wrap gap-2">
            {rawCategories.map((cat) => {
              const isActive = localSelected === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelect(cat)}
                  className={`flex items-center gap-2 px-5 py-2.5 border text-[11px] font-mono font-bold uppercase tracking-widest transition-all active:scale-95
                    ${isActive
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                      : 'border-zinc-800 text-zinc-500 bg-black hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                >
                  {isActive && <CheckCircle2 size={12} className="text-indigo-400" />}
                  {cat}
                </button>
              );
            })}
          </div>
          {localSelected && (
            <p className="text-[9px] text-emerald-500 font-mono uppercase tracking-widest animate-in fade-in">
              ✓ Label selected: {localSelected}
            </p>
          )}
        </div>
      )}
      {isClassification && rawCategories.length === 0 && (
        <div className="shrink-0 border border-amber-800/30 bg-amber-900/10 p-4 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
          ⚠ Classification task but no label options found in task payload.
        </div>
      )}
      <div className="mt-6 flex justify-between items-center opacity-40 shrink-0">
        <div className="flex gap-4">
           <div className="h-1 w-8 bg-indigo-500/50" />
           <div className="h-1 w-8 bg-zinc-800" />
           <div className="h-1 w-8 bg-zinc-800" />
        </div>
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Asset_Loaded_Successfully</span>
      </div>
    </div>
  );
};
