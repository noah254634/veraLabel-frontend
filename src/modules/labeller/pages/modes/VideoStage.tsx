import { useState, useRef, useEffect, useCallback } from 'react';
import { Film, ChevronLeft, ChevronRight, Layers, Anchor, Info, Cpu } from 'lucide-react';
import { ImageStage } from './ImageStage';

interface VideoFrame {
  frameIndex: number;
  url: string;
  embeddingUrl?: string;
  isSeedFrame: boolean;
  status: 'pending' | 'annotated' | 'propagated' | 'locked';
}

interface VideoTask {
  _id?: string;
  id?: string;
  taskId?: string;
  taskType?: string;
  videoFrames?: VideoFrame[];
  // Flattened when only a single seed frame is loaded
  isSeedFrame?: boolean;
  videoFrameIndex?: number;
  url?: string;
  embeddingUrl?: string;
  categories?: string[];
  datasetName?: string;
  domain?: string;
  [key: string]: any;
}

interface VideoStageProps {
  task: VideoTask;
  worker?: Worker;
  onBoxesChange: (boxes: any[]) => void;
  onPolygonsChange: (polygons: any[]) => void;
  onDecodingChange: (decoding: boolean) => void;
  shortcutsDisabled?: boolean;
}

/**
 * VideoStage — Semi-automated video labelling workbench mode.
 *
 * Labellers only annotate the highlighted seed frames. SAM2 propagates
 * their masks to all remaining frames automatically on the server side.
 * Non-seed frames are visible in the timeline but are locked/read-only.
 */
export const VideoStage = ({
  task,
  worker,
  onBoxesChange,
  onPolygonsChange,
  onDecodingChange,
  shortcutsDisabled,
}: VideoStageProps) => {
  const imageStageRef = useRef<any>(null);

  // Build frame list from task data
  const frames: VideoFrame[] = task.videoFrames?.length
    ? task.videoFrames
    : task.videoFrameIndex !== undefined
    ? [
        {
          frameIndex: task.videoFrameIndex,
          url: task.url || task.data?.url || '',
          embeddingUrl: task.embeddingUrl || task.data?.embeddingUrl,
          isSeedFrame: task.isSeedFrame ?? true,
          status: 'pending',
        },
      ]
    : [];

  const seedFrames = frames.filter((f) => f.isSeedFrame);
  const [activeSeedIndex, setActiveSeedIndex] = useState(0);
  const activeFrame = seedFrames[activeSeedIndex] ?? frames[0];

  // Track per-frame annotation state
  const [frameAnnotations, setFrameAnnotations] = useState<
    Record<number, { boxes: any[]; polygons: any[] }>
  >({});

  const handleBoxesChange = useCallback(
    (boxes: any[]) => {
      if (!activeFrame) return;
      setFrameAnnotations((prev) => ({
        ...prev,
        [activeFrame.frameIndex]: {
          ...(prev[activeFrame.frameIndex] || {}),
          boxes,
        },
      }));
      onBoxesChange(boxes);
    },
    [activeFrame, onBoxesChange]
  );

  const handlePolygonsChange = useCallback(
    (polygons: any[]) => {
      if (!activeFrame) return;
      setFrameAnnotations((prev) => ({
        ...prev,
        [activeFrame.frameIndex]: {
          ...(prev[activeFrame.frameIndex] || {}),
          polygons,
        },
      }));
      onPolygonsChange(polygons);
    },
    [activeFrame, onPolygonsChange]
  );

  // Reset annotation state when switching seed frames
  useEffect(() => {
    if (!activeFrame) return;
    const saved = frameAnnotations[activeFrame.frameIndex];
    onBoxesChange(saved?.boxes || []);
    onPolygonsChange(saved?.polygons || []);
  }, [activeSeedIndex]);

  if (!activeFrame) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#020203] text-zinc-600 font-mono text-xs uppercase tracking-widest">
        No video frames available for this task.
      </div>
    );
  }

  const totalFrames = frames.length;
  const annotatedCount = Object.values(frameAnnotations).filter(
    (a) => (a.polygons?.length || 0) > 0 || (a.boxes?.length || 0) > 0
  ).length;

  const propagatedEstimate =
    seedFrames.length > 0 && totalFrames > 0
      ? Math.round(((totalFrames - seedFrames.length) / totalFrames) * 100)
      : 0;

  return (
    <div className="h-full w-full flex flex-col bg-[#020203] overflow-hidden">

      {/* ── Top Banner ─────────────────────────────────────────────────── */}
      <div className="h-10 bg-black border-b border-zinc-900 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Film size={13} className="text-indigo-400" />
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Video Seed Annotation
          </span>
          <span className="text-[9px] text-zinc-700 font-mono">
            — Only seed frames require manual annotation. SAM2 fills the rest.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Anchor size={11} className="text-amber-500" />
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              {seedFrames.length} seed{seedFrames.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[9px] text-zinc-700">/ {totalFrames} total frames</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={11} className="text-indigo-500" />
            <span className="text-[10px] font-mono text-indigo-400">
              SAM2 auto-fills ~{propagatedEstimate}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Area: Canvas + Seed Navigator ────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* Left: Seed frame navigator */}
        <div className="w-52 shrink-0 border-r border-zinc-900 bg-black flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-900">
            <p className="text-[9px] font-mono font-bold uppercase text-zinc-600 tracking-widest">
              Seed Frames
            </p>
            <p className="text-[8px] text-zinc-800 mt-0.5">
              Annotate each highlighted frame
            </p>
          </div>

          <div className="flex-1 overflow-y-auto py-2 space-y-1">
            {seedFrames.map((frame, idx) => {
              const ann = frameAnnotations[frame.frameIndex];
              const isDone = (ann?.polygons?.length || 0) > 0 || (ann?.boxes?.length || 0) > 0;
              const isActive = idx === activeSeedIndex;

              return (
                <button
                  key={frame.frameIndex}
                  onClick={() => setActiveSeedIndex(idx)}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-all
                    ${isActive
                      ? 'bg-indigo-500/10 border-l-2 border-indigo-500'
                      : 'border-l-2 border-transparent hover:bg-zinc-900/50'
                    }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isDone ? 'bg-emerald-500' : isActive ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-700'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-mono font-bold truncate ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                      Frame {frame.frameIndex}
                    </p>
                    <p className={`text-[8px] font-mono ${isDone ? 'text-emerald-500' : 'text-zinc-700'}`}>
                      {isDone ? 'Annotated ✓' : 'Pending'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress summary */}
          <div className="border-t border-zinc-900 px-4 py-3">
            <div className="flex justify-between text-[9px] font-mono mb-2">
              <span className="text-zinc-600">Seeds done</span>
              <span className={annotatedCount >= seedFrames.length ? 'text-emerald-500' : 'text-amber-500'}>
                {annotatedCount}/{seedFrames.length}
              </span>
            </div>
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${seedFrames.length > 0 ? (annotatedCount / seedFrames.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: ImageStage canvas for current seed frame */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative">

          {/* Seed frame badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/80 backdrop-blur border border-indigo-500/30 px-3 py-1.5 rounded-lg">
            <Anchor size={11} className="text-amber-500" />
            <span className="text-[10px] font-mono font-bold text-white">
              Seed Frame {activeFrame.frameIndex}
            </span>
            <span className="text-[9px] text-zinc-500">
              ({activeSeedIndex + 1} of {seedFrames.length})
            </span>
          </div>

          {/* Prev / Next seed nav */}
          {seedFrames.length > 1 && (
            <>
              <button
                onClick={() => setActiveSeedIndex((p) => Math.max(0, p - 1))}
                disabled={activeSeedIndex === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 border border-zinc-800 rounded-full hover:border-indigo-500/50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} className="text-white" />
              </button>
              <button
                onClick={() => setActiveSeedIndex((p) => Math.min(seedFrames.length - 1, p + 1))}
                disabled={activeSeedIndex === seedFrames.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 border border-zinc-800 rounded-full hover:border-indigo-500/50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} className="text-white" />
              </button>
            </>
          )}

          {/* The actual annotation canvas — reuses existing ImageStage + SAM2 worker */}
          <ImageStage
            key={`frame-${activeFrame.frameIndex}`}
            ref={imageStageRef}
            task={{
              ...task,
              url: activeFrame.url,
              data: { ...(task.data || {}), url: activeFrame.url },
              embeddingUrl: activeFrame.embeddingUrl,
              categories: task.categories || [],
              datasetName: task.datasetName,
              domain: task.domain,
            } as any}
            onBoxesChange={handleBoxesChange}
            onPolygonsChange={handlePolygonsChange}
            onDecodingChange={onDecodingChange}
            shortcutsDisabled={shortcutsDisabled}
            worker={worker}
          />
        </div>
      </div>

      {/* ── Bottom Frame Strip: all frames overview ─────────────────── */}
      <div className="h-16 border-t border-zinc-900 bg-black flex items-center gap-1 px-3 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 mr-2 shrink-0">
          <Layers size={11} className="text-zinc-600" />
          <span className="text-[9px] font-mono text-zinc-700 uppercase">Timeline</span>
        </div>

        {frames.map((frame) => {
          const isSeed = frame.isSeedFrame;
          const isActive = activeFrame.frameIndex === frame.frameIndex;
          const ann = frameAnnotations[frame.frameIndex];
          const isDone = (ann?.polygons?.length || 0) > 0 || (ann?.boxes?.length || 0) > 0;

          return (
            <div
              key={frame.frameIndex}
              onClick={() => {
                if (isSeed) {
                  const seedIdx = seedFrames.findIndex((s) => s.frameIndex === frame.frameIndex);
                  if (seedIdx !== -1) setActiveSeedIndex(seedIdx);
                }
              }}
              title={isSeed ? `Seed Frame ${frame.frameIndex} — click to annotate` : `Frame ${frame.frameIndex} — auto-propagated by SAM2`}
              className={`
                h-9 w-7 shrink-0 rounded-sm border flex items-end justify-center pb-1 transition-all
                ${isActive ? 'border-indigo-500 bg-indigo-500/20' : ''}
                ${isSeed && !isActive ? 'border-amber-500/50 bg-amber-500/5 cursor-pointer hover:border-amber-400' : ''}
                ${!isSeed ? 'border-zinc-900 bg-zinc-950 cursor-default opacity-40' : ''}
              `}
            >
              {isDone && <div className="w-1 h-1 rounded-full bg-emerald-500" />}
              {isSeed && !isDone && <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />}
            </div>
          );
        })}

        <div className="ml-3 shrink-0 flex items-center gap-2 pl-3 border-l border-zinc-900">
          <Info size={11} className="text-zinc-700" />
          <span className="text-[9px] font-mono text-zinc-700">
            Amber = seed (annotate) · Dim = SAM2 fills automatically
          </span>
        </div>
      </div>
    </div>
  );
};
