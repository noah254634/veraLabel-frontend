import { ProjectCard } from "../components/ProjectCard";
import { Terminal, Activity, ChevronRight } from "lucide-react";

export const FindWorkPage = () => (
  <div className="w-full animate-in fade-in duration-700">
    
    {/* Header: Registry Inflow */}
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-500 mb-4">
          <Terminal size={14} />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Job_Queue_v.01</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
          Available Batches
        </h1>
        <p className="text-zinc-500 font-light text-sm mt-4">
          Select an operational node to initialize your work session.
        </p>
      </div>

      {/* Registry Search & Stats */}
      <div className="flex items-center gap-4 bg-[#050505] border border-zinc-900 p-2 shadow-2xl">
         <div className="flex items-center gap-2 px-3 border-r border-zinc-900">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Live_Inflow: 24</span>
         </div>
         <div className="flex gap-1">
            <FilterBtn label="IMAGE" active />
            <FilterBtn label="AUDIO" />
            <FilterBtn label="TEXT" />
         </div>
      </div>
    </header>

    {/* Work Registry Grid:*/}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">
      <ProjectCard 
        title="Street Scene Segmentation" 
        type="IMAGE_NODE" 
        reward="$0.05" 
        totalTasks={1200} 
        difficulty="MEDIUM_PRIORITY" 
      />
      <ProjectCard 
        title="Swahili Audio Transcription" 
        type="AUDIO_NODE" 
        reward="$0.12" 
        totalTasks={450} 
        difficulty="HIGH_PRIORITY" 
      />
      <ProjectCard 
        title="Sentiment Analysis (Reviews)" 
        type="TEXT_NODE" 
        reward="$0.02" 
        totalTasks={8900} 
        difficulty="LOW_PRIORITY" 
      />
      
      {/* Locked Project: Obsidian Security Overlay */}
      <div className="relative group overflow-hidden">
        <div className="opacity-20 grayscale pointer-events-none transition-opacity group-hover:opacity-10">
          <ProjectCard title="Tumor Cell Detection" type="MED_SCAN" reward="$1.20" totalTasks={30} difficulty="CRITICAL" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-[1px]">
          <span className="text-[9px] font-mono font-bold text-rose-500 uppercase tracking-[0.3em] mb-3">Access_Denied</span>
          <p className="text-[10px] text-zinc-500 max-w-[180px] leading-relaxed font-light italic">
            "Medical_Imaging_Certification" required to unlock this high-yield node.
          </p>
          <button className="mt-6 text-[9px] font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
            View_Requirements <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>

    {/* Technical Footer Node */}
    <div className="mt-12 flex justify-between items-center opacity-20">
       <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Node_Status: Encrypted_Session</span>
       <span className="text-[8px] font-mono uppercase tracking-[0.4em]">v4.2.1-Prod</span>
    </div>
  </div>
);

// --- INTERNAL HELPERS ---

const FilterBtn = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${
    active 
    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
    : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'
  }`}>
    {label}
  </button>
);