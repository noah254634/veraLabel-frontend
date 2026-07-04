import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Mic, Square, Trash2, CheckCircle2,
  AlertTriangle, Volume2, Globe, Sparkles, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AudioCollectionStageProps {
  task: any;
  onAudioBlobChange: (blob: any | null) => void;
}

const TONE_OPTIONS = [
  { label: "Calm / Polite", value: "calm", color: "emerald" },
  { label: "Urgent / Anxious", value: "urgent", color: "amber" },
  { label: "Frustrated", value: "frustrated", color: "orange" },
  { label: "Angry / Demanding", value: "angry", color: "rose" },
];

export const AudioCollectionStage = ({
  task,
  onAudioBlobChange
}: AudioCollectionStageProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(false);

  // Rich metadata
  const [transcriptionText, setTranscriptionText] = useState('');
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isLinguisticRuleChecked, setIsLinguisticRuleChecked] = useState(false);
  const [isTranscriptionVerified, setIsTranscriptionVerified] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  // Extract constraints from task
  const expectedLanguage = task?.expectedLanguage || 'Swahili';
  const codeSwitchExpected = task?.codeSwitchExpected === true;

  const instructionText =
    task?.taskObject?.instructionText ||
    task?.taskObject?.instruction ||
    task?.taskObject?.prompt ||
    task?.instructionText ||
    task?.instruction ||
    null;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const compileAndEmit = async (
    blob: Blob | null,
    txt: string,
    tone: string | null,
    ruleChecked: boolean,
    txtVerified: boolean
  ) => {
    if (!blob) { onAudioBlobChange(null); return; }
    const isReady = txt.trim().length >= 10 && tone !== null && ruleChecked && txtVerified;
    if (!isReady) { onAudioBlobChange(null); return; }
    try {
      const base64Audio = await blobToBase64(blob);
      onAudioBlobChange({
        contentType: "audio",
        taskType: "collection",
        audioBase64: base64Audio,
        transcription: txt.trim(),
        selectedTone: tone,
        codeSwitchingUsed: codeSwitchExpected,
        languageUsed: expectedLanguage,
        deviceInfo: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recordedAt: new Date().toISOString(),
      });
    } catch {
      toast.error('Failed to encode audio. Please try again.');
      onAudioBlobChange(null);
    }
  };

  const startRecording = async () => {
    setMicPermissionError(false);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        audioBlobRef.current = blob;
        setAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
        await compileAndEmit(blob, transcriptionText, selectedTone, isLinguisticRuleChecked, isTranscriptionVerified);
      };

      recorder.start();
      setIsRecording(true);
      startTimer();
    } catch {
      setMicPermissionError(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    audioBlobRef.current = null;
    setIsPlayingPreview(false);
    setRecordingTime(0);
    onAudioBlobChange(null);
  };

  const togglePlayPreview = () => {
    const player = previewAudioRef.current;
    if (!player) return;
    if (isPlayingPreview) { player.pause(); setIsPlayingPreview(false); }
    else { player.play().catch(() => setIsPlayingPreview(false)); setIsPlayingPreview(true); }
  };

  const handleTextChange = async (val: string) => {
    setTranscriptionText(val);
    await compileAndEmit(audioBlobRef.current, val, selectedTone, isLinguisticRuleChecked, isTranscriptionVerified);
  };

  const handleToneChange = async (tone: string) => {
    setSelectedTone(tone);
    await compileAndEmit(audioBlobRef.current, transcriptionText, tone, isLinguisticRuleChecked, isTranscriptionVerified);
  };

  const handleRuleToggle = async (checked: boolean) => {
    setIsLinguisticRuleChecked(checked);
    await compileAndEmit(audioBlobRef.current, transcriptionText, selectedTone, checked, isTranscriptionVerified);
  };

  const handleVerificationToggle = async (checked: boolean) => {
    setIsTranscriptionVerified(checked);
    await compileAndEmit(audioBlobRef.current, transcriptionText, selectedTone, isLinguisticRuleChecked, checked);
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-[#050505] font-mono overflow-y-auto">

      {/* ── Constraint Badges ── */}
      <div className="flex flex-wrap gap-2 px-4 md:px-10 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-sm">
          <Mic size={12} className="text-indigo-400" />
          <span className="text-[10px] text-indigo-400 uppercase tracking-widest">Crowd_Collector</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
          <Globe size={12} className="text-emerald-400" />
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest">{expectedLanguage}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-sm ${
          codeSwitchExpected
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-600'
        }`}>
          <Sparkles size={12} />
          <span className="text-[10px] uppercase tracking-widest">
            {codeSwitchExpected ? 'Mixing_Expected' : 'Pure_Lang_Required'}
          </span>
        </div>
      </div>

      {/* ── Scenario Instruction Card ── */}
      <div className="mx-4 md:mx-10 mb-4 md:mb-6 p-4 md:p-6 bg-zinc-900/60 border border-zinc-800 rounded-sm shrink-0">
        <p className="text-[9px] text-indigo-400 uppercase tracking-[0.2em] font-bold mb-2.5">
          // Task_Scenario_Directives:
        </p>
        <p className="text-sm md:text-base text-zinc-200 font-sans font-light leading-relaxed">
          {instructionText || 'Review prompt details below and speak clearly to generate the audio asset.'}
        </p>
      </div>

      {/* ── Recorder Dashboard ── */}
      <div className="mx-4 md:mx-10 mb-4 md:mb-8 bg-black border border-zinc-800 rounded-sm relative overflow-hidden shrink-0">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-500/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-indigo-500/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-500/30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-500/30 pointer-events-none" />

        {isRecording && (
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none animate-pulse" />
        )}

        {audioUrl && (
          <audio
            ref={previewAudioRef}
            src={audioUrl}
            onEnded={() => setIsPlayingPreview(false)}
            onPause={() => setIsPlayingPreview(false)}
            onPlay={() => setIsPlayingPreview(true)}
          />
        )}

        <div className="flex flex-col items-center justify-center py-10 md:py-12 px-6 gap-6">
          {!audioUrl ? (
            /* ── Record State ── */
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl relative ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isRecording ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
                {isRecording && (
                  <span className="absolute -inset-3 rounded-full border border-rose-500/30 animate-ping pointer-events-none" />
                )}
              </button>
              <div className="text-center space-y-1">
                <div className={`text-2xl md:text-xl font-bold tabular-nums ${isRecording ? 'text-rose-400' : 'text-zinc-500'}`}>
                  {formatTime(recordingTime)}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  {isRecording ? 'SYSTEM_COLLECTING_STREAM...' : 'Tap microphone to start recording'}
                </p>
              </div>
            </>
          ) : (
            /* ── Review State ── */
            <>
              <div className="flex items-center gap-8">
                {/* Delete */}
                <button
                  onClick={deleteRecording}
                  className="w-14 h-14 md:w-12 md:h-12 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-rose-400 hover:border-rose-900 flex items-center justify-center transition-colors active:scale-95"
                  title="Discard & Re-record"
                >
                  <Trash2 size={18} />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlayPreview}
                  className="w-24 h-24 md:w-20 md:h-20 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-emerald-900/30"
                >
                  {isPlayingPreview
                    ? <Pause size={28} fill="currentColor" />
                    : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>

                {/* Confirmed check */}
                <div className="w-14 h-14 md:w-12 md:h-12 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={26} />
                </div>
              </div>
              <div className="text-center space-y-1">
                <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Volume2 size={12} /> RECORDING_SYNCHRONIZED
                </span>
                <p className="text-[9px] uppercase tracking-widest text-zinc-600">
                  Listen to preview then complete the checklist below
                </p>
              </div>
            </>
          )}

          {micPermissionError && (
            <div className="flex items-center gap-2 text-rose-500 text-[10px] uppercase">
              <AlertTriangle size={13} /> Mic_Access_Denied — enable microphone permissions
            </div>
          )}
        </div>
      </div>

      {/* ── Metadata Panel (shown only after recording) ── */}
      {audioUrl && (
        <div className="mx-4 md:mx-10 mb-8 border border-zinc-800 bg-black/40 rounded-sm space-y-6 p-5 md:p-8 animate-in slide-in-from-bottom duration-300">

          {/* Panel header */}
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-900">
            <MessageSquare className="text-indigo-400 shrink-0" size={15} />
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-200">
              Linguistic_Telemetry_Registration
            </h3>
          </div>

          {/* 1. Transcription */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Spoken Transcription *</span>
              <span className={`text-[10px] tabular-nums ${transcriptionText.trim().length >= 10 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {transcriptionText.trim().length} / 10 min
              </span>
            </div>
            <textarea
              value={transcriptionText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`Type word-for-word exactly what you just recorded in ${expectedLanguage}…`}
              rows={4}
              className="w-full bg-[#050505] border border-zinc-800 rounded-sm p-4 text-sm text-zinc-200 font-sans placeholder-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          {/* 2. Tone Selector */}
          <div className="space-y-3">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">
              Select the tone you used in this recording *
            </label>
            {/* 2×2 on mobile, 4 cols on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleToneChange(opt.value)}
                  className={`py-4 md:py-3 px-2 text-[11px] border rounded-sm text-center transition-all active:scale-95 ${
                    selectedTone === opt.value
                      ? 'bg-indigo-500/10 border-indigo-400 text-indigo-300'
                      : 'bg-[#050505] border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Verification checkboxes */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isLinguisticRuleChecked}
                onChange={(e) => handleRuleToggle(e.target.checked)}
                className="mt-0.5 w-5 h-5 shrink-0 accent-indigo-600"
              />
              <span className="text-[11px] md:text-xs text-zinc-400 leading-relaxed font-sans group-hover:text-zinc-200 transition-colors select-none">
                I confirm this recording is in <strong className="text-zinc-200">{expectedLanguage}</strong> and
                {' '}{codeSwitchExpected
                  ? <strong className="text-amber-400">includes code-switching / mixed language</strong>
                  : <strong className="text-emerald-400">contains no code-switching</strong>
                } as required.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isTranscriptionVerified}
                onChange={(e) => handleVerificationToggle(e.target.checked)}
                className="mt-0.5 w-5 h-5 shrink-0 accent-indigo-600"
              />
              <span className="text-[11px] md:text-xs text-zinc-400 leading-relaxed font-sans group-hover:text-zinc-200 transition-colors select-none">
                I confirm the typed transcription above matches my spoken audio word-for-word.
              </span>
            </label>
          </div>

          {/* Readiness indicator */}
          {(() => {
            const ready = transcriptionText.trim().length >= 10 && selectedTone && isLinguisticRuleChecked && isTranscriptionVerified;
            return ready ? (
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] uppercase tracking-widest pt-2 animate-in fade-in duration-200">
                <CheckCircle2 size={14} /> Telemetry_Complete — ready to commit
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};
