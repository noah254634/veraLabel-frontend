import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw,
  Mic, Tag, CheckCircle2, Radio, AlertTriangle
} from 'lucide-react';

interface AudioStageProps {
  task: {
    r2_url?: string;
    data?: { url?: string };
    taskObject?: { url?: string; audioUrl?: string; data?: { url?: string } } | string;
    labellingMethod?: string;
    categories?: string[];
    labels?: string[];
    options?: string[];
    instruction?: string;
    prompt?: string;
    context?: string;
  };
  labellingMethod?: string;
  /** Called when user selects a classification label */
  onLabelSelect?: (label: string | null) => void;
  selectedLabel?: string | null;
  /** Called on every keystroke so Workbench can track transcription length */
  onTranscriptionChange?: (text: string) => void;
  transcriptionText?: string;
}

// Animated waveform bars
const WaveformBars = ({ isPlaying, progress }: { isPlaying: boolean; progress: number }) => {
  const BAR_COUNT = 80;
  const bars = Array.from({ length: BAR_COUNT });

  return (
    <div className="flex items-center justify-center gap-[4px] h-36 w-full">
      {bars.map((_, i) => {
        const normalizedPos = i / BAR_COUNT;
        const isFilled = normalizedPos <= progress;
        // Pseudo-random heights for visual interest
        const seed = Math.sin(i * 137.508) * 10000;
        const height = 20 + Math.abs((seed - Math.floor(seed)) * 60);

        return (
          <div
            key={i}
            style={{
              height: `${height}%`,
              animationDelay: `${(i % 8) * 80}ms`,
              animationDuration: `${600 + (i % 5) * 120}ms`,
              boxShadow: isFilled ? '0 0 8px rgba(99, 102, 241, 0.6)' : 'none',
            }}
            className={`w-[5px] rounded-full transition-all duration-300 shrink-0
              ${isFilled
                ? 'bg-indigo-500'
                : isPlaying
                  ? 'bg-zinc-700 animate-pulse'
                  : 'bg-zinc-800'
              }`}
          />
        );
      })}
    </div>
  );
};

// Main component
export const AudioStage = ({
  task,
  labellingMethod,
  onLabelSelect,
  selectedLabel,
  onTranscriptionChange,
  transcriptionText = '',
}: AudioStageProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [localSelected, setLocalSelected] = useState<string | null>(selectedLabel ?? null);

  // Sync controlled label from parent
  useEffect(() => {
    if (selectedLabel !== undefined) setLocalSelected(selectedLabel);
  }, [selectedLabel]);

  // Resolve audio URL from various payload shapes
  const audioUrl =
    task.data?.url ||
    (typeof task.taskObject === 'object' && task.taskObject !== null
      ? (task.taskObject as any).audioUrl ||
        (task.taskObject as any).url ||
        (task.taskObject as any).data?.url
      : undefined) ||
    task.r2_url;

  // Resolve labelling method: prop takes priority, then task payload
  const payload = typeof task.taskObject === 'object' && task.taskObject !== null
    ? task.taskObject as any
    : task;

  const resolvedMethod = (
    labellingMethod ||
    task.labellingMethod ||
    payload.labellingMethod ||
    ''
  ).toLowerCase();

  const isTranscription = resolvedMethod === 'transcription';
  const isClassification = resolvedMethod === 'classification';

  // Label options
  const rawCategories: string[] =
    payload.categories || payload.labels || payload.options ||
    task.categories || task.labels || task.options || [];

  // Instruction / prompt to display
  const instruction =
    payload.instruction || payload.prompt || task.instruction || task.prompt || null;

  // ── Playback handlers ──────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setLoadError(true));
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(prev => !prev);
  }, [isMuted]);

  const handleRestart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setHasEnded(false);
    audio.play().catch(() => setLoadError(true));
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  // ── Audio element event listeners ──────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setHasEnded(true); };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onError = () => setLoadError(true);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
    };
  }, [audioUrl]);

  // Reset player state when task changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasEnded(false);
    setLoadError(false);
  }, [audioUrl]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatTime = (secs: number) => {
    if (!isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  const handleLabelSelect = (label: string) => {
    setLocalSelected(label);
    onLabelSelect?.(label);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!audioUrl) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#050505]">
        <div className="text-center space-y-4 p-12 border border-rose-900/30 bg-rose-950/10">
          <AlertTriangle className="mx-auto text-rose-500" size={32} />
          <p className="text-rose-400 font-mono text-xs uppercase tracking-widest">
            [ Error: NO_AUDIO_PROTOCOL_FOUND ]
          </p>
          <p className="text-zinc-600 font-mono text-[9px]">
            No audio URL could be resolved from the task payload.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#050505] animate-in fade-in duration-500 overflow-y-auto">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />


      <div className="flex items-center gap-3 px-10 pt-10 pb-6 flex-wrap shrink-0">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20">
          <Radio size={14} className="text-indigo-400" />
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
            Type // Audio_Stream
          </span>
        </div>
        {isTranscription && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20">
            <Mic size={12} className="text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              Mode // Transcription
            </span>
          </div>
        )}
        {isClassification && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20">
            <Tag size={12} className="text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
              Mode // Classification
            </span>
          </div>
        )}
        {hasEnded && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              Playback // Complete
            </span>
          </div>
        )}
      </div>


      {instruction && (
        <div className="mx-10 mb-6 p-4 bg-zinc-900/60 border border-zinc-800 shrink-0">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">
            Task_Instruction:
          </p>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">{instruction}</p>
        </div>
      )}


      <div className="mx-10 mb-8 bg-black border border-zinc-800 p-8 relative overflow-hidden shrink-0 group">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-500/40" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-indigo-500/40" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-500/40" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-500/40" />

        {/* Subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/3 to-transparent pointer-events-none" />

        {/* Waveform */}
        <div className="relative z-10 mb-8">
          <WaveformBars isPlaying={isPlaying} progress={progress} />
        </div>

        {/* Progress bar */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="relative h-1 bg-zinc-800 rounded-full cursor-pointer mb-3 group/bar"
        >
          <div
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Scrub handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-indigo-500/40 opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between text-[9px] font-mono text-zinc-600 mb-8 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-center gap-6">
          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors"
            title="Restart"
          >
            <RotateCcw size={18} />
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={loadError}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl
              ${loadError
                ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                : isPlaying
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'
                  : 'bg-white text-black hover:bg-indigo-50 shadow-white/10'
              }`}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {loadError && (
          <p className="text-center text-[10px] font-mono text-rose-500 mt-4 uppercase tracking-widest">
            [ Audio_Load_Error: Stream unavailable ]
          </p>
        )}
      </div>


      {isTranscription && (
        <div className="mx-10 mb-8 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
              <Mic size={12} className="text-emerald-500" />
              Transcription_Output:
            </p>
            <span className={`text-[9px] font-mono tabular-nums transition-colors ${
              transcriptionText.trim().length >= 10
                ? 'text-emerald-500'
                : 'text-zinc-600'
            }`}>
              {transcriptionText.trim().length} chars
              {transcriptionText.trim().length < 10 && ' (min 10)'}
            </span>
          </div>
          <div className="border border-zinc-800 bg-black relative focus-within:border-indigo-500/50 transition-colors">
            <textarea
              value={transcriptionText}
              onChange={(e) => onTranscriptionChange?.(e.target.value)}
              rows={7}
              placeholder="Listen carefully, then type exactly what you hear. Punctuate naturally. Do not paraphrase..."
              className="w-full bg-transparent p-5 text-sm text-zinc-200 font-light leading-relaxed outline-none resize-none font-sans placeholder:text-zinc-700 placeholder:text-xs"
            />
            {transcriptionText.trim().length >= 10 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">
                  Ready
                </span>
              </div>
            )}
          </div>
          <p className="text-[9px] text-zinc-700 font-mono italic">
            Tip: You can replay the audio as many times as needed before committing your transcription.
          </p>
        </div>
      )}


      {isClassification && rawCategories.length > 0 && (
        <div className="mx-10 mb-8 space-y-3 shrink-0">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
            <Tag size={12} className="text-amber-500" />
            Assign_Label:
          </p>
          <div className="flex flex-wrap gap-2">
            {rawCategories.map((cat) => {
              const isActive = localSelected === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleLabelSelect(cat)}
                  className={`flex items-center gap-2 px-5 py-3 border text-[11px] font-mono font-bold uppercase tracking-widest transition-all active:scale-95
                    ${isActive
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                      : 'border-zinc-800 text-zinc-500 bg-black hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                >
                  {isActive && <CheckCircle2 size={12} className="text-indigo-400" />}
                  {cat}
                </button>
              );
            })}
          </div>
          {localSelected && (
            <p className="text-[9px] text-emerald-500 font-mono uppercase tracking-widest animate-in fade-in flex items-center gap-1.5">
              <CheckCircle2 size={10} />
              Label selected: {localSelected}
            </p>
          )}
        </div>
      )}

      {isClassification && rawCategories.length === 0 && (
        <div className="mx-10 mb-8 border border-amber-800/30 bg-amber-900/10 p-4 shrink-0">
          <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
            ⚠ Classification task — no label options found in task payload.
          </p>
        </div>
      )}


      <div className="mx-10 mb-10 mt-auto flex justify-between items-center opacity-30 shrink-0">
        <div className="flex gap-3">
          <div className="h-[2px] w-8 bg-indigo-500/50" />
          <div className="h-[2px] w-8 bg-zinc-800" />
          <div className="h-[2px] w-8 bg-zinc-800" />
        </div>
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
          Audio_Stream_Active
        </span>
      </div>
    </div>
  );
};
