import { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { Maximize2, MousePointer2, Square, Trash2, Scan, Crosshair, ZoomIn, ZoomOut, CheckCircle2, Plus, Minus, Brain, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface PointPrompt {
  id: string;
  x: number; // percentage of image width
  y: number; // percentage of image height
  isPositive: boolean;
}

interface BoundingBox {
  id: string;
  x: number; // percentage of image width
  y: number; // percentage of image height
  w: number;
  h: number;
  label: string;
  points?: PointPrompt[];
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
      embeddingUrl?: string;
    } | string;
    taskId: string;
    categories?: string[];
    labels?: string[];
    options?: string[];
    datasetName?: string;
    domain?: string;
    embeddingUrl?: string;
  };
  onBoxesChange?: (boxes: BoundingBox[]) => void;
  onPolygonsChange?: (polygons: any[]) => void;
  onDecodingChange?: (decoding: boolean) => void;
  shortcutsDisabled?: boolean;
  worker?: Worker;
  ref?: any;
}

type Tool = 'pointer' | 'bbox' | 'pos_click' | 'neg_click';

const LABEL_COLORS = [
  'rgba(99,102,241,0.7)',
  'rgba(16,185,129,0.7)',
  'rgba(245,158,11,0.7)',
  'rgba(239,68,68,0.7)',
  'rgba(168,85,247,0.7)',
];

const cloneBoxes = (list: BoundingBox[]) => list.map((box) => ({ ...box }));

const smoothPolygon = (points: number[][], iterations = 3, weight = 0.45): number[][] => {
  if (!points || points.length < 3) return points || [];
  let current = points.map(pt => [pt[0], pt[1]]);
  const N = current.length;
  
  for (let iter = 0; iter < iterations; iter++) {
    const next: number[][] = [];
    for (let i = 0; i < N; i++) {
      const prevPt = current[(i - 1 + N) % N];
      const currPt = current[i];
      const nextPt = current[(i + 1) % N];
      
      const smoothedX = currPt[0] * (1 - weight) + (prevPt[0] + nextPt[0]) * (weight / 2);
      const smoothedY = currPt[1] * (1 - weight) + (prevPt[1] + nextPt[1]) * (weight / 2);
      next.push([smoothedX, smoothedY]);
    }
    current = next;
  }
  return current;
};

export const ImageStage = ({ task, onBoxesChange, onPolygonsChange, onDecodingChange, shortcutsDisabled = false, worker: propWorker, ref }: ImageStageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [decoding, setDecoding] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);

  useImperativeHandle(ref, () => ({
    confirmBatchBoxes
  }));

  useEffect(() => {
    onDecodingChange?.(decoding);
  }, [decoding, onDecodingChange]);

  useEffect(() => {
    let timer: any;
    if (decoding) {
      timer = setTimeout(() => setIsBuffering(true), 150);
    } else {
      setIsBuffering(false);
    }
    return () => clearTimeout(timer);
  }, [decoding]);

  const [polygons, setPolygons] = useState<{ label: string; polygon: [number, number][] }[]>([]);

  useEffect(() => {
    onPolygonsChange?.(polygons);
  }, [polygons, onPolygonsChange]);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (propWorker) {
      workerRef.current = propWorker;
      return;
    }

    const worker = new Worker(new URL('../../workers/sam2.worker.ts', import.meta.url), { type: 'module' });
    
    worker.addEventListener("message", (e) => {
      const { type, error } = e.data;
      if (type === "ERROR") {
        console.error("SAM 2 Worker Error:", error);
        toast.error(`SAM 2 Worker Error: ${error}`);
      } else if (type === "INIT_SUCCESS") {
        console.log("SAM 2 Worker initialized successfully.");
      } else if (type === "WARMUP_START") {
        setIsWarmingUp(true);
      } else if (type === "WARMUP_COMPLETE") {
        setIsWarmingUp(false);
      }
    });

    worker.postMessage({ type: 'INIT' });
    workerRef.current = worker;
    
    return () => {
      worker.terminate();
    };
  }, [propWorker]);

  const decodeWithWorker = (payload: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) return reject(new Error("Worker not initialized"));
      
      const onMessage = (e: MessageEvent) => {
        const { type, results, error } = e.data;
        if (type === "DECODE_SUCCESS") {
          workerRef.current?.removeEventListener("message", onMessage);
          resolve(results);
        } else if (type === "ERROR") {
          workerRef.current?.removeEventListener("message", onMessage);
          reject(new Error(error));
        }
      };
      
      workerRef.current.addEventListener("message", onMessage);
      workerRef.current.postMessage({ type: "DECODE", payload });
    });
  };

  useEffect(() => {
    setPolygons([]);
  }, [boxes]);

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

  const confirmBatchBoxes = useCallback(async () => {
    if (boxes.length === 0 || decoding) return;
    const img = imgRef.current;
    if (!img) return;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const prompts = boxes.map(b => {
      const hasBox = b.w > 0 && b.h > 0;
      const box = hasBox ? [
        (b.x / 100) * naturalWidth,
        (b.y / 100) * naturalHeight,
        ((b.x + b.w) / 100) * naturalWidth,
        ((b.y + b.h) / 100) * naturalHeight
      ] : null;

      const points = b.points && b.points.length > 0 ? b.points.map(p => [
        (p.x / 100) * naturalWidth,
        (p.y / 100) * naturalHeight
      ]) : null;

      const point_labels = b.points && b.points.length > 0 ? b.points.map(p => p.isPositive ? 1 : 0) : null;

      return {
        box,
        points,
        point_labels
      };
    });

    const currentEmbeddingUrl =
      task.embeddingUrl ||
      (typeof task.taskObject === 'object' && task.taskObject !== null
        ? (task.taskObject as any).embeddingUrl
        : undefined);

    setDecoding(true);
    try {
      const payload = {
        embeddingUrl: currentEmbeddingUrl || "http://mock-embedding.npy",
        prompts
      };

      const results = await decodeWithWorker(payload);
      
      const confirmedPolys = results.map((res: any) => {
        const boxIdx = res.box_index;
        const box = boxes[boxIdx];
        const label = box ? box.label : "Lesion";
        return {
          label,
          polygon: smoothPolygon(res.polygon, 3, 0.45)
        };
      });
      
      setPolygons(confirmedPolys);
      toast.success("Masks decoded successfully in browser!");
    } catch (err: any) {
      console.error("Failed to decode batch masks:", err);
      toast.error(`Mask decoding failed: ${err.message}`);
    } finally {
      setDecoding(false);
    }
  }, [boxes, decoding, task, imgRef]);

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
    setError(null);
    setBoxes([]);
    setDrawing(null);
    setCurrentRect(null);
    setSelectedBoxId(null);
    setZoom(100);
    setPan({ x: 0, y: 0 });
  }, [imageUrl]);

  useEffect(() => {
    if (task?.taskObject && typeof task.taskObject === 'object' && task.taskObject !== null) {
      if ((task.taskObject as any).error) {
        setError((task.taskObject as any).error);
      }
    }
  }, [task]);

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
    const isAddingPoint = activeTool === 'pos_click' || activeTool === 'neg_click';
    // If not clicking a bounding box directly, clear selection (skip if adding point prompts to avoid deselection)
    if (!isAddingPoint && (e.target === containerRef.current || e.target === imgRef.current)) {
      setSelectedBoxId(null);
    }

    if (activeTool === 'pointer' && zoom > 100) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (!loaded || categories.length === 0) return;

    if (isAddingPoint) {
      e.preventDefault();
      const pos = getRelativePos(e);
      if (!pos) return;

      const newPoint = {
        id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: pos.x,
        y: pos.y,
        isPositive: activeTool === 'pos_click'
      };

      if (selectedBoxId) {
        setBoxes((prev) => {
          pushHistory(prev);
          return prev.map((box) => {
            if (box.id === selectedBoxId) {
              const pts = box.points || [];
              return {
                ...box,
                points: [...pts, newPoint]
              };
            }
            return box;
          });
        });
      } else {
        const newId = `box-${Date.now()}`;
        const newBox: BoundingBox = {
          id: newId,
          x: pos.x,
          y: pos.y,
          w: 0,
          h: 0,
          label: activeLabel,
          points: [newPoint]
        };
        setBoxes((prev) => {
          pushHistory(prev);
          return [...prev, newBox];
        });
        setSelectedBoxId(newId);
      }
      return;
    }

    if (activeTool !== 'bbox') return;
    e.preventDefault();
    const pos = getRelativePos(e);
    if (!pos) return;
    setDrawing(pos);
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  }, [activeTool, loaded, getRelativePos, zoom, pan.x, pan.y, selectedBoxId, activeLabel, pushHistory]);

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

      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        confirmBatchBoxes();
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

      if (normalizedKey === 'q') {
        event.preventDefault();
        setActiveTool('pos_click');
        return;
      }

      if (normalizedKey === 'w') {
        event.preventDefault();
        setActiveTool('neg_click');
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
    confirmBatchBoxes,
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
      {isWarmingUp && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 bg-black/90 p-8 rounded-2xl border border-rose-500/30 shadow-2xl shadow-rose-500/20">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-rose-500 animate-spin" />
            <div className="text-center">
              <h3 className="text-rose-400 font-mono text-sm tracking-widest uppercase mb-1">Compiling WebGPU</h3>
              <p className="text-zinc-500 text-xs max-w-[220px]">This one-time setup may take a minute. Please wait.</p>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(0.98); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes rotateNetwork {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseMask {
          0%, 100% { fill-opacity: 0.13; stroke-width: 1.8px; }
          50% { fill-opacity: 0.22; stroke-width: 2.3px; }
        }
      `}</style>
      
      {/* 1. Header Bar: Active Class Selector */}
      {loaded && (
        <div className="shrink-0 w-full bg-black border-b border-zinc-900/60 px-6 py-2.5 flex items-center justify-between z-20">
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
                  className={`flex items-center gap-1.5 px-3 py-1 border text-[9px] font-mono font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg
                    ${isActive
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                      : 'border-zinc-800 text-zinc-500 bg-[#080809]/80 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                >
                  {isActive && <CheckCircle2 size={10} className="text-indigo-400" />}
                  {cat}
                </button>
              );
            })}
          </div>
          {categories.length === 0 ? (
            <div className="text-[9px] font-mono text-amber-400/90 uppercase tracking-widest">
              No class labels provided.
            </div>
          ) : <div />}
        </div>
      )}

      {/* 2. Middle Row: Canvas & Right Toolbar */}
      <div className="flex-1 min-h-0 flex relative overflow-hidden">
        
        {/* Canvas Scroll Area */}
        <div
          ref={containerRef}
          className="flex-1 flex flex-col items-center justify-start relative overflow-y-auto py-12 px-12"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: activeTool === 'bbox' ? 'crosshair' : activeTool === 'pointer' && zoom > 100 ? 'grab' : 'default' }}
        >
          {/* Subtle background grids */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
            <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-750" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-zinc-750" />
          </div>

          {/* Floating AI Status Widget */}
          {loaded && !error && (
            <div className="absolute top-4 right-4 z-30 bg-[#09090b]/85 backdrop-blur-md border border-zinc-800/80 rounded-xl px-3 py-2 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/50 select-none">
              <div className="relative flex items-center justify-center">
                <div className={`absolute w-3.5 h-3.5 rounded-full ${decoding ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500/40 animate-pulse'}`} />
                <div className={`w-2 h-2 rounded-full relative z-10 ${decoding ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${decoding ? 'text-indigo-400' : 'text-emerald-400'}`}>
                  {decoding ? (isBuffering ? 'Buffering AI data...' : 'Segmenting Regions...') : 'Ready & Loaded'}
                </span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">SAM2_WebGPU_Active</span>
              </div>
              <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800 text-indigo-400">
                <Sparkles size={11} className={decoding ? 'animate-pulse' : ''} />
              </div>
            </div>
          )}

          {!imageUrl || error ? (
            <div className="my-auto text-rose-500 font-mono text-xs flex flex-col items-center gap-2 text-center p-8 border border-dashed border-rose-900/30 bg-rose-950/5 max-w-md">
              <Scan className="text-rose-500 animate-pulse" size={24} />
              <span className="font-bold uppercase tracking-wider">[ Error: Asset Protocol Failure ]</span>
              <span className="text-[10px] text-zinc-500 normal-case mt-1">{error || "No valid asset storage reference was found."}</span>
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
                key={`${task.taskId}_${imageUrl}`}
                ref={imgRef}
                src={imageUrl}
                alt="Task Asset"
                className="max-h-[90vh] max-w-full object-contain border border-zinc-800 shadow-2xl shadow-indigo-500/10 select-none"
                onLoad={() => {
                  setLoaded(true);
                  setError(null);
                }}
                onError={() => {
                  setError("Failed to load image asset. The resource may be missing or access denied.");
                }}
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

              {/* AI Scan & Decode Animation Overlay */}
              {decoding && (
                <div className="absolute inset-0 bg-indigo-950/25 backdrop-blur-[1px] rounded-lg overflow-hidden pointer-events-none z-30 flex flex-col items-center justify-center border border-indigo-500/30">
                  {/* Scanning Line */}
                  <div 
                    className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_15px_#6366f1,0_0_5px_#6366f1] opacity-80"
                    style={{
                      animation: 'scan 2.2s ease-in-out infinite',
                    }}
                  />
                  
                  {/* Tech/AI Crosshair Elements in Corners */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-400/80" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-400/80" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-400/80" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-400/80" />

                  {/* Center AI Illustration Card */}
                  <div 
                    className="bg-[#0b0c10]/95 border border-indigo-500/40 rounded-2xl p-5 flex flex-col items-center gap-3.5 shadow-[0_10px_30px_rgba(99,102,241,0.25)]"
                    style={{
                      animation: 'float 3s ease-in-out infinite',
                    }}
                  >
                    {/* Glow Rings behind Icon */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div 
                        className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5"
                        style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                      />
                      <div 
                        className="absolute w-12 h-12 rounded-full border border-dashed border-indigo-400/40"
                        style={{ animation: 'rotateNetwork 8s linear infinite' }}
                      />
                      <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                        <Brain size={18} className="animate-pulse" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center select-none">
                      <span className="text-[10px] font-mono font-black text-indigo-300 uppercase tracking-[0.25em]">
                        SAM 2 Segmenting
                      </span>
                      <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                        Decoding boundaries
                      </span>
                    </div>

                    <div className="flex items-center gap-1 h-3 mt-1">
                      <div className="w-[2px] h-3 bg-indigo-500 rounded animate-[pulse_0.6s_ease-in-out_infinite]" />
                      <div className="w-[2px] h-2.5 bg-indigo-400 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
                      <div className="w-[2px] h-3.5 bg-indigo-500 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.3s]" />
                      <div className="w-[2px] h-2.5 bg-indigo-400 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.45s]" />
                      <div className="w-[2px] h-2 bg-indigo-500 rounded animate-[pulse_0.6s_ease-in-out_infinite_0.6s]" />
                    </div>
                  </div>
                </div>
              )}
              {loaded && polygons.length > 0 && (
                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{
                    width: imgRef.current?.width || '100%',
                    height: imgRef.current?.height || '100%',
                  }}
                  viewBox={`0 0 ${imgRef.current?.naturalWidth || 100} ${imgRef.current?.naturalHeight || 100}`}
                  preserveAspectRatio="none"
                >
                  {polygons.map((poly, idx) => {
                    const pointsStr = poly.polygon.map(([x, y]) => `${x},${y}`).join(' ');
                    const color = LABEL_COLORS[idx % LABEL_COLORS.length];
                    return (
                      <polygon
                        key={idx}
                        points={pointsStr}
                        fill={color.replace('0.7', '0.13')}
                        stroke={color.replace('0.7', '1')}
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{
                          animation: 'pulseMask 3s ease-in-out infinite',
                          filter: `drop-shadow(0 0 3px ${color.replace('0.7', '0.5')})`
                        }}
                      />
                    );
                  })}
                </svg>
              )}
              {boxes.map((box, i) => {
                if (box.w === 0 && box.h === 0) return null;
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
              
              {/* Render Point Prompts (clicks) for all boxes */}
              {boxes.flatMap(box => (box.points || []).map(pt => ({ ...pt, boxId: box.id, label: box.label }))).map((pt) => {
                const isSelected = selectedBoxId === pt.boxId;
                return (
                  <div
                    key={pt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBoxId(pt.boxId);
                    }}
                    className={`absolute w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center cursor-pointer shadow-md select-none transition-all z-40 group
                      ${pt.isPositive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}
                      ${isSelected ? 'ring-2 ring-indigo-500 scale-125 z-50 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'opacity-70 hover:opacity-100'}
                    `}
                    style={{
                      left: `${pt.x}%`,
                      top: `${pt.y}%`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'all',
                    }}
                    title={`${pt.label} (${pt.isPositive ? 'Positive' : 'Negative'} click)`}
                  >
                    <span className="text-[9px] font-bold pointer-events-none flex items-center justify-center leading-none select-none">
                      {pt.isPositive ? '+' : '-'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoxes((prev) => {
                          pushHistory(prev);
                          const updated = prev.map((b) => {
                            if (b.id === pt.boxId) {
                              return {
                                ...b,
                                points: (b.points || []).filter((p) => p.id !== pt.id),
                              };
                            }
                            return b;
                          });
                          return updated.filter((b) => {
                            const isPointOnly = b.w === 0 && b.h === 0;
                            const hasPoints = b.points && b.points.length > 0;
                            return !(isPointOnly && !hasPoints);
                          });
                        });
                        
                        setTimeout(() => {
                          setBoxes((curr) => {
                            const exists = curr.some((b) => b.id === pt.boxId);
                            if (!exists && selectedBoxId === pt.boxId) {
                              setSelectedBoxId(null);
                            }
                            return curr;
                          });
                        }, 0);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-zinc-950 text-white text-[7px] w-3 h-3 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-rose-600 border border-zinc-800 transition-all z-50"
                      title="Remove point"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {!loaded && imageUrl && !error && (
            <div className="flex flex-col items-center gap-4 my-auto">
              <div className="w-16 h-px bg-indigo-500/50 animate-pulse" />
              <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-[0.3em] animate-pulse">
                Synchronizing_Image_Buffer...
              </span>
              <div className="w-16 h-px bg-indigo-500/50 animate-pulse" />
            </div>
          )}
        </div>

        {/* Dedicated Right Toolbar Column — overflow-y-auto so no buttons are ever clipped */}
        <div className="w-14 shrink-0 min-h-0 bg-black border-l border-zinc-900/60 py-3 flex flex-col gap-2 items-center z-20 overflow-y-auto">
          {/* Interaction Tools */}
          <div className="flex flex-col gap-1 w-10">
            <button
              title="Pointer mode (P)"
              onClick={() => setActiveTool('pointer')}
              className={`p-2 w-full rounded-lg transition-all flex items-center justify-center ${
                activeTool === 'pointer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <MousePointer2 size={13} />
            </button>
            <button
              title="Draw bounding box (B)"
              onClick={() => setActiveTool('bbox')}
              className={`p-2 w-full rounded-lg transition-all flex items-center justify-center ${
                activeTool === 'bbox'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Square size={13} />
            </button>
            <button
              title="Add Positive Prompt Click (Q)"
              onClick={() => setActiveTool('pos_click')}
              className={`p-2 w-full rounded-lg transition-all flex items-center justify-center ${
                activeTool === 'pos_click'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-emerald-500 hover:text-emerald-400 hover:bg-zinc-900/50'
              }`}
            >
              <Plus size={13} />
            </button>
            <button
              title="Add Negative Prompt Click (W)"
              onClick={() => setActiveTool('neg_click')}
              className={`p-2 w-full rounded-lg transition-all flex items-center justify-center ${
                activeTool === 'neg_click'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'text-rose-500 hover:text-rose-400 hover:bg-zinc-900/50'
              }`}
            >
              <Minus size={13} />
            </button>
          </div>

          <div className="h-px w-6 bg-zinc-800/60" />

          {/* View Controls */}
          <div className="flex flex-col gap-1 w-10">
            <button
              title="Zoom In"
              onClick={() => setZoom((z) => Math.min(400, z + 25))}
              className="p-2 w-full rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all flex items-center justify-center"
            >
              <ZoomIn size={13} />
            </button>
            <button
              title="Zoom Out"
              onClick={() => {
                const nextZoom = Math.max(100, zoom - 25);
                setZoom(nextZoom);
                if (nextZoom === 100) setPan({ x: 0, y: 0 });
              }}
              className="p-2 w-full rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all flex items-center justify-center"
            >
              <ZoomOut size={13} />
            </button>
            <button
              title="Toggle fullscreen"
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-2 w-full rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all flex items-center justify-center"
            >
              <Maximize2 size={13} />
            </button>
          </div>

          <div className="h-px w-6 bg-zinc-800/60" />

          {/* SAM2 Action Controls — always visible, disabled when no boxes */}
          <div className="flex flex-col gap-1 w-10">
            <button
              title={boxes.length === 0 ? "Draw a box first to run SAM2" : "Decode Masks with SAM2 (Spacebar)"}
              disabled={decoding || boxes.length === 0}
              onClick={confirmBatchBoxes}
              className={`p-2 w-full rounded-lg transition-all flex items-center justify-center ${
                boxes.length === 0
                  ? 'text-zinc-750 bg-zinc-900/10 cursor-not-allowed opacity-30'
                  : decoding
                    ? 'bg-zinc-900 text-indigo-400 cursor-wait border border-indigo-500/30'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-550/40 border border-indigo-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              <Sparkles size={13} className={decoding ? 'animate-spin text-indigo-400' : 'text-indigo-100'} />
            </button>
            <button
              title={boxes.length === 0 ? "No boxes to clear" : "Clear all boxes"}
              disabled={boxes.length === 0}
              onClick={() => {
                setBoxes([]);
                setSelectedBoxId(null);
              }}
              className={`p-2 w-full rounded-lg transition-all flex items-center justify-center ${
                boxes.length === 0
                  ? 'text-zinc-800 cursor-not-allowed opacity-40'
                  : 'text-rose-500 hover:text-rose-400 hover:bg-rose-950/20'
              }`}
            >
              <Trash2 size={13} />
            </button>
          </div>

        </div>
      </div>

      {/* 3. Footer Bar: Status Info */}
      {loaded && (
        <div className="shrink-0 w-full bg-black border-t border-zinc-900/60 px-6 py-2.5 flex items-center gap-3 font-mono z-20 text-[9px] text-zinc-500 uppercase tracking-widest">
          <Crosshair size={10} className="text-indigo-500" />
          <span>
            Tool: <span className="text-white">
              {activeTool === 'bbox' && 'BBox_Draw'}
              {activeTool === 'pointer' && 'Pointer'}
              {activeTool === 'pos_click' && 'Positive'}
              {activeTool === 'neg_click' && 'Negative'}
            </span>
          </span>
          <div className="h-3 w-px bg-zinc-800" />
          <span>
            Zoom: <span className="text-indigo-400">{zoom}%</span>
          </span>
          <div className="h-3 w-px bg-zinc-800" />
          <span>
            Regions: <span className="text-indigo-400">{boxes.length}</span>
          </span>
          <div className="h-3 w-px bg-zinc-800" />
          {activeTool === 'bbox' && (
            <span className="text-indigo-400/60 animate-pulse font-sans">
              Click & drag to draw bounding boxes
            </span>
          )}
          {activeTool === 'pointer' && zoom > 100 && (
            <span className="text-emerald-400/60 font-sans">
              Click & drag to pan viewport
            </span>
          )}
          {activeTool === 'pos_click' && (
            <span className="text-emerald-400/60 animate-pulse font-sans">
              Click to place positive prompt dots (Green)
            </span>
          )}
          {activeTool === 'neg_click' && (
            <span className="text-rose-400/60 animate-pulse font-sans">
              Click to place negative prompt dots (Red)
            </span>
          )}
        </div>
      )}

    </div>
  );
};
