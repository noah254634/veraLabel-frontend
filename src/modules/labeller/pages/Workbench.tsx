import { useEffect, useState, useRef } from 'react';
import {
  Terminal, Zap, Info, ChevronRight, X,
  Maximize2, MousePointer2, Type, Image as ImageIcon,
  SkipForward, AlertTriangle, Activity, CheckCircle2,
  Database, ShieldCheck, Clock, Flag, XCircle
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { useTaskStore } from '../store/taskStore';
import { useLabelerStore } from '../store/labelerStore';
import { UnifiedRLHFStage } from './modes/RLHF';
import { ImageStage } from './modes/ImageStage';
import { TextStage } from './modes/TextStage';
import { AudioStage } from './modes/AudioStage';
import { isRlhfTask, resolveContentType, resolveLabellingMethod } from '../../../shared/utils/taskContext';
import { validateImageAnnotation } from '../../../shared/utils/annotationValidation';
import { ProtocolBriefing } from '../components/ProtocolBriefing';
import { api } from '../../../shared/types/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// ─── Flag corruption modal ───────────────────────────────────────────────────
const FLAG_REASONS = [
  "Prompt is in the wrong language",
  "Prompt contains harmful or unsafe content",
  "Both model responses are identical",
  "Task appears to be a duplicate",
  "Responses are not related to the prompt",
  "Other",
];

const FlagModal = ({
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  onSubmit: (reason: string, detail: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const [selected, setSelected] = useState('');
  const [detail, setDetail] = useState('');

  const canSubmit = selected && (selected !== 'Other' || detail.trim().length >= 10);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl font-mono">
      <div className="w-full max-w-lg bg-[#050505] border border-zinc-800 shadow-2xl shadow-rose-500/10 animate-in zoom-in-95 duration-200">
        <div className="border-b border-zinc-800 px-6 py-5 bg-black relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-rose-400 to-transparent" />
          <div className="flex items-center gap-3">
            <Flag size={16} className="text-rose-400" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Flag_Corruption</h2>
              <p className="text-[9px] text-zinc-500 mt-0.5">This task will be sent to admin review. You will be assigned the next task.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Select reason:</p>
            <div className="space-y-2">
              {FLAG_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelected(reason)}
                  className={`w-full text-left px-4 py-3 border text-[11px] font-mono transition-all
                    ${selected === reason
                      ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                >
                  {selected === reason ? '● ' : '○ '}{reason}
                </button>
              ))}
            </div>
          </div>

          {(selected === 'Other' || selected) && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                {selected === 'Other' ? 'Describe the issue (required):' : 'Additional context (optional):'}
              </label>
              <div className="border border-zinc-800 bg-black p-1">
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent p-3 text-white text-xs outline-none resize-none font-sans"
                  placeholder="Describe exactly what is wrong with this task..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-800 px-6 py-4 flex justify-between items-center bg-black">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest transition-all"
          >
            <XCircle size={14} /> Cancel
          </button>
          <button
            onClick={() => canSubmit && onSubmit(selected, detail)}
            disabled={!canSubmit || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all
              ${canSubmit && !isSubmitting
                ? 'bg-rose-600 text-white hover:bg-rose-500 active:scale-95'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm_Flag'}
            {!isSubmitting && <Flag size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Live timer hook ─────────────────────────────────────────────────────────
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4-hour rolling session

const useLiveTimer = () => {
  const startRef = useRef<number>(Date.now());
  const [remaining, setRemaining] = useState(SESSION_DURATION_MS);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const rem = Math.max(0, SESSION_DURATION_MS - elapsed);
      setRemaining(rem);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const isLow = remaining < 30 * 60 * 1000; // < 30 min

  return {
    display: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    isLow,
    isExpired: remaining === 0,
  };
};

// ─── Main Workbench ──────────────────────────────────────────────────────────
export const CustomWorkbench = () => {
  const {
    getMyActiveBatch,
    tasks,
    loading,
    fetchTaskPayload,
    submitTask,
    activeBatch
  } = useTaskStore();
  const { labeller } = useLabelerStore();
  const navigate = useNavigate();

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<any>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [briefingDismissed, setBriefingDismissed] = useState(false);
  const [checkedDirectives, setCheckedDirectives] = useState<Record<number, boolean>>({});
  const [selectedRubrics, setSelectedRubrics] = useState<Record<string, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [rationale, setRationale] = useState<string>('');
  const [tieJustification, setTieJustification] = useState<string>('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [antiPatternsCollapsed, setAntiPatternsCollapsed] = useState(false);
  // Bug #5 / #3 fix: capture classification label and bounding boxes from sub-stages
  const [classificationLabel, setClassificationLabel] = useState<string | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<any[]>([]);

  const timer = useLiveTimer();

  useEffect(() => {
    getMyActiveBatch();
  }, [getMyActiveBatch]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const firstPendingIndex = tasks.findIndex(
        t => t.status !== 'submitted' && t.status !== 'verified'
      );
      if (firstPendingIndex !== -1) {
        setActiveTaskIndex(firstPendingIndex);
      }
    }
  }, [tasks]);

  const currentTask = tasks?.[activeTaskIndex];
  const labellingMethod = resolveLabellingMethod(activeBatch, currentTask);
  const contentType = resolveContentType(currentTask, activeBatch);
  const showRlhfStage = isRlhfTask(activeBatch, currentTask);
  const taskPayload = (currentTask as any)?.taskObject && typeof (currentTask as any).taskObject === "object"
    ? (currentTask as any).taskObject
    : currentTask;
  const imageAllowedLabels =
    (taskPayload as any)?.categories ||
    (taskPayload as any)?.labels ||
    (taskPayload as any)?.options ||
    (currentTask as any)?.categories ||
    (currentTask as any)?.labels ||
    (currentTask as any)?.options ||
    protocol?.rubrics?.map((r: any) => r.tag) ||
    [];

  useEffect(() => {
    if (currentTask) {
      const id = currentTask.id || (currentTask as any)._id;
      fetchTaskPayload(id);
      setCheckedDirectives({});
      setSelectedRubrics({});
      setSelection(null);
      setRatings({});
      setRationale('');
      setTieJustification('');
      // Reset stage-specific annotation state on task change
      setClassificationLabel(null);
      setBoundingBoxes([]);
    }
  }, [currentTask, fetchTaskPayload]);

  useEffect(() => {
    const datasetId = (activeBatch as any)?.datasetId;
    if (!datasetId || briefingDismissed) return;

    api.get(`/instructions/dataset/${datasetId}`)
      .then(res => {
        const protocolData = res.data?.data || res.data;
        if (protocolData) {
          setProtocol(protocolData);
          setShowBriefing(true);
        } else {
          throw new Error("No protocol data found");
        }
      })
      .catch(() => {
        const method = resolveLabellingMethod(activeBatch);
        const domain =
          method === "rlhf"
            ? "RLHF"
            : contentType === "audio"
              ? "Audio"
              : contentType === "image" || contentType === "video"
                ? "Image"
                : "NLP";

        if (!domain) return;

        api.get(`/instructions?domain=${domain}`)
          .then(res => {
            let templates = [];
            if (res.data && res.data.data && Array.isArray(res.data.data.templates)) {
              templates = res.data.data.templates;
            } else if (res.data && Array.isArray(res.data.templates)) {
              templates = res.data.templates;
            } else if (Array.isArray(res.data)) {
              templates = res.data;
            }
            if (templates && templates.length > 0) {
              setProtocol({
                finalDirectives: templates[0].baseDirectives || [],
                rubrics: templates[0].rubrics || [],
                goldenExamples: templates[0].goldenExamples || [],
                edgeCases: templates[0].edgeCases || [],
                antiPatterns: templates[0].antiPatterns || [],
                languageRegion: templates[0].languageRegion,
                templateId: { name: templates[0].name, version: templates[0].version }
              });
              setShowBriefing(true);
            }
          })
          .catch(() => {});
      });
  }, [activeBatch]);

  const hasTasks = tasks.length > 0;
  const isLastTask = hasTasks && activeTaskIndex >= tasks.length - 1;
  const isBatchCompleted = activeBatch && activeBatch.completedTasks >= activeBatch.totalTasks;

  const handleSkip = () => {
    if (!hasTasks || isLastTask) return;
    setSelection(null);
    setActiveTaskIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const directivesList = protocol?.finalDirectives || [];
    const allDirectivesChecked = directivesList.length > 0
      ? directivesList.every((_: any, index: number) => !!checkedDirectives[index])
      : true;

    const scoringConfig = protocol?.scoringConfig;
    const isPreferenceRequired = scoringConfig?.taskTypes?.includes('Preference Ranking (A vs B)');
    const isScoringRequired = scoringConfig?.taskTypes?.includes('Dimensional Scoring (1-5)');
    const isRationaleRequired = scoringConfig?.requireRationale;
    const minLength = scoringConfig?.minLength || 20;
    const tieRequiresJustification = scoringConfig?.tieRequiresJustification !== false;

    if (isPreferenceRequired && !selection) {
      toast.error("MISSION_PROTOCOL: Output preference selection required before asset transfer.");
      return;
    }

    // Tie justification check
    if (selection === 'tie' && tieRequiresJustification && tieJustification.trim().length < 20) {
      toast.error("MISSION_PROTOCOL: Tie justification must be at least 20 characters.");
      return;
    }

    if (isScoringRequired) {
      const responses = currentTask?.responses || currentTask?.response || currentTask?.result?.responses || currentTask?.result?.response || currentTask?.data?.responses || currentTask?.data?.response || [];
      const normalizedCount = responses.length || 1;
      const dimensions = scoringConfig?.scoreDimensions || [];
      const expectedRatings = normalizedCount * dimensions.length;
      const actualRatingsCount = Object.keys(ratings).filter(k => !!ratings[k]).length;

      if (actualRatingsCount < expectedRatings) {
        toast.error("MISSION_PROTOCOL: All dimensional scoring criteria must be graded.");
        return;
      }
    }

    if (isRationaleRequired && rationale.trim().length < minLength) {
      toast.error(`MISSION_PROTOCOL: Linguistic rationale must be at least ${minLength} characters.`);
      return;
    }

    if (!allDirectivesChecked) {
      toast.error("MISSION_PROTOCOL: You must verify and check all guidelines directives.");
      return;
    }

    const requiresImageAnnotation = !showRlhfStage && (contentType === "image" || contentType === "video");
    if (requiresImageAnnotation) {
      const validation = validateImageAnnotation(boundingBoxes, imageAllowedLabels);
      if (!validation.ok) {
        toast.error(`MISSION_PROTOCOL: ${validation.error}`);
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      const taskId = currentTask.id || (currentTask as any)._id;
      const annotation = {
        preference: isPreferenceRequired ? selection : null,
        tieJustification: selection === 'tie' ? tieJustification : null,
        ratings: isScoringRequired ? ratings : {},
        rationale: isRationaleRequired ? rationale : "",
        rubrics: selectedRubrics,
        directives: checkedDirectives,
        // Bug #5: include classification label from TextStage
        classificationLabel: classificationLabel || null,
        // Bug #3: include bounding boxes from ImageStage
        boundingBoxes: boundingBoxes.length > 0 ? boundingBoxes : null,
        submittedAt: new Date().toISOString()
      };
      await submitTask(taskId, annotation);
      setSelection(null);
      if (activeTaskIndex < tasks.length - 1) {
        setActiveTaskIndex(prev => prev + 1);
      }
    } catch {
      // handled by store/toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlagSubmit = async (reason: string, detail: string) => {
    setIsFlagging(true);
    try {
      const taskId = currentTask?.id || (currentTask as any)?._id;
      await api.post(`/tasks/${taskId}/flag`, { reason, detail });
      toast.success("Task flagged — moving to next task.");
      setShowFlagModal(false);
      if (!isLastTask) {
        setActiveTaskIndex(prev => prev + 1);
        setSelection(null);
      }
    } catch {
      toast.error("Failed to flag task — please try again.");
    } finally {
      setIsFlagging(false);
    }
  };

  const [syncStage, setSyncStage] = useState(0);
  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setSyncStage(prev => (prev < 3 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#020203] flex flex-col items-center justify-center font-mono overflow-hidden">
        <div className="w-64 space-y-8 relative">
           <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase italic">
                {syncStage === 0 && "Handshaking_Node..."}
                {syncStage === 1 && "Fetching_Assets..."}
                {syncStage === 2 && "Syncing_Metadata..."}
                {syncStage === 3 && "Finalizing_Terminal..."}
              </span>
              <span className="text-[10px] text-zinc-700">{syncStage * 25 + 25}%</span>
           </div>
           <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
                style={{ width: `${syncStage * 25 + 25}%` }}
              />
           </div>
           <div className="space-y-1 opacity-40">
              <p className="text-[8px] text-zinc-500 tracking-tighter">{">> "} Veralabel_OS_v4.2.1-Prod</p>
              <p className="text-[8px] text-zinc-500 tracking-tighter">{">> "} SSL_SESSION_ESTABLISHED</p>
              {syncStage >= 1 && <p className="text-[8px] text-zinc-400 tracking-tighter">{">> "} DATA_STREAM_OPEN (BATCH_RSV)</p>}
           </div>
           <Activity className="absolute -top-16 left-1/2 -translate-x-1/2 text-indigo-500/20 animate-pulse" size={48} />
        </div>
      </div>
    );
  }

  // MISSION COMPLETE VIEW
  if (isBatchCompleted) {
    return (
      <div className="h-screen w-full bg-[#020203] flex flex-col items-center justify-center font-mono p-8 text-center animate-in fade-in zoom-in duration-1000">
        <div className="max-w-md w-full p-12 bg-black border border-zinc-900 shadow-2xl shadow-indigo-500/5 space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 space-y-6">
            <div className="h-20 w-20 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-white uppercase tracking-[0.5em] font-bold text-sm">Mission_Accomplished</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Node_Sync_Successful // Batch_ID: {activeBatch?.batchId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-900">
              <div className="text-left space-y-1">
                <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Assets_Finalized</span>
                <p className="text-xl text-white font-mono">{activeBatch?.totalTasks}</p>
              </div>
              <div className="text-left space-y-1">
                <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Contribution_Reward</span>
                <p className="text-xl text-emerald-500 font-mono">+${(activeBatch?.totalTasks * 0.42).toFixed(2)}</p>
              </div>
            </div>

            <button 
              onClick={() => window.location.href = '/labeller/work'}
              className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              Initialize_Next_Node
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasTasks) {
    return (
      <div className="h-screen w-full bg-[#020203] flex flex-col items-center justify-center font-mono p-8 text-center">
        <div className="p-12 border border-dashed border-zinc-900 space-y-6">
          <Terminal className="mx-auto text-zinc-800" size={40} />
          <h2 className="text-zinc-500 uppercase tracking-[0.4em] font-bold text-xs">Registry_Buffer_Empty</h2>
          <p className="text-[10px] text-zinc-700 max-w-xs mx-auto leading-relaxed italic">
            All active nodes are currently occupied. Check the global mission board for new available data streams.
          </p>
          <button 
            onClick={() => window.location.href = '/labeller/work'}
            className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all"
          >
            Return_To_Registry
          </button>
        </div>
      </div>
    );
  }

  const totalTasks = activeBatch?.totalTasks || 0;
  const completedTasks = activeBatch?.completedTasks || 0;
  const batchProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const antiPatterns: string[] = protocol?.antiPatterns || [];

  return (
    <div className="h-full min-h-0 w-full bg-[#020203] flex flex-col overflow-hidden text-zinc-300 font-sans">
      {showFlagModal && (
        <FlagModal
          onSubmit={handleFlagSubmit}
          onCancel={() => setShowFlagModal(false)}
          isSubmitting={isFlagging}
        />
      )}
      {showBriefing && protocol && !briefingDismissed && (
        <ProtocolBriefing
          protocol={protocol}
          onAccept={() => {
            setShowBriefing(false);
            setBriefingDismissed(true);
          }}
        />
      )}
      <header className="h-16 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0 relative z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/labeller/work')}
            className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest"
          >
            <X size={14} /> Terminate_Session
          </button>
          <div className="h-6 w-px bg-zinc-900" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest">
              Protocol // {currentTask?.taskType?.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-white italic tracking-tight">
              Asset_ID: #{currentTask?.taskId?.slice(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-6 border-r border-zinc-900">
             <div className="text-right">
                <p className="text-[9px] font-mono text-zinc-600 uppercase font-bold tracking-tighter">Current_Reward</p>
                <p className="text-emerald-500 font-mono font-bold text-sm">+${(activeTaskIndex * 0.42).toFixed(2)}</p>
             </div>
             <Zap size={16} className="text-amber-500 animate-pulse" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Queue_Sync</span>
            <span className="text-xs font-bold text-white tabular-nums">{activeTaskIndex + 1} / {tasks.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex overflow-hidden">
        <aside className="w-80 min-h-0 border-r border-zinc-900 bg-black p-8 flex flex-col gap-10 overflow-y-auto shrink-0">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500">
                <Database size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Batch_Telemetry</h3>
            </div>
            <div className="bg-[#050505] border border-zinc-900 p-4 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-600 uppercase">Synchronization</span>
                  <span className={batchProgress > 50 ? "text-emerald-500" : "text-amber-500"}>{batchProgress}%</span>
              </div>
              <ProgressBar progress={batchProgress} className="h-1" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Completed</p>
                  <p className="text-xs font-mono text-white">{completedTasks}</p>
                </div>
                <div>
                  <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Remaining</p>
                  <p className="text-xs font-mono text-white">{totalTasks - completedTasks}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center text-zinc-500">
              <div className="flex items-center gap-2">
                <Info size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Directives</h3>
              </div>
              {protocol && (
                <button
                  onClick={() => {
                    setShowBriefing(true);
                    setBriefingDismissed(false);
                  }}
                  className="text-[9px] font-mono text-indigo-400 hover:text-indigo-350 uppercase underline cursor-pointer"
                >
                  Review Guidelines
                </button>
              )}
            </div>
            {protocol?.finalDirectives && protocol.finalDirectives.length > 0 ? (
              <div className="space-y-3 bg-[#050505] border border-zinc-900 p-4">
                {protocol.finalDirectives.map((directive: string, index: number) => {
                  const isChecked = !!checkedDirectives[index];
                  return (
                    <label 
                      key={index} 
                      className={`flex items-start gap-3 cursor-pointer text-xs transition-colors select-none p-1 rounded-sm
                        ${isChecked ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setCheckedDirectives(prev => ({
                            ...prev,
                            [index]: !prev[index]
                          }));
                        }}
                        className="mt-0.5 rounded border-zinc-800 bg-black text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="leading-tight font-mono text-[9px] uppercase">
                        {directive}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-zinc-400 font-light italic">
                {showRlhfStage
                  ? "Compare both neural responses for accuracy, linguistic tone, and safety protocols."
                  : "Perform semantic segmentation or classification on the provided asset stream."}
              </p>
            )}
          </section>
          {antiPatterns.length > 0 && (
            <section className="space-y-3">
              <button
                onClick={() => setAntiPatternsCollapsed(p => !p)}
                className="w-full flex justify-between items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <XCircle size={14} className="text-rose-500" />
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500/80">Anti-Patterns</h3>
                </div>
                <span className="text-[9px] font-mono text-zinc-700 uppercase">
                  {antiPatternsCollapsed ? '▸ Show' : '▾ Hide'}
                </span>
              </button>
              {!antiPatternsCollapsed && (
                <div className="bg-rose-950/10 border border-rose-900/20 p-4 space-y-3 animate-in fade-in duration-200">
                  <p className="text-[8px] font-mono text-rose-500 uppercase tracking-widest font-bold">
                    ❌ Never do these:
                  </p>
                  {antiPatterns.map((ap, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-rose-600 text-[9px] shrink-0 mt-0.5">✕</span>
                      <p className="text-[9px] text-zinc-400 leading-relaxed font-mono">{ap}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <MousePointer2 size={14} />
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Active_Protocol</h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
              <ToolBtn icon={<ImageIcon size={14}/>} label="Visual" active={contentType === 'image' || contentType === 'video'} />
              <ToolBtn icon={<Type size={14}/>} label="Semantic" active={['text', 'code', 'document'].includes(contentType)} />
            </div>
          </section>
          
          <div className="mt-auto p-5 bg-zinc-950 border border-zinc-900 flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span className="text-zinc-600 uppercase">Integrity_Score</span>
                </div>
                <span className="text-white">
                  {labeller?.performance?.averageQualityScore != null
                    ? `${Number(labeller.performance.averageQualityScore).toFixed(1)}%`
                    : '—'}
                </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <Clock size={12} className={timer.isLow ? "text-rose-500" : "text-amber-500"} />
                  <span className="text-zinc-600 uppercase">Session_Time</span>
                </div>
                <span className={`font-bold tabular-nums ${timer.isLow ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                  {timer.display}
                </span>
            </div>
          </div>
        </aside>
        <div className="flex-1 min-h-0 relative bg-[#010101] overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            {showRlhfStage ? (
              <UnifiedRLHFStage
                task={currentTask as any}
                contentType={contentType}
                selection={selection}
                setSelection={setSelection}
                protocol={protocol}
                selectedRubrics={selectedRubrics}
                setSelectedRubrics={setSelectedRubrics}
                ratings={ratings}
                setRatings={setRatings}
                rationale={rationale}
                setRationale={setRationale}
                tieJustification={tieJustification}
                setTieJustification={setTieJustification}
              />
            ) : labellingMethod === 'classification' || labellingMethod === 'annotation' || labellingMethod === 'transcription' ? (
              contentType === 'image' || contentType === 'video' ? (
                <ImageStage
                  task={{
                    ...currentTask,
                    datasetName: activeBatch?.datasetId?.name || activeBatch?.datasetName || activeBatch?.datasetId?.title || (activeBatch as any)?.name,
                    domain: activeBatch?.datasetId?.domain || activeBatch?.domain || (activeBatch as any)?.domain,
                    categories: protocol?.rubrics?.map((r: any) => r.tag) || []
                  } as any}
                  onBoxesChange={setBoundingBoxes}
                />
              ) : contentType === 'audio' ? (
                <AudioStage task={currentTask as any} />
              ) : (
                <TextStage
                  task={currentTask as any}
                  onLabelSelect={setClassificationLabel}
                  selectedLabel={classificationLabel}
                />
              )
            ) : contentType === 'text' || contentType === 'code' || contentType === 'document' ? (
              <TextStage
                task={currentTask as any}
                onLabelSelect={setClassificationLabel}
                selectedLabel={classificationLabel}
              />
            ) : contentType === 'image' || contentType === 'video' ? (
              <ImageStage
                task={{
                  ...currentTask,
                  datasetName: activeBatch?.datasetId?.name || activeBatch?.datasetName || activeBatch?.datasetId?.title || (activeBatch as any)?.name,
                  domain: activeBatch?.datasetId?.domain || activeBatch?.domain || (activeBatch as any)?.domain,
                  categories: protocol?.rubrics?.map((r: any) => r.tag) || []
                } as any}
                onBoxesChange={setBoundingBoxes}
              />
            ) : contentType === 'audio' ? (
              <AudioStage task={currentTask as any} />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest animate-pulse">
                [ Protocol_Initialization_Failure ]
              </div>
            )}
          </div>
        </div>

      </main>
      <footer className="h-20 border-t border-zinc-900 bg-black flex items-center justify-between px-8 shrink-0 relative z-50">
        <div className="flex gap-8 items-center">
          <button
            onClick={() => setShowFlagModal(true)}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-rose-500 transition-all uppercase tracking-widest group"
          >
            <Flag size={14} className="group-hover:animate-bounce" /> Flag_Corruption
          </button>
          <button 
            onClick={handleSkip}
            disabled={isLastTask || isSubmitting}
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isLastTask || isSubmitting ? 'text-zinc-800 cursor-not-allowed' : 'text-zinc-600 hover:text-white'}`}
          >
            <SkipForward size={14} /> Skip_Asset
          </button>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end pr-8 border-r border-zinc-900">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-indigo-500" />
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] italic">Encryption_Tunnel_Stable</span>
              </div>
              <span className="text-[8px] text-zinc-800 font-mono uppercase">Node: 0x4f2..3a9 // Ping: 24ms</span>
           </div>
           
           {(() => {
             const scoringConfig = protocol?.scoringConfig;
             const isPreferenceRequired = scoringConfig?.taskTypes?.includes('Preference Ranking (A vs B)');
             const isScoringRequired = scoringConfig?.taskTypes?.includes('Dimensional Scoring (1-5)');
             const isRationaleRequired = scoringConfig?.requireRationale;
             const minLength = scoringConfig?.minLength || 20;
             const tieRequiresJustification = scoringConfig?.tieRequiresJustification !== false;

             const isPreferenceOk = !isPreferenceRequired || !!selection;
             const isTieOk = selection !== 'tie' || !tieRequiresJustification || tieJustification.trim().length >= 20;
             
             const responses = currentTask?.responses || currentTask?.response || currentTask?.result?.responses || currentTask?.result?.response || currentTask?.data?.responses || currentTask?.data?.response || [];
             const normalizedCount = responses.length || 1;
             const dimensions = scoringConfig?.scoreDimensions || [];
             const expectedRatings = normalizedCount * dimensions.length;
             const actualRatingsCount = Object.keys(ratings).filter(k => !!ratings[k]).length;
             
             const isScoringOk = !isScoringRequired || actualRatingsCount >= expectedRatings;
             const isRationaleOk = !isRationaleRequired || rationale.trim().length >= minLength;
             const requiresImageAnnotation = !showRlhfStage && (contentType === "image" || contentType === "video");
             const imageValidation = requiresImageAnnotation
               ? validateImageAnnotation(boundingBoxes, imageAllowedLabels)
               : { ok: true };
             const hasImageAnnotation = imageValidation.ok;

             const directivesList = protocol?.finalDirectives || [];
             const allDirectivesChecked = directivesList.length > 0
               ? directivesList.every((_: any, index: number) => !!checkedDirectives[index])
               : true;

             const isSubmitDisabled = isSubmitting || 
               (currentTask?.status === 'submitted') || 
               !isPreferenceOk || 
               !isTieOk ||
               !isScoringOk || 
               !isRationaleOk || 
               !hasImageAnnotation ||
               !allDirectivesChecked;

             return (
               <button 
                 onClick={handleSubmit}
                 disabled={isSubmitDisabled}
                 className={`px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden group
                   ${isSubmitDisabled
                     ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                     : 'bg-white text-black hover:bg-indigo-50 active:scale-95 shadow-indigo-500/10'}`}
               >
                  {isSubmitting ? (
                    <>Synchronizing... <Activity size={14} className="animate-spin" /></>
                  ) : currentTask?.status === 'submitted' ? (
                    <>Asset_Verified <CheckCircle2 size={14} /></>
                  ) : !isPreferenceOk ? (
                    <>Select_Preference <ChevronRight size={14} /></>
                  ) : !isTieOk ? (
                    <>Write_Tie_Reason <ChevronRight size={14} /></>
                  ) : !isScoringOk ? (
                    <>Rate_Dimensions <ChevronRight size={14} /></>
                  ) : !isRationaleOk ? (
                    <>Write_Rationale <ChevronRight size={14} /></>
                  ) : !hasImageAnnotation ? (
                    <>Draw_Annotation_Box <ChevronRight size={14} /></>
                  ) : !allDirectivesChecked ? (
                    <>Verify_Directives <ChevronRight size={14} /></>
                  ) : (
                    <>Commit_Asset_Transfer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
               </button>
             );
           })()}
        </div>
      </footer>
    </div>
  );
};

const ToolBtn = ({ icon, label, active }: any) => (
  <button className={`flex flex-col items-center justify-center p-5 transition-all bg-[#050505] hover:bg-[#080808] relative group
    ${active ? 'text-white' : 'text-zinc-600'}`}>
    {active && <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500" />}
    {icon}
    <span className="text-[8px] font-mono font-bold mt-2 uppercase tracking-tighter group-hover:text-zinc-400">{label}</span>
  </button>
);