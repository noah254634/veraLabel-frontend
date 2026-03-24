import React, { useEffect, useState } from 'react';
import { 
  Terminal, Zap, Info, ShieldAlert, ChevronRight, X, 
  Maximize2, MousePointer2, Type, Image as ImageIcon,
  Save, SkipForward, AlertTriangle, Activity
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { useTaskStore } from '../store/taskStore';
import { RLHFStage } from './modes/RLHF'; 

export const CustomWorkbench = () => {
  const { getTasks, tasks, loading } = useTaskStore();
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const currentTask = tasks?.[activeTaskIndex];

  // Logic to handle "Next Task" in dev mode
  const handleSubmit = () => {
    if (!selection) return alert("Select an output before transfer.");
    console.log(`Submitting Result for ${currentTask.taskId}: Winner is ${selection}`);
    
    // Clear selection and move to next
    setSelection(null);
    if (activeTaskIndex < tasks.length - 1) {
      setActiveTaskIndex(prev => prev + 1);
    }
  };

  if (loading || !currentTask) {
    return <div className="h-screen bg-black flex items-center justify-center font-mono text-indigo-500">INITIALIZING_VeraLabel_NODES...</div>;
  }

  return (
    <div className="h-screen w-full bg-[#020203] flex flex-col overflow-hidden text-zinc-300 font-sans">
      
      {/* --- 1. HUD: OPERATOR TELEMETRY --- */}
      <header className="h-16 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest">
            <X size={14} /> Close_Session
          </button>
          <div className="h-6 w-px bg-zinc-900" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest">
              Protocol // {currentTask.taskType.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-white italic tracking-tight">
              Asset_ID: #{currentTask.taskId.slice(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-6 border-r border-zinc-900">
             <div className="text-right">
                <p className="text-[9px] font-mono text-zinc-600 uppercase font-bold">Session_Payout</p>
                <p className="text-emerald-500 font-mono font-bold text-sm">+$4.20</p>
             </div>
             <Zap size={16} className="text-amber-500 animate-pulse" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            QUEUE_POS: {activeTaskIndex + 1} / {tasks.length}
          </div>
        </div>
      </header>

      {/*  2. MULTI-MODAL WORKSPACE --- */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT: TOOLS & INSTRUCTIONS */}
        <aside className="w-80 border-r border-zinc-900 bg-black p-8 flex flex-col gap-10 overflow-y-auto">
          <section>
            <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <Info size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Task_Directives</h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 font-light italic">
              {currentTask.taskType === 'rfhlearning' 
                ? "Compare both neural responses to the prompt and select the more accurate output."
                : "Locate and bound all Class-A vehicles in the viewport."}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <MousePointer2 size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Active_Tools</h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
              <ToolBtn icon={<ImageIcon size={14}/>} label="B-Box" active={currentTask.taskType === 'image'} />
              <ToolBtn icon={<Type size={14}/>} label="Text" active={currentTask.taskType === 'rfhlearning'} />
              <ToolBtn icon={<Maximize2 size={14}/>} label="Zoom" />
              <ToolBtn icon={<Terminal size={14}/>} label="Inspect" />
            </div>
          </section>
          
          <div className="mt-auto p-5 bg-zinc-950 border border-zinc-900 flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-600 uppercase">Quality_Shield</span>
                <span className="text-emerald-500">OPTIMAL</span>
            </div>
            <ProgressBar progress={92} />
          </div>
        </aside>

        {/* CENTER: THE ADAPTIVE STAGE */}
        <div className="flex-1 relative bg-[#010101] flex items-center justify-center p-12 overflow-hidden">
          {currentTask.taskType === 'rfhlearning' ? (
            <RLHFStage 
              task={currentTask} 
              selection={selection} 
              onSelect={setSelection} 
            />
          ) : (
            <div className="text-zinc-600 font-mono text-xs uppercase tracking-widest animate-pulse">
              [ Waiting_For_Image_Protocol_Initialization ]
            </div>
          )}
        </div>

      </main>

      {/*  3. SYSTEM ACTIONS FOOTER */}
      <footer className="h-16 border-t border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0">
        <div className="flex gap-6 items-center">
          <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-rose-500 transition-all uppercase tracking-widest">
            <AlertTriangle size={14} /> Flag_Corrupt
          </button>
          <button 
            onClick={() => setActiveTaskIndex(prev => prev + 1)}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest"
          >
            <SkipForward size={14} /> Skip_Asset
          </button>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-4 border-r border-zinc-900">
              <Activity size={12} className="text-indigo-500" />
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest italic">Encrypted_Sync_Active</span>
           </div>
           <button 
             onClick={handleSubmit}
             className="bg-white text-black px-10 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/10 active:scale-95"
           >
              Submit_Asset_Transfer <ChevronRight size={14} />
           </button>
        </div>
      </footer>
    </div>
  );
};

const ToolBtn = ({ icon, label, active }: any) => (
  <button className={`flex flex-col items-center justify-center p-4 transition-all bg-[#050505] hover:bg-[#080808] ${active ? 'border-b-2 border-b-indigo-500 text-white' : 'text-zinc-600'}`}>
    {icon}
    <span className="text-[8px] font-mono font-bold mt-2 uppercase tracking-tighter">{label}</span>
  </button>
);