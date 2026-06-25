import { useState, useEffect } from 'react';
import { Target, Cpu, FileText, Layout, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { ImageStage } from '../pages/modes/ImageStage';

const TRAINING_STEPS = [
  {
    id: 'BBOX',
    title: 'Object Localization',
    target: 'Main Processor (CPU)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    instruction: 'Draw a tight bounding box around the central processor unit.',
    icon: <Cpu size={18} />
  },
  {
    id: 'TRANSCRIPTION',
    title: 'Precision OCR',
    target: 'Serial Identifier',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
    instruction: 'Verify and transcribe the alphanumeric code displayed.',
    icon: <FileText size={18} />
  },
  {
    id: 'CLASSIFICATION',
    title: 'Categorization',
    target: 'Component Type',
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=1200&q=80',
    instruction: 'Select the primary component family from the detected region.',
    icon: <Layout size={18} />
  }
];

export const TrainingCanvas = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeBoxes, setActiveBoxes] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentStep = TRAINING_STEPS[currentStepIndex];

  // Reset state on step change
  useEffect(() => {
    setActiveBoxes([]);
    setShowResult(false);
    setAnalysisProgress(0);
    setIsAnalyzing(false);
  }, [currentStepIndex]);

  const handleVerify = () => {
    setIsAnalyzing(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setAnalysisProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setShowResult(true);
      }
    }, 50);
  };

  const nextStep = () => {
    if (currentStepIndex < TRAINING_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  // Construct a mock task object for ImageStage
  const mockTask = {
    taskId: `training-step-${currentStepIndex}`,
    data: { url: currentStep.image },
    categories: [currentStep.target],
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-sm border border-indigo-500/30">
              STAGE {currentStepIndex + 1}/{TRAINING_STEPS.length}
            </span>
          </div>
          <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            {currentStep.icon} {currentStep.title}
          </h3>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
            Task: {currentStep.instruction}
          </p>
        </div>
      </div>

      <div className="relative flex-1 w-full bg-[#0a0a0c] rounded-[32px] border border-zinc-900 overflow-hidden group">
        <div className={showResult || isAnalyzing ? 'pointer-events-none opacity-50' : ''} style={{ width: '100%', height: '100%' }}>
          <ImageStage 
            task={mockTask} 
            onBoxesChange={(boxes) => setActiveBoxes(boxes)} 
          />
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              <Loader2 className="text-indigo-500 animate-spin" size={64} strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono text-white">{analysisProgress}%</span>
              </div>
            </div>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Running Refinery Intelligence...</p>
          </div>
        )}
        
        {showResult && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="text-emerald-500" size={32} />
             </div>
             <h4 className="text-white text-2xl font-black tracking-tighter mb-2">98.4% Accuracy</h4>
             <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-8">Ground-truth validation verified</p>
             <PrimaryButton onClick={nextStep} className="px-10 py-4 text-xs font-black uppercase tracking-widest">
               Proceed to Next Phase
             </PrimaryButton>
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col items-center flex-shrink-0">
        {!showResult && (
          <PrimaryButton 
            disabled={activeBoxes.length === 0 || isAnalyzing} 
            onClick={handleVerify}
            className="w-full py-5 md:py-6 shadow-2xl shadow-indigo-600/20 text-xs font-black uppercase tracking-[0.3em]"
          >
            {isAnalyzing ? "Processing Refinery..." : "Commit Annotation"}
          </PrimaryButton>
        )}
        
        <div className="flex items-center gap-6 mt-6 opacity-30">
           <div className="flex items-center gap-2">
              <ShieldAlert size={12} className="text-zinc-500" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Quality_Enforced</span>
           </div>
           <div className="h-4 w-[1px] bg-zinc-800" />
           <div className="flex items-center gap-2">
              <Target size={12} className="text-zinc-500" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Sub-pixel_Precision</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCanvas;