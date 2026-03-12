import React, { useState } from 'react';
import { 
  Terminal, Zap, Info, ShieldAlert, ChevronRight, X, 
  Maximize2, MousePointer2, Type, Image as ImageIcon,
  Save, SkipForward, AlertTriangle, Activity
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';

export const CustomWorkbench = () => {
  const [taskType, setTaskType] = useState<'IMAGE' | 'TEXT'>('IMAGE'); // Strategy: Toggle for demo
  const [annotations, setAnnotations] = useState([]);

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
            <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest">Protocol // {taskType}_ANNOTATION</span>
            <span className="text-xs font-bold text-white italic">Asset_ID: #XP-5502</span>
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
          <button 
            onClick={() => setTaskType(taskType === 'IMAGE' ? 'TEXT' : 'IMAGE')}
            className="text-[9px] font-mono border border-zinc-800 px-3 py-1 hover:bg-zinc-900 transition-all"
          >
            DEBUG: TOGGLE_MODE
          </button>
        </div>
      </header>

      {/* --- 2. MULTI-MODAL WORKSPACE --- */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT: TOOLS & INSTRUCTIONS */}
        <aside className="w-80 border-r border-zinc-900 bg-black p-8 flex flex-col gap-10 overflow-y-auto">
          <section>
            <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <Info size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Task_Directives</h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 font-light italic">
              {taskType === 'IMAGE' 
                ? "Locate and bound all Class-A vehicles in the viewport. Exclude static objects."
                : "Analyze the terminal output below and classify the sentiment index."}
            </p>
          </section>

          {/* DYNAMIC TOOLSET */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <MousePointer2 size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Active_Tools</h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
              <ToolBtn icon={<ImageIcon size={14}/>} label="B-Box" active={taskType === 'IMAGE'} />
              <ToolBtn icon={<Type size={14}/>} label="Text" active={taskType === 'TEXT'} />
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
          {taskType === 'IMAGE' ? (
            <div className="relative group border border-zinc-800 shadow-2xl">
                {/* Custom Image Canvas logic would go here */}
                <img 
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
                    className="max-h-[70vh] w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    alt="Work Asset"
                />
                <div className="absolute inset-0 cursor-crosshair" />
                {/* Visual indicator for a custom UI bbox */}
                <div className="absolute top-[20%] left-[30%] w-32 h-20 border-2 border-indigo-500 bg-indigo-500/10">
                    <span className="absolute -top-5 left-0 bg-indigo-500 text-[8px] px-1 font-bold text-white font-mono">VEHICLE_01</span>
                </div>
            </div>
          ) : (
            <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-black border border-zinc-900 p-10 font-mono text-sm leading-relaxed border-l-4 border-l-indigo-500">
                    <p className="text-zinc-400">"The neural synchronization across the Nairobi data nodes has reached a 98% efficiency rating, significantly reducing latency for the VeraLabel infrastructure."</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <SentimentBtn label="Positive" color="hover:border-emerald-500/50 hover:bg-emerald-500/5" />
                    <SentimentBtn label="Neutral" color="hover:border-zinc-500/50 hover:bg-zinc-500/5" />
                    <SentimentBtn label="Negative" color="hover:border-rose-500/50 hover:bg-rose-500/5" />
                </div>
            </div>
          )}
        </div>

      </main>

      {/* --- 3. SYSTEM ACTIONS FOOTER --- */}
      <footer className="h-16 border-t border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0">
        <div className="flex gap-6 items-center">
          <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-rose-500 transition-all uppercase tracking-widest">
            <AlertTriangle size={14} /> Flag_Corrupt
          </button>
          <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest">
            <SkipForward size={14} /> Skip_Asset
          </button>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-4 border-r border-zinc-900">
              <Activity size={12} className="text-indigo-500" />
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest italic">Encrypted_Sync_Active</span>
           </div>
           <button className="bg-white text-black px-10 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/10 active:scale-95">
              Submit_Asset_Transfer <ChevronRight size={14} />
           </button>
        </div>
      </footer>
    </div>
  );
};

// --- WORKBENCH UI SUBCOMPONENTS ---

const ToolBtn = ({ icon, label, active }: any) => (
  <button className={`flex flex-col items-center justify-center p-4 transition-all bg-[#050505] hover:bg-[#080808] ${active ? 'border-b-2 border-b-indigo-500 text-white' : 'text-zinc-600'}`}>
    {icon}
    <span className="text-[8px] font-mono font-bold mt-2 uppercase tracking-tighter">{label}</span>
  </button>
);

const SentimentBtn = ({ label, color }: any) => (
  <button className={`bg-[#050505] border border-zinc-900 p-6 text-xs font-mono font-bold uppercase tracking-widest transition-all ${color} text-zinc-500 hover:text-white`}>
    {label}
  </button>
);