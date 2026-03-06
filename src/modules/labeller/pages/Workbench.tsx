import { useState } from 'react';
import { LabelStudioWrapper } from '../components/LabelstudioWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';

export const WorkbenchPage = () => {
  const [taskData] = useState({
    id: "task_5502",
    data: { image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70" }
  });

  const config = `
    <View>
      <Image name="img" value="$image" zoom="true" brightnessControl="true" contrastControl="true" />
      <RectangleLabels name="label" toName="img">
        <Label value="Vehicle" background="#3B82F6" />
        <Label value="Pedestrian" background="#EF4444" />
        <Label value="Traffic Light" background="#10B981" />
      </RectangleLabels>
    </View>`;

  return (
    <div className="h-screen w-full bg-[#0B0E14] flex flex-col overflow-hidden text-white">
      
      {/* 1. COMPACT HUD (Heads-Up Display) */}
      <header className="h-14 border-b border-white/5 bg-[#0F1219] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-white transition-colors">✕ Exit</button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-sm font-medium text-gray-300">Project: CityScan AI</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">Batch #402</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="w-48">
             <ProgressBar progress={62} label="Batch Progress" />
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Session Payout</p>
            <p className="text-green-400 font-mono font-bold">+$4.20</p>
          </div>
        </div>
      </header>

      {/* 2. THE MAIN WORKSPACE */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT: INSTRUCTIONS DRAWER */}
        <aside className="w-72 border-r border-white/5 bg-[#0F1219] p-5 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Goal</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Outline all moving vehicles. Do not include parked cars or bicycles. 
              Ensure boxes touch the tires.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Hotkeys</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400"><span>Vehicle</span> <kbd className="bg-white/5 px-1.5 rounded">1</kbd></div>
              <div className="flex justify-between text-xs text-gray-400"><span>Pedestrian</span> <kbd className="bg-white/5 px-1.5 rounded">2</kbd></div>
              <div className="flex justify-between text-xs text-gray-400"><span>Submit</span> <kbd className="bg-white/5 px-1.5 rounded">Enter</kbd></div>
            </div>
          </div>
        </aside>

        {/* CENTER: THE ENGINE */}
        <div className="flex-1 relative bg-[#07090D]">
          <LabelStudioWrapper 
            task={taskData} 
            config={config} 
            onSubmit={(data) => console.log("Final Annotation:", data)} 
          />
        </div>

      </main>

      {/* 3. FOOTER ACTIONS */}
      <footer className="h-14 border-t border-white/5 bg-[#0F1219] flex items-center justify-between px-6">
        <div className="flex gap-3">
          <PrimaryButton variant="outline" className="!py-1.5 !px-4">Skip Task</PrimaryButton>
          <PrimaryButton variant="outline" className="!py-1.5 !px-4">Report Issue</PrimaryButton>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-xs text-gray-500 italic">Auto-saving to VeraLabel Cloud...</span>
           <PrimaryButton className="!py-1.5 !px-8 shadow-blue-500/40">Submit & Next</PrimaryButton>
        </div>
      </footer>
    </div>
  );
};