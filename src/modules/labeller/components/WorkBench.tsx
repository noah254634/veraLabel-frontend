import React, { useState } from 'react';
import { LabelStudioWrapper } from '../components/LabelstudioWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { Settings, Info, Keyboard, LogOut, DollarSign } from 'lucide-react';

export const WorkbenchPage = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Example task data
  const currentTask = {
    id: "vbl_778",
    data: { image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45" }
  };

  const config = `<View>
    <Image name="img" value="$image" zoom="true"/>
    <RectangleLabels name="label" toName="img">
      <Label value="Laptop" background="#3B82F6" />
      <Label value="Phone" background="#10B981" />
    </RectangleLabels>
  </View>`;

  return (
    <div className="h-screen w-full bg-[#07090D] flex flex-col overflow-hidden select-none">
      
      {/* --- HIGH-END TOP HUD --- */}
      <header className="h-14 border-b border-white/5 bg-[#0F1219]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.history.back()}>
            <LogOut size={16} className="text-gray-500 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Exit</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Project</span>
            <span className="text-xs text-blue-400 font-medium">Tech-Object Detection v2.1</span>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden md:block w-48">
            <ProgressBar progress={68} label="Session Batch" />
          </div>
          <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 px-4 py-1.5 rounded-full">
            <DollarSign size={14} className="text-green-500" />
            <span className="text-sm font-mono font-bold text-green-400">12.80</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLLAPSIBLE: INSTRUCTIONS & TOOLS */}
        <aside className="w-80 border-r border-white/5 bg-[#0B0E14] flex flex-col">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4 text-blue-500">
                <Info size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Guidelines</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Identify all electronic devices. Bounding boxes must be tightly fitted to the hardware edges. Ignore cables.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 text-purple-500">
                <Keyboard size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Hotkeys</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Select Laptop</span>
                  <kbd className="bg-white/10 px-2 py-1 rounded text-gray-300">1</kbd>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Select Phone</span>
                  <kbd className="bg-white/10 px-2 py-1 rounded text-gray-300">2</kbd>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Submit Task</span>
                  <kbd className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Enter</kbd>
                </div>
              </div>
            </section>
          </div>

          <div className="p-4 border-t border-white/5 bg-[#0F1219]">
             <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-[11px] text-blue-400 italic text-center">
                Pro Tip: Use 'Z' to zoom in on specific pixels.
             </div>
          </div>
        </aside>

        {/* CENTER: THE LABEL STUDIO CANVAS */}
        <div className="flex-1 relative bg-[#07090D] p-4">
          <div className="h-full w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <LabelStudioWrapper 
               task={currentTask} 
               config={config} 
               onSubmit={(data) => console.log(data)} 
            />
          </div>
        </div>

      </main>

      {/* --- WORKBENCH SETTINGS OVERLAY --- */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#161B22] border border-white/10 w-full max-w-md rounded-3xl shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1C2128]">
              <h3 className="font-bold text-lg">Workbench Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">High Precision Crosshair</p>
                  <p className="text-xs text-gray-500">Guides for pixel-perfect alignment</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Auto-Next Task</p>
                  <p className="text-xs text-gray-500">Load new task immediately after submit</p>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full flex items-center justify-start px-1 cursor-pointer">
                  <div className="w-3.5 h-3.5 bg-gray-500 rounded-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500 mb-4 uppercase font-bold tracking-widest">Theme Accent</p>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-blue-500 ring-offset-4 ring-offset-[#161B22] cursor-pointer" />
                  <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer" />
                  <div className="w-6 h-6 rounded-full bg-emerald-500 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#0F1219] flex justify-end">
               <PrimaryButton onClick={() => setIsSettingsOpen(false)}>Save Preferences</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};