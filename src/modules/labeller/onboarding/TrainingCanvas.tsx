import React, { useState, useRef } from 'react';
import { Target, RefreshCw, MousePointer2 } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

export const TrainingCanvas = ({ onComplete }: { onComplete: () => void }) => {
  // We store coordinates as percentages (0-100) for cross-device consistency
  const [box, setBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    
    // Support both Mouse and Touch
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Convert to percentage of container width/height
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
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

  return (
    <div className="flex flex-col h-full max-h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="text-blue-500" size={20} /> Skill Verification
          </h3>
          <p className="text-gray-500 text-xs md:text-sm uppercase tracking-widest font-bold">
            Target: Main Processor (CPU)
          </p>
        </div>
        <button 
          onClick={() => setBox(null)} 
          className="p-2 hover:bg-white/5 rounded-full transition-colors group"
          title="Reset Canvas"
        >
          <RefreshCw size={18} className="text-gray-500 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* THE RESPONSIVE CANVAS */}
      <div 
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        className="relative flex-1 min-h-[300px] md:min-h-0 w-full bg-[#0B0E14] rounded-3xl border border-white/10 overflow-hidden cursor-crosshair touch-none select-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
          alt="Training Target"
        />

        {/* INSTRUCTION OVERLAY (Hide when drawing) */}
        {!box && !isDrawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
            <MousePointer2 className="text-white/20 mb-2 animate-bounce" size={32} />
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Click and drag to label</p>
          </div>
        )}
        
        {/* DRAWN BOX (Rendered with percentages) */}
        {box && (
          <div 
            className="absolute border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-white/20"
            style={{ 
              left: `${box.x}%`, 
              top: `${box.y}%`, 
              width: `${box.w}%`, 
              height: `${box.h}%` 
            }}
          >
            <div className="absolute -top-6 left-0 bg-blue-600 text-[9px] px-2 py-0.5 font-black uppercase text-white rounded-sm">
              CPU_PIONEER_VERIFY
            </div>
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>

      <div className="pt-2">
        <PrimaryButton 
          disabled={!box || box.w < 2} 
          onClick={onComplete}
          className="w-full py-4 md:py-6 shadow-xl shadow-blue-500/10 text-sm md:text-base"
        >
          Verify Annotation Accuracy
        </PrimaryButton>
        <p className="text-center text-[9px] text-gray-600 mt-4 uppercase font-bold tracking-widest italic">
          High precision unlocks 24h M-Pesa payouts
        </p>
      </div>
    </div>
  );
};

export default TrainingCanvas;