import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, FastForward, VolumeX } from 'lucide-react';

export const ImageInspector = ({ src, annotations }) => (
  <div className="relative max-w-full max-h-full group">
    <img 
      src={src || "https://via.placeholder.com/800x600?text=Raw_Dataset_Image"} 
      className="max-w-full max-h-[70vh] object-contain border border-zinc-800"
      alt="Inspection Target"
    />
    {/* SVG Overlay for Annotations */}
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Box*/}
      <rect 
        x="20%" y="30%" width="15%" height="20%" 
        className="fill-indigo-500/20 stroke-indigo-500 stroke-2"
      />
      <text x="20%" y="28%" className="fill-indigo-500 font-mono text-[10px] font-bold uppercase">
        Object_Detected [98%]
      </text>
    </svg>
  </div>
);

export const AIReviewInspector = ({ prompt, response }) => (
  <div className="w-full h-full p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
    <div className="space-y-2">
      <p className="text-[9px] font-mono text-indigo-500 uppercase font-bold tracking-widest">// Input_Prompt</p>
      <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-300 text-sm italic font-serif">
        "How do I optimize a React useEffect hook for high-frequency data streams?"
      </div>
    </div>
    
    <div className="space-y-2">
      <p className="text-[9px] font-mono text-emerald-500 uppercase font-bold tracking-widest">// Labeller_Response_Optimization</p>
      <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-200 text-sm leading-relaxed">
        {/* i'll use  'react-diff-viewer' library */}
        <span className="bg-emerald-500/20 text-emerald-400 px-1">Optimization Note:</span> The labeller added a cleanup function and a debounce layer to prevent memory leaks during rapid state updates.
      </div>
    </div>
  </div>
);


export const AudioInspector = ({ src, transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full max-w-4xl p-8 space-y-8 animate-in fade-in duration-500">
      {/* 1. WAVEFORM VISUALIZER (Simulated for UI) */}
      <div className="relative h-32 w-full bg-zinc-950 border border-zinc-900 flex items-center justify-center overflow-hidden px-4">
        <div className="flex items-center gap-[2px] w-full h-full">
          {[...Array(60)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 bg-indigo-500/40 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
              style={{ height: `${Math.random() * 80 + 10}%` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rose-500 shadow-[0_0_10px_red] z-10" />
      </div>

      {/* 2. AUDIO CONTROLS */}
      <div className="flex items-center justify-between bg-black border border-zinc-900 p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="h-10 w-10 bg-white text-black flex items-center justify-center rounded-sm hover:bg-indigo-500 hover:text-white transition-all"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          
          <div className="space-y-1">
            <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">// Playback_Engine</p>
            <div className="flex gap-2">
              {[1, 1.5, 2].map(speed => (
                <button 
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${playbackSpeed === speed ? 'border-indigo-500 text-indigo-500' : 'border-zinc-800 text-zinc-600'}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-white tabular-nums">00:42 / 01:15</p>
          <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Temporal_Coord</p>
        </div>
      </div>

      {/* 3. TRANSCRIPTION PREVIEW */}
      <div className="space-y-3">
        <h3 className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
           <FastForward size={12} /> // Labeller_Transcript_Output
        </h3>
        <div className="p-6 bg-zinc-950 border border-zinc-900 text-zinc-300 text-sm leading-relaxed font-serif italic relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20" />
          "{transcript || "The subject initiated contact at 0900 hours, requesting technical intervention regarding the VeraLabel API handshake..."}"
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }} 
      />
    </div>
  );
};