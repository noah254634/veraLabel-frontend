import React, { useState } from 'react';
import { Cpu, Fingerprint, ZoomIn, ZoomOut } from 'lucide-react';

export interface ImageRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface ImageTask {
  id: string;
  signal: string;
  taskType: 'IMAGE';
  imageUrl: string;
  regions: ImageRegion[];
  expectedSegments?: string[];
  aiDiagnostic: {
    match: string;
    confidence: number;
    category?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  note: string;
  metadata?: {
    createdAt?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    estimatedTime?: number;
  };
}

const ImageTaskRenderer: React.FC<{ task: ImageTask }> = ({ task }) => {
  const [zoom, setZoom] = useState(100);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-zinc-600">
        <Fingerprint size={14} />
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em]">
          Signal_ID: <span className="text-rose-400">{task.signal}</span>
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-end text-[9px] font-mono text-zinc-600">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-2 hover:bg-zinc-900 hover:text-zinc-400 rounded transition-all"
          >
            <ZoomOut size={14} />
          </button>
          <span className="w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 hover:bg-zinc-900 hover:text-zinc-400 rounded transition-all"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <div className="relative bg-zinc-950/40 border border-zinc-900 rounded-sm p-6 overflow-auto">
          <div
            className="relative inline-block"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              transition: 'transform 200ms ease-out'
            }}
          >
            <img
              src={task.imageUrl}
              alt="Task Image"
              className="w-full max-w-none rounded-sm opacity-90"
            />

            {task.regions.map((region, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedRegion(idx)}
                className={`absolute transition-all cursor-pointer ${
                  selectedRegion === idx
                    ? 'border-2 border-cyan-400 bg-cyan-500/10'
                    : 'border-2 border-rose-500/50 hover:border-rose-400 bg-rose-500/5'
                }`}
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`
                }}
              >
                {region.label && (
                  <span className="absolute -top-6 left-0 text-[8px] font-mono bg-black px-2 py-1 text-rose-400 whitespace-nowrap">
                    {region.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {task.regions.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {task.regions.map((region, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRegion(idx)}
                className={`p-3 text-[8px] font-mono text-left rounded-sm transition-all border ${
                  selectedRegion === idx
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-rose-500/30'
                }`}
              >
                <div className="font-bold uppercase">Region {idx + 1}</div>
                <div className="text-[7px] opacity-60 mt-1">
                  {region.label || 'Unlabeled'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 border-t border-zinc-900 pt-12">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} className="text-indigo-500" /> AI_Diagnostic
          </p>
          <div className="p-6 bg-black border border-zinc-900 text-xs text-indigo-400/80 font-mono italic space-y-2 leading-relaxed">
            <div className="text-zinc-700">// Vision Analysis Report</div>
            <div>Detection: <span className="text-indigo-300">{task.aiDiagnostic.match}</span></div>
            <div>Category: <span className="text-indigo-300">{task.aiDiagnostic.category || 'Unclassified'}</span></div>
            <div>Confidence: <span className="text-indigo-300">{(task.aiDiagnostic.confidence * 100).toFixed(0)}%</span></div>
            <div>Risk: <span className={task.aiDiagnostic.riskLevel === 'HIGH' ? 'text-rose-400' : task.aiDiagnostic.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}>
              {task.aiDiagnostic.riskLevel || 'UNKNOWN'}
            </span></div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Review_Context</p>
            <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700 pl-4">
              "{task.note}"
            </p>
            {task.expectedSegments && task.expectedSegments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-900">
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Expected_Segments</p>
                <div className="flex flex-wrap gap-1">
                  {task.expectedSegments.map((seg, i) => (
                    <span key={i} className="text-[8px] px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-sm">
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTaskRenderer;
