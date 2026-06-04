import { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2, MousePointer2, Square, Trash2, Scan, Crosshair, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

interface BoundingBox {
  id: string;
  x: number; // percentage of image width
  y: number; // percentage of image height
  w: number;
  h: number;
  label: string;
}

interface ImageStageProps {
  task: {
    r2_url?: string;
    data?: { url: string };
    taskObject?: {
      url?: string;
      data?: { url?: string };
      content?: string;
      categories?: string[];
      labels?: string[];
      options?: string[];
    } | string;
    taskId: string;
    categories?: string[];
    labels?: string[];
    options?: string[];
    datasetName?: string;
    domain?: string;
  };
  onBoxesChange?: (boxes: BoundingBox[]) => void;
  shortcutsDisabled?: boolean;
}

type Tool = 'pointer' | 'bbox';

const LABEL_COLORS = [
  'rgba(99,102,241,0.7)',
  'rgba(16,185,129,0.7)',
  'rgba(245,158,11,0.7)',
  'rgba(239,68,68,0.7)',
  'rgba(168,85,247,0.7)',
];

const cloneBoxes = (list: BoundingBox[]) => list.map((box) => ({ ...box }));

export const ImageStage = ({ task, onBoxesChange, shortcutsDisabled = false }: ImageStageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [drawing, setDrawing] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // High-precision zoom & pan states
  const [zoom, setZoom] = useState<number>(100);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const historyRef = useRef<BoundingBox[][]>([]);

  const [resizing, setResizing] = useState<{
    boxId: string;
    handle: 'tl' | 'tr' | 'bl' | 'br' | 'move';
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const pushHistory = useCallback((snapshot: BoundingBox[]) => {
    historyRef.current = [...historyRef.current, cloneBoxes(snapshot)].slice(-50);
  }, []);

  const clearSelectionAndInteraction = useCallback(() => {
    setSelectedBoxId(null);
    setDrawing(null);
    setCurrentRect(null);
    setResizing(null);
    setIsPanning(false);
  }, []);

  const resetViewport = useCallback(() => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((current) => Math.min(400, current + 25));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) => {
      const next = Math.max(100, current - 25);
      if (next === 100) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((current) => !current);
  }, []);

  const undoLastAction = useCallback(() => {
    const previous = historyRef.current.pop();
    if (!previous) return;

    setBoxes(cloneBoxes(previous));
    clearSelectionAndInteraction();
  }, [clearSelectionAndInteraction]);

  const deleteBoxById = useCallback((id: string) => {
    setBoxes((prev) => {
      pushHistory(prev);
      return prev.filter((box) => box.id !== id);
    });

    if (selectedBoxId === id) {
      setSelectedBoxId(null);
    }
  }, [pushHistory, selectedBoxId]);

  const clearAllBoxes = useCallback(() => {
    setBoxes((prev) => {
      if (prev.length === 0) return prev;
      pushHistory(prev);
      return [];
    });
    clearSelectionAndInteraction();
  }, [clearSelectionAndInteraction, pushHistory]);

  const handleBoxInteractionStart = useCallback((e: React.MouseEvent, boxId: string, handle: 'tl' | 'tr' | 'bl' | 'br' | 'move') => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedBoxId(boxId);
    
    if (activeTool !== 'pointer') return;

    const box = boxes.find(b => b.id === boxId);
    if (!box) return;

    pushHistory(boxes);

    setResizing({
      boxId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: box.x,
      origY: box.y,
      origW: box.w,
      origH: box.h
    });
  }, [boxes, activeTool, pushHistory]);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const img = imgRef.current;
      if (!img) return;
      
      const rect = img.getBoundingClientRect();
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;
      
      const pctDx = (dx / rect.width) * 100;
      const pctDy = (dy / rect.height) * 100;

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id !== resizing.boxId) return b;

          let { x, y, w, h } = b;

          if (resizing.handle === 'move') {
            x = Math.max(0, Math.min(100 - resizing.origW, resizing.origX + pctDx));
            y = Math.max(0, Math.min(100 - resizing.origH, resizing.origY + pctDy));
          } else {
            const L = resizing.origX;
            const T = resizing.origY;
            const R = resizing.origX + resizing.origW;
            const B = resizing.origY + resizing.origH;

            if (resizing.handle === 'tl') {
              const proposedX = resizing.origX + pctDx;
              const proposedY = resizing.origY + pctDy;
              x = Math.max(0, Math.min(R - 2, proposedX));
              y = Math.max(0, Math.min(B - 2, proposedY));
              w = R - x;
              h = B - y;
            } else if (resizing.handle === 'tr') {
              const proposedR = R + pctDx;
              const proposedY = resizing.origY + pctDy;
              const r = Math.max(L + 2, Math.min(100, proposedR));
              y = Math.max(0, Math.min(B - 2, proposedY));
              x = L;
              w = r - L;
              h = B - y;
            } else if (resizing.handle === 'bl') {
              const proposedX = resizing.origX + pctDx;
              const proposedB = B + pctDy;
              x = Math.max(0, Math.min(R - 2, proposedX));
              const bVal = Math.max(T + 2, Math.min(100, proposedB));
              y = T;
              w = R - x;
              h = bVal - T;
            } else if (resizing.handle === 'br') {
              const proposedR = R + pctDx;
              const proposedB = B + pctDy;
              const r = Math.max(L + 2, Math.min(100, proposedR));
              const bVal = Math.max(T + 2, Math.min(100, proposedB));
              x = L;
              y = T;
              w = r - L;
              h = bVal - T;
            }
          }

          return { ...b, x, y, w, h };
        })
      );
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl =
    task.data?.url ||
    (typeof task.taskObject === 'object' && task.taskObject !== null
      ? task.taskObject.url || task.taskObject.data?.url
      : undefined) ||
    task.r2_url;

  // Resolve categories/labels from task context
  const payload = typeof task.taskObject === 'object' && task.taskObject !== null ? task.taskObject : task;
  
  let rawCategories: string[] =
    (payload as any).categories ||
    (payload as any).labels ||
    (payload as any).options ||
    task.categories ||
    task.labels ||
    task.options ||
    [];

  if (rawCategories.length === 0) {
    const isMedical =
      String(task.domain || '').toLowerCase().includes('medical') ||
      String(task.datasetName || '').toLowerCase().includes('medical') ||
      String(task.datasetName || '').toLowerCase().includes('bccd');
    rawCategories = isMedical
      ? ['Tumor', 'Lesion', 'Cyst', 'Healthy Tissue', 'Calcification']
      : ['Object', 'Feature', 'Region of Interest'];
  }

  // Strict label source: labels must come from task/protocol payload.
  const categories = Array.from(
    new Set(
      rawCategories
        .map((c) => String(c || "").trim())
        .filter(Boolean)
    )
  );

  const [activeLabel, setActiveLabel] = useState<string>(categories[0] || 'Object');

  useEffect(() => {
    setLoaded(false);
    setBoxes([]);
    setDrawing(null);
    setCurrentRect(null);
    setSelectedBoxId(null);
    setZoom(100);
    setPan({ x: 0, y: 0 });
  }, [imageUrl]);

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeLabel)) {
      setActiveLabel(categories[0]);
    }
  }, [categories, activeLabel]);

  useEffect(() => {
    onBoxesChange?.(boxes);
  }, [boxes, onBoxesChange]);

  const getRelativePos = useCallback((e: React.MouseEvent): { x: number; y: number } | null => {
    const img = imgRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // If not clicking a bounding box directly, clear selection
    if (e.target === containerRef.current || e.target === imgRef.current) {
      setSelectedBoxId(null);
    }

    if (activeTool === 'pointer' && zoom > 100) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (activeTool !== 'bbox' || !loaded || categories.length === 0) return;
    e.preventDefault();
    const pos = getRelativePos(e);
    if (!pos) return;
    setDrawing(pos);
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  }, [activeTool, loaded, getRelativePos, zoom, pan.x, pan.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && activeTool === 'pointer') {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }
    if (!drawing || activeTool !== 'bbox') return;
    const pos = getRelativePos(e);
    if (!pos) return;
    setCurrentRect({
      x: Math.min(drawing.x, pos.x),
      y: Math.min(drawing.y, pos.y),
      w: Math.abs(pos.x - drawing.x),
      h: Math.abs(pos.y - drawing.y),
    });
  }, [drawing, activeTool, getRelativePos, isPanning, panStart.x, panStart.y]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    if (!drawing || !currentRect) return;
    if (currentRect.w > 1 && currentRect.h > 1) {
      const newBox: BoundingBox = {
        id: `box-${Date.now()}`,
        ...currentRect,
        label: activeLabel,
      };
      setBoxes((prev) => {
        pushHistory(prev);
        return [...prev, newBox];
      });
      setSelectedBoxId(newBox.id);
    }
    setDrawing(null);
    setCurrentRect(null);
  }, [drawing, currentRect, activeLabel, isPanning, pushHistory]);

  const handleSelectCategory = (label: string) => {
    setActiveLabel(label);
    if (selectedBoxId) {
      setBoxes((prev) => {
        const selectedBox = prev.find((box) => box.id === selectedBoxId);
        if (!selectedBox || selectedBox.label === label) return prev;
        pushHistory(prev);
        return prev.map((box) => (box.id === selectedBoxId ? { ...box, label } : box));
      });
    }
  };

  const selectCategoryByIndex = useCallback((index: number) => {
    const label = categories[index];
    if (!label) return;
    handleSelectCategory(label);
  }, [categories]);

  useEffect(() => {
    historyRef.current = [];
    clearSelectionAndInteraction();
    setBoxes([]);
    setZoom(100);
    setPan({ x: 0, y: 0 });
  }, [imageUrl, clearSelectionAndInteraction]);

  useEffect(() => {
    if (shortcutsDisabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === 'z') {
          event.preventDefault();
          undoLastAction();
          return;
        }

        if (event.shiftKey && event.key.toLowerCase() === 'backspace') {
          event.preventDefault();
          clearAllBoxes();
          return;
        }
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        if (drawing || currentRect || resizing || isPanning) {
          clearSelectionAndInteraction();
        } else {
          setSelectedBoxId(null);
        }
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedBoxId) {
          event.preventDefault();
          deleteBoxById(selectedBoxId);
        }
        return;
      }

      const normalizedKey = event.key.toLowerCase();

      if (normalizedKey === 'b') {
        event.preventDefault();
        setActiveTool('bbox');
        return;
      }

      if (normalizedKey === 'p') {
        event.preventDefault();
        setActiveTool('pointer');
        return;
      }

      if (normalizedKey === 'f') {
        event.preventDefault();
        toggleFullscreen();
        return;
      }

      if (normalizedKey === '0') {
        event.preventDefault();
        resetViewport();
        return;
      }

      if (normalizedKey === '=' || normalizedKey === '+') {
        event.preventDefault();
        zoomIn();
        return;
      }

      if (normalizedKey === '-') {
        event.preventDefault();
        zoomOut();
        return;
      }

      if (/^[1-9]$/.test(normalizedKey)) {
        const index = Number(normalizedKey) - 1;
        if (categories[index]) {
          event.preventDefault();
          selectCategoryByIndex(index);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    categories,
    clearAllBoxes,
    clearSelectionAndInteraction,
    currentRect,
    deleteBoxById,
    drawing,
    isPanning,
    resetViewport,
    resizing,
    selectCategoryByIndex,
    selectedBoxId,
    shortcutsDisabled,
    toggleFullscreen,
    undoLastAction,
    zoomIn,
    zoomOut,
  ]);

  return (
    <div className={`relative flex flex-col bg-[#050505] ${isFullscreen ? 'fixed inset-0 z-[400]' : 'h-full w-full'}`}>
      {loaded && (
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20 max-w-[calc(100%-12rem)]">
          <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
            {selectedBoxId ? "Assign Class to Selected Region:" : "Active Class for BBox:"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isActive = activeLabel === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-mono font-bold uppercase tracking-widest transition-all active:scale-95 rounded-sm
                    ${isActive
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                      : 'border-zinc-800 text-zinc-500 bg-black/80 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                >
                  {isActive && <CheckCircle2 size={10} className="text-indigo-400" />}
                  {cat}
                </button>
              );
            })}
          </div>
          {categories.length === 0 && (
            <div className="text-[9px] font-mono text-amber-400/90 uppercase tracking-widest">
              No class labels provided in protocol payload.
            </div>
          )}
        </div>
      )}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          title="Pointer mode"
          onClick={() => setActiveTool('pointer')}
          className={`p-3 border transition-all shadow-xl ${
            activeTool === 'pointer'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:text-white hover:border-indigo-500'
          }`}
        >
          <MousePointer2 size={16} />
        </button>
        <button
          title="Draw bounding box"
          onClick={() => setActiveTool('bbox')}
          className={`p-3 border transition-all shadow-xl ${
            activeTool === 'bbox'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:text-white hover:border-indigo-500'
          }`}
        >
          <Square size={16} />
        </button>
        <button
          title="Zoom In"
          onClick={() => setZoom((z) => Math.min(400, z + 25))}
          className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-white hover:border-indigo-500 transition-all shadow-xl"
        >
          <ZoomIn size={16} />
        </button>
        <button
          title="Zoom Out"
          onClick={() => {
            const nextZoom = Math.max(100, zoom - 25);
            setZoom(nextZoom);
            if (nextZoom === 100) setPan({ x: 0, y: 0 });
          }}
          className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-white hover:border-indigo-500 transition-all shadow-xl"
        >
          <ZoomOut size={16} />
        </button>
        <button
          title="Toggle fullscreen"
          onClick={() => setIsFullscreen((f) => !f)}
          className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-white hover:border-indigo-500 transition-all shadow-xl"
        >
          <Maximize2 size={16} />
        </button>
        {boxes.length > 0 && (
          <button
            title="Clear all boxes"
            onClick={() => {
              setBoxes([]);
              setSelectedBoxId(null);
            }}
            className="p-3 bg-zinc-950 border border-rose-900/40 text-rose-600 hover:text-rose-400 hover:border-rose-500 transition-all shadow-xl"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-700" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-zinc-700" />
      </div>
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: activeTool === 'bbox' ? 'crosshair' : activeTool === 'pointer' && zoom > 100 ? 'grab' : 'default' }}
      >
        {!imageUrl ? (
          <div className="text-rose-500 font-mono text-xs flex items-center gap-2">
            <Scan className="animate-spin" size={14} /> [ Error: NO_ASSET_PROTOCOL_FOUND ]
          </div>
        ) : (
          <div 
            className={`relative transition-opacity duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 150ms ease-out',
            }}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Task Asset"
              className="max-h-[80vh] max-w-full object-contain border border-zinc-800 shadow-2xl shadow-indigo-500/10 select-none"
              onLoad={() => setLoaded(true)}
              draggable={false}
            />
            {loaded && (
              <>
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50" />
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50" />
              </>
            )}
            {boxes.map((box, i) => {
              const isSelected = selectedBoxId === box.id;
              return (
                <div
                  key={box.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBoxId(box.id);
                  }}
                  onMouseDown={(e) => {
                    if (activeTool === 'pointer') {
                      handleBoxInteractionStart(e, box.id, 'move');
                    }
                  }}
                  className={`absolute border-2 group cursor-pointer transition-shadow ${
                    isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-black shadow-[0_0_15px_rgba(99,102,241,0.5)]' : ''
                  }`}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                    borderColor: isSelected ? '#6366f1' : LABEL_COLORS[i % LABEL_COLORS.length].replace('0.7', '1'),
                    backgroundColor: isSelected ? 'rgba(99,102,241,0.15)' : LABEL_COLORS[i % LABEL_COLORS.length].replace('0.7', '0.08'),
                    pointerEvents: 'all',
                  }}
                >
                  <span
                    className="absolute -top-5 left-0 text-[9px] font-mono font-bold px-1.5 py-0.5 whitespace-nowrap"
                    style={{ backgroundColor: isSelected ? '#6366f1' : LABEL_COLORS[i % LABEL_COLORS.length].replace('0.7', '0.9'), color: '#fff' }}
                  >
                    {box.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoxById(box.id);
                      if (selectedBoxId === box.id) setSelectedBoxId(null);
                    }}
                    className="absolute -top-5 right-0 opacity-0 group-hover:opacity-100 text-[9px] font-mono px-1.5 py-0.5 bg-rose-600 text-white transition-opacity"
                  >
                    ✕
                  </button>

                  {isSelected && activeTool === 'pointer' && (
                    <>
                      {/* Corner Resize Handles */}
                      <div
                        onMouseDown={(e) => handleBoxInteractionStart(e, box.id, 'tl')}
                        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-indigo-600 rounded-full shadow-lg cursor-nwse-resize z-30 pointer-events-auto"
                      />
                      <div
                        onMouseDown={(e) => handleBoxInteractionStart(e, box.id, 'tr')}
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-indigo-600 rounded-full shadow-lg cursor-nesw-resize z-30 pointer-events-auto"
                      />
                      <div
                        onMouseDown={(e) => handleBoxInteractionStart(e, box.id, 'bl')}
                        className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-indigo-600 rounded-full shadow-lg cursor-nesw-resize z-30 pointer-events-auto"
                      />
                      <div
                        onMouseDown={(e) => handleBoxInteractionStart(e, box.id, 'br')}
                        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-indigo-600 rounded-full shadow-lg cursor-nwse-resize z-30 pointer-events-auto"
                      />
                    </>
                  )}
                </div>
              );
            })}
            {currentRect && currentRect.w > 0 && (
              <div
                className="absolute border-2 border-indigo-400 border-dashed bg-indigo-500/10 pointer-events-none"
                style={{
                  left: `${currentRect.x}%`,
                  top: `${currentRect.y}%`,
                  width: `${currentRect.w}%`,
                  height: `${currentRect.h}%`,
                }}
              />
            )}
          </div>
        )}
        {!loaded && imageUrl && (
          <div className="flex flex-col items-center gap-4 absolute">
            <div className="w-16 h-px bg-indigo-500/50 animate-pulse" />
            <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-[0.3em] animate-pulse">
              Synchronizing_Image_Buffer...
            </span>
            <div className="w-16 h-px bg-indigo-500/50 animate-pulse" />
          </div>
        )}
      </div>
      {loaded && (
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 font-mono z-20">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-zinc-900 px-4 py-2 rounded-sm shadow-lg">
            <Crosshair size={12} className="text-indigo-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Tool: <span className="text-white">{activeTool === 'bbox' ? 'BBox_Draw' : 'Pointer'}</span>
            </span>
            <div className="h-3 w-px bg-zinc-800" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Zoom: <span className="text-indigo-400">{zoom}%</span>
            </span>
            <div className="h-3 w-px bg-zinc-800" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Boxes: <span className="text-indigo-400">{boxes.length}</span>
            </span>
          </div>
          {activeTool === 'bbox' && (
            <p className="text-[9px] font-mono text-indigo-400/70 uppercase tracking-widest animate-pulse">
              Click and drag on the image to draw a box
            </p>
          )}
          {activeTool === 'pointer' && zoom > 100 && (
            <p className="text-[9px] font-mono text-emerald-400/70 uppercase tracking-widest">
              Click and drag to pan the image
            </p>
          )}
        </div>
      )}
    </div>
  );
};
