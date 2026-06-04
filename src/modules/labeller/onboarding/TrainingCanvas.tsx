import React, { useState, useRef } from 'react';
import { Target, RefreshCw, MousePointer2, Cpu, FileText, Layout, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

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
  const [box, setBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep = TRAINING_STEPS[currentStepIndex];

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnalyzing || showResult) return;
    const coords = getCoordinates(e);
    setStartPos(coords);
    setIsDrawing(true);
    setBox({ ...coords, w: 0, h: 0 });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const current = getCoordinates(e);
    setBox({
      x: Math.max(0, Math.min(startPos.x, current.x)),
      y: Math.max(0, Math.min(startPos.y, current.y)),
      w: Math.abs(current.x - startPos.x),
      h: Math.abs(current.y - startPos.y),
    });
  };

  const handleEnd = () => setIsDrawing(false);

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
      setBox(null);
      setShowResult(false);
      setAnalysisProgress(0);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
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
        {!isAnalyzing && !showResult && (
          <button 
            onClick={() => setBox(null)} 
            className="p-3 bg-zinc-900/50 hover:bg-white/5 rounded-2xl transition-all border border-zinc-800 group"
          >
            <RefreshCw size={20} className="text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        )}
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        className="relative flex-1 min-h-[350px] md:min-h-0 w-full bg-[#0a0a0c] rounded-[32px] border border-zinc-900 overflow-hidden cursor-crosshair touch-none select-none group"
      >
        <img 
          src={currentStep.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 transition-opacity duration-700 pointer-events-none"
          alt="Training Target"
        />
        <div className="absolute top-6 left-6 pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className="h-px w-8 bg-indigo-500/50" />
            <span className="text-[8px] font-mono text-indigo-500 uppercase tracking-widest">Aperture_Lock</span>
          </div>
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
        {!box && !isDrawing && !isAnalyzing && !showResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px] pointer-events-none">
            <div className="p-6 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-xl flex flex-col items-center">
                <MousePointer2 className="text-white mb-4 animate-bounce" size={24} />
                <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Isolate the {currentStep.target}</p>
            </div>
          </div>
        )}
        {box && (
          <div 
            className={`absolute border-2 ${isAnalyzing ? 'border-zinc-500' : 'border-indigo-500'} bg-indigo-500/5 shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-colors`}
            style={{ 
              left: `${box.x}%`, 
              top: `${box.y}%`, 
              width: `${box.w}%`, 
              height: `${box.h}%` 
            }}
          >
            <div className="absolute -top-7 left-0 bg-indigo-600 text-[8px] px-2 py-1 font-black uppercase text-white rounded-xs flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              REGION_{currentStep.id}_LOCK
            </div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30 animate-scan shadow-[0_0_10px_white]" />
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col items-center">
        {!showResult && (
          <PrimaryButton 
            disabled={!box || box.w < 2 || isAnalyzing} 
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