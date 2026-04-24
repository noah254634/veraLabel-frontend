import React, { useState, useRef, useEffect } from 'react';
import { Activity, Cpu, Fingerprint, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface TranscriptSegment {
  start: number; // seconds
  end: number;
  text: string;
  confidence?: number;
  flagged?: boolean;
}

export interface AudioTask {
  id: string;
  signal: string;
  taskType: 'AUDIO';
  audioUrl: string;
  transcriptSegments: TranscriptSegment[];
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
    duration?: number; // seconds
  };
}

const AudioTaskRenderer: React.FC<{ task: AudioTask }> = ({ task }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playSegment = (segment: TranscriptSegment) => {
    if (audioRef.current) {
      audioRef.current.currentTime = segment.start;
      audioRef.current.play();
      setIsPlaying(true);
      setSelectedSegment(task.transcriptSegments.indexOf(segment));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-zinc-600">
        <Fingerprint size={14} />
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em]">
          Signal_ID: <span className="text-rose-400">{task.signal}</span>
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-sm space-y-4">
          <audio ref={audioRef} src={task.audioUrl} />

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-[9px] font-mono text-zinc-500 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-zinc-500 w-12">
                {formatTime(duration || task.metadata?.duration || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-zinc-900 pt-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (audioRef.current) audioRef.current.volume = val;
                if (val > 0) setIsMuted(false);
              }}
              className="w-24 h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[9px] font-mono text-zinc-500 w-10">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Transcript_Segments</p>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {task.transcriptSegments.map((segment, idx) => (
              <button
                key={idx}
                onClick={() => playSegment(segment)}
                className={`p-4 text-left rounded-sm transition-all border text-[9px] group ${
                  selectedSegment === idx
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : segment.flagged
                    ? 'border-rose-500/50 bg-rose-500/5 text-zinc-400 hover:border-rose-400'
                    : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-indigo-500/30'
                }`}
              >
                <div className="font-mono font-bold uppercase mb-1 flex justify-between items-center">
                  <span>[{formatTime(segment.start)} - {formatTime(segment.end)}]</span>
                  {segment.flagged && <span className="text-[8px] text-rose-400">⚠ FLAGGED</span>}
                </div>
                <p className="italic text-[8px] opacity-80">"{segment.text}"</p>
                {segment.confidence !== undefined && (
                  <div className="mt-2 text-[8px] opacity-60 flex items-center gap-2">
                    <span>Confidence: {(segment.confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 border-t border-zinc-900 pt-12">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} className="text-indigo-500" /> AI_Diagnostic
          </p>
          <div className="p-6 bg-black border border-zinc-900 text-xs text-indigo-400/80 font-mono italic space-y-2 leading-relaxed">
            <div className="text-zinc-700">// Speech Analysis Report</div>
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
            {task.transcriptSegments.some(s => s.flagged) && (
              <div className="mt-4 pt-4 border-t border-zinc-900">
                <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest mb-2">⚠ Flagged_Segments: {task.transcriptSegments.filter(s => s.flagged).length}</p>
                <p className="text-[9px] text-zinc-500">Review marked segments for transcript accuracy issues</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTaskRenderer;
