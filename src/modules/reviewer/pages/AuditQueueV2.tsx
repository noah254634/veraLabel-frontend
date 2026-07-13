import { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, AlertTriangle, 
  Play, Clock, 
  Check, X, ThumbsUp, ThumbsDown, Code
} from 'lucide-react';
import { api } from '../../../shared/types/api';
import toast from 'react-hot-toast';
import { isRlhfTask, resolveContentType } from '../../../shared/utils/taskContext';
import { RlhfResponseContent } from '../../labeller/pages/modes/RlhfResponseContent';
import type { ContentType } from '../../../shared/utils/labellingProtocol';

interface BatchDetail {
  _id: string;
  batchId: string;
  taskType: string;
  contentType: string;
  labellingMethod: string;
  status: string;
  priority: number;
  datasetId?: {
    _id: string;
    name: string;
    description?: string;
  };
  totalTasks: number;
  completedTasks: number;
  submissionsCount: number;
}

interface SubmissionDetail {
  _id: string;
  taskId: string;
  taskType: string;
  status: string;
  priority: number;
  isCollection?: boolean;
  datasetId?: any;
  assignedTo?: {
    _id: string;
    userId?: {
      name: string;
      email: string;
    };
  }[];
}

interface TaskItem {
  _id: string;
  taskId: string;
  taskType: string;
  contentType?: string;
  priority: number;
  submissions: SubmissionDetail[];
}

interface TaskPayload {
  task: SubmissionDetail;
  taskObject: any;
  submissionObject: any;
  otherSubmissions?: any[];
}

const REJECTION_REASONS = [
  'Poor Quality',
  'Incorrect Label',
  'Ambiguous Task',
  'Language Issue',
  'Other'
];

const LABEL_COLORS = [
  'rgba(99,102,241,0.7)',
  'rgba(16,185,129,0.7)',
  'rgba(245,158,11,0.7)',
  'rgba(239,68,68,0.7)',
  'rgba(168,85,247,0.7)',
];

export const AuditReviewV2 = () => {
  const [batches, setBatches] = useState<BatchDetail[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Claimed Batch State
  const [activeBatch, setActiveBatch] = useState<BatchDetail | null>(null);
  const [batchTasks, setBatchTasks] = useState<TaskItem[]>([]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [activeSubmissionIndex, setActiveSubmissionIndex] = useState(0);
  
  // Audited states for submissions within the claimed batch
  const [auditedStates, setAuditedStates] = useState<{ [subId: string]: 'approved' | 'rejected' }>({});

  // Active review state
  const [taskPayload, setTaskPayload] = useState<TaskPayload | null>(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  
  // UI preferences
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    setImgDimensions(null);
  }, [taskPayload, activeSubmissionIndex]);

  // Fetch pending review batches
  const fetchPendingQueue = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviewer/pending?limit=100');
      const data = response.data?.data || response.data;
      setBatches(data.tasks || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load pending audit batches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  // Fetch specific submission assets from R2
  const fetchSubmissionDetails = async (sub: SubmissionDetail) => {
    if (!sub) return;
    try {
      setFetchingDetail(true);
      setTaskPayload(null);
      const response = await api.get(`/reviewer/task/${sub._id}`);
      const data = response.data?.data || response.data;
      setTaskPayload(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to stream task assets from R2.");
    } finally {
      setFetchingDetail(false);
    }
  };

  // Claim batch
  const handleClaimBatch = async (batch: BatchDetail) => {
    try {
      setLoading(true);
      const response = await api.post(`/reviewer/claim-batch/${batch._id}`);
      const data = response.data?.data || response.data;
      
      const claimedBatch = data.batch;
      const submissions: SubmissionDetail[] = data.submissions || [];
      
      const tasksMap: { [taskId: string]: TaskItem } = {};
      claimedBatch.tasks.forEach((task: any) => {
        tasksMap[task._id] = {
          _id: task._id,
          taskId: task.taskId,
          taskType: task.taskType || task.contentType || 'text',
          contentType: task.contentType,
          priority: task.priority || 0,
          submissions: []
        };
      });

      submissions.forEach(sub => {
        const taskId = typeof sub.taskId === 'object' ? (sub.taskId as any)._id : sub.taskId;
        if (tasksMap[taskId]) {
          tasksMap[taskId].submissions.push(sub);
        }
      });

      const groupedTasks = Object.values(tasksMap);
      if (groupedTasks.length === 0) {
        toast.error("Claimed batch has no tasks.");
        fetchPendingQueue();
        return;
      }

      const initialAudited: { [subId: string]: 'approved' | 'rejected' } = {};
      submissions.forEach(sub => {
        if (sub.status === 'approved' || sub.status === 'rejected') {
          initialAudited[sub._id] = sub.status;
        }
      });
      setAuditedStates(initialAudited);

      setActiveBatch(batch);
      setBatchTasks(groupedTasks);
      setActiveTaskIndex(0);
      setActiveSubmissionIndex(0);
      
      if (groupedTasks[0].submissions.length > 0) {
        fetchSubmissionDetails(groupedTasks[0].submissions[0]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to claim batch.");
      fetchPendingQueue();
    } finally {
      setLoading(false);
    }
  };

  // Release batch review lock
  const handleReleaseLock = async () => {
    if (!activeBatch) return;
    try {
      await api.post(`/reviewer/release-batch/${activeBatch._id}`);
    } catch (err) {
      console.warn("Failed to release batch lock: ", err);
    }
  };

  const handleBackToQueue = async () => {
    await handleReleaseLock();
    setActiveBatch(null);
    setBatchTasks([]);
    setTaskPayload(null);
    setAuditedStates({});
    fetchPendingQueue();
  };

  // Finalize full batch review
  const handleFinalizeBatchAudit = async () => {
    if (!activeBatch || submittingAction) return;
    try {
      setSubmittingAction(true);
      await api.post(`/reviewer/submit-batch/${activeBatch._id}`);
      toast.success("Batch review finalized successfully!");
      setActiveBatch(null);
      setBatchTasks([]);
      setTaskPayload(null);
      setAuditedStates({});
      fetchPendingQueue();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit batch audit.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleApprove = async () => {
    if (!activeBatch || batchTasks.length === 0 || submittingAction) return;
    const currentTask = batchTasks[activeTaskIndex];
    const currentSubmission = currentTask.submissions[activeSubmissionIndex];
    
    try {
      setSubmittingAction(true);
      await api.put(`/reviewer/approve/${currentSubmission._id}`, { comment: 'Approved by reviewer' });
      toast.success("Submission approved.");
      setAuditedStates(prev => ({ ...prev, [currentSubmission._id]: 'approved' }));
      autoNavigate(currentTask);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error approving submission.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!activeBatch || batchTasks.length === 0 || !rejectReason || submittingAction) return;
    if (rejectReason === 'Other' && !rejectNote.trim()) {
      toast.error("Note is required when 'Other' is selected.");
      return;
    }
    const currentTask = batchTasks[activeTaskIndex];
    const currentSubmission = currentTask.submissions[activeSubmissionIndex];

    try {
      setSubmittingAction(true);
      await api.put(`/reviewer/reject/${currentSubmission._id}`, {
        reason: rejectReason,
        suggestions: rejectNote ? [rejectNote] : []
      });
      toast.success("Submission rejected.");
      setAuditedStates(prev => ({ ...prev, [currentSubmission._id]: 'rejected' }));
      setShowRejectModal(false);
      setRejectReason('');
      setRejectNote('');
      autoNavigate(currentTask);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error rejecting submission.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const autoNavigate = (currentTask: TaskItem) => {
    if (activeSubmissionIndex < currentTask.submissions.length - 1) {
      const nextIdx = activeSubmissionIndex + 1;
      setActiveSubmissionIndex(nextIdx);
      fetchSubmissionDetails(currentTask.submissions[nextIdx]);
    } else if (activeTaskIndex < batchTasks.length - 1) {
      const nextTaskIdx = activeTaskIndex + 1;
      setActiveTaskIndex(nextTaskIdx);
      setActiveSubmissionIndex(0);
      fetchSubmissionDetails(batchTasks[nextTaskIdx].submissions[0]);
    }
  };

  const isTaskAudited = (task: TaskItem) => {
    return task.submissions.every(sub => auditedStates[sub._id] !== undefined);
  };

  const isBatchAudited = () => {
    return batchTasks.every(task => isTaskAudited(task));
  };

  useEffect(() => {
    return () => {
      if (activeBatch) {
        api.post(`/reviewer/release-batch/${activeBatch._id}`).catch(() => {});
      }
    };
  }, [activeBatch]);

  if (!activeBatch) {
    return (
      <div className="w-full min-h-screen bg-[#020203] p-8 font-sans text-zinc-500">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-[0.35em] font-bold">// Verification Gateway</span>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight leading-none">
              Audit Queue
            </h1>
            <p className="text-zinc-500 text-xs">
              Select a completed task batch to begin reviews.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 px-4 py-2.5 rounded-sm">
            <Clock size={13} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Completed Batches: {batches.length}</span>
          </div>
        </header>

        {loading && batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[30vh] space-y-3">
            <ActivityIcon className="animate-spin text-indigo-400" />
            <span className="text-[10px] uppercase font-mono tracking-widest">Loading pending queue...</span>
          </div>
        ) : batches.length === 0 ? (
          <div className="border border-dashed border-zinc-900 py-16 text-center rounded-sm max-w-sm mx-auto mt-12 space-y-4">
            <CheckCircle className="mx-auto text-zinc-800" size={28} />
            <h2 className="text-zinc-400 uppercase tracking-widest font-bold text-[10px]">Queue Empty</h2>
            <p className="text-[11px] text-zinc-600 italic">
              All batches have been audited.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-w-4xl">
            {batches.map((batch, idx) => (
              <div 
                key={batch._id} 
                onClick={() => handleClaimBatch(batch)}
                className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950 transition-all cursor-pointer group rounded-sm"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-mono text-zinc-600">#{idx + 1}</span>
                  <div>
                    <span className="text-[8px] font-mono text-zinc-600 uppercase font-bold tracking-wider">Batch ID</span>
                    <p className="text-xs font-mono font-bold text-zinc-200">{batch.batchId}</p>
                  </div>
                  <div className="h-6 w-px bg-zinc-900 hidden md:block" />
                  <div className="hidden md:block">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase font-bold tracking-wider">Dataset</span>
                    <p className="text-xs text-zinc-400">{batch.datasetId?.name || "Unassociated"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-zinc-500">
                    {batch.totalTasks} Tasks
                  </span>
                  <span className="text-[9px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-2 py-0.5 uppercase tracking-wide">
                    {batch.labellingMethod}
                  </span>
                  <Play size={11} className="text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ACTIVE AUDIT WORKBENCH
  return (
    <div className="w-full h-screen bg-[#020203] font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Top minimal navigation bar */}
      <nav className="shrink-0 px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/60 backdrop-blur-md relative z-10">
        <button
          onClick={handleBackToQueue}
          className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-zinc-500 hover:text-zinc-300 transition-all"
        >
          <ArrowLeft size={13} /> Exit
        </button>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-zinc-500 truncate max-w-[200px]">{activeBatch.datasetId?.name}</span>
          <span className="text-zinc-800">•</span>
          <span className="font-mono text-zinc-300">{activeBatch.batchId}</span>
        </div>

        <div className="text-[9px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-500 px-2 py-0.5 uppercase">
          {activeBatch.labellingMethod}
        </div>
      </nav>

      {/* Sleek top task selector stepper (Replaces the bulky left sidebar) */}
      <div className="shrink-0 bg-zinc-950/20 border-b border-zinc-900 px-6 py-3.5 flex items-center justify-between overflow-x-auto select-none">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase mr-3">Progress:</span>
          {batchTasks.map((task, idx) => (
            <button
              key={task._id}
              onClick={() => {
                setActiveTaskIndex(idx);
                setActiveSubmissionIndex(0);
                if (task.submissions.length > 0) {
                  fetchSubmissionDetails(task.submissions[0]);
                }
              }}
              className={`h-6 px-2.5 rounded-sm text-[10px] font-mono transition-all flex items-center gap-1.5 ${
                activeTaskIndex === idx
                  ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 font-bold'
                  : isTaskAudited(task)
                  ? 'border border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                  : 'border border-zinc-900 text-zinc-600 hover:text-zinc-400'
              }`}
            >
              #{idx + 1}
              {isTaskAudited(task) && <Check size={10} className="text-emerald-500 shrink-0" />}
            </button>
          ))}
        </div>
        
        {/* Consensus Operator Tabs inside the stepper for minimal header footprint */}
        {batchTasks[activeTaskIndex]?.submissions.length > 1 && (
          <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase mr-1">Consensus:</span>
            {batchTasks[activeTaskIndex].submissions.map((sub, idx) => {
              const auditState = auditedStates[sub._id];
              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setActiveSubmissionIndex(idx);
                    fetchSubmissionDetails(sub);
                  }}
                  className={`h-6 px-3 rounded-sm text-[9px] font-mono transition-all flex items-center gap-1.5 border ${
                    activeSubmissionIndex === idx
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                      : 'border-zinc-900 bg-zinc-950 text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    auditState === 'approved' ? 'bg-emerald-500' :
                    auditState === 'rejected' ? 'bg-rose-500' :
                    'bg-amber-500 animate-pulse'
                  }`} />
                  {sub.assignedTo?.[0]?.userId?.name || `Operator ${idx + 1}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main minimal workspace */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center min-h-0 bg-[#020203]">
        {fetchingDetail ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <ActivityIcon className="animate-spin text-indigo-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Streaming R2 assets...</span>
          </div>
        ) : taskPayload ? (
          <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col justify-center min-h-0">
            
            {/* Minimal Card Container */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-sm p-8 space-y-6 relative overflow-hidden">
              
              {/* Context Tag */}
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600 uppercase border-b border-zinc-900 pb-3">
                <span>Task context: {batchTasks[activeTaskIndex].taskId}</span>
                <span>modality: {batchTasks[activeTaskIndex].taskType}</span>
              </div>

              {/* R2 Input Render (Prompt / instruction / Scenario) */}
              <div className="space-y-1 bg-zinc-950/60 border border-zinc-900/60 p-5 rounded-sm">
                <span className="text-[8px] font-mono text-indigo-400/80 uppercase tracking-wider block">// Prompt</span>
                <div className="text-zinc-200 text-sm leading-relaxed font-light">
                  {taskPayload.task?.isCollection ? (
                    taskPayload.taskObject?.instructionText || taskPayload.taskObject?.instruction || taskPayload.taskObject?.prompt || JSON.stringify(taskPayload.taskObject)
                  ) : (
                    <>
                      {resolveContentType(batchTasks[activeTaskIndex]) === 'text' && !isRlhfTask(activeBatch, batchTasks[activeTaskIndex]) && (
                        taskPayload.taskObject?.content || taskPayload.taskObject?.prompt || JSON.stringify(taskPayload.taskObject)
                      )}
                      {resolveContentType(batchTasks[activeTaskIndex]) === 'image' && !isRlhfTask(activeBatch, batchTasks[activeTaskIndex]) && (
                        <div className="flex justify-center select-none py-2">
                          {taskPayload.taskObject?.imageUrl || taskPayload.taskObject?.image || taskPayload.taskObject?.url ? (
                            <div className="relative inline-block border border-zinc-900 rounded-sm overflow-hidden bg-black/60">
                              <img 
                                src={taskPayload.taskObject.imageUrl || taskPayload.taskObject.image || taskPayload.taskObject.url} 
                                alt="Verification Asset" 
                                className="max-h-[350px] object-contain rounded-sm"
                                onLoad={(e) => {
                                  const img = e.currentTarget;
                                  setImgDimensions({
                                    width: img.clientWidth,
                                    height: img.clientHeight,
                                    naturalWidth: img.naturalWidth,
                                    naturalHeight: img.naturalHeight
                                  });
                                }}
                              />
                              {taskPayload.submissionObject?.boundingBoxes && 
                               Array.isArray(taskPayload.submissionObject.boundingBoxes) && 
                               taskPayload.submissionObject.boundingBoxes.map((box: any, idx: number) => (
                                <div
                                  key={box.id || idx}
                                  className="absolute border-2 border-indigo-500 bg-indigo-500/10 pointer-events-none"
                                  style={{
                                    left: `${box.x}%`,
                                    top: `${box.y}%`,
                                    width: `${box.w}%`,
                                    height: `${box.h}%`
                                  }}
                                >
                                  <span className="absolute -top-4 left-0 text-[7px] font-mono bg-indigo-600 px-1 py-0.5 text-white whitespace-nowrap">
                                    {box.label || `Object ${idx + 1}`}
                                  </span>
                                </div>
                              ))}
                              {imgDimensions && taskPayload.submissionObject?.polygons && 
                               Array.isArray(taskPayload.submissionObject.polygons) && (
                                <svg
                                  className="absolute top-0 left-0 pointer-events-none"
                                  style={{
                                    width: imgDimensions.width,
                                    height: imgDimensions.height,
                                  }}
                                  viewBox={`0 0 ${imgDimensions.naturalWidth} ${imgDimensions.naturalHeight}`}
                                  preserveAspectRatio="none"
                                >
                                  {taskPayload.submissionObject.polygons.map((poly: any, idx: number) => {
                                    if (!poly.polygon || !Array.isArray(poly.polygon)) return null;
                                    const pointsStr = poly.polygon.map(([x, y]: [number, number]) => `${x},${y}`).join(' ');
                                    const color = LABEL_COLORS[idx % LABEL_COLORS.length];
                                    return (
                                      <polygon
                                        key={idx}
                                        points={pointsStr}
                                        fill={color.replace('0.7', '0.35')}
                                        stroke={color.replace('0.7', '1')}
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                      />
                                    );
                                  })}
                                </svg>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-rose-400">No image URL.</p>
                          )}
                        </div>
                      )}
                      {batchTasks[activeTaskIndex].taskType === 'audio' && (
                        <div className="space-y-3 py-1">
                          {(taskPayload.taskObject?.audioUrl || taskPayload.taskObject?.url || taskPayload.taskObject?.audio) ? (
                            <audio controls src={taskPayload.taskObject.audioUrl || taskPayload.taskObject.url || taskPayload.taskObject.audio} className="w-full" />
                          ) : (
                            <p className="text-[10px] text-rose-400">No Audio URL.</p>
                          )}
                          {taskPayload.taskObject?.transcript && (
                            <p className="text-xs text-zinc-500 italic">Expected: {taskPayload.taskObject.transcript}</p>
                          )}
                        </div>
                      )}
                      {isRlhfTask(activeBatch, batchTasks[activeTaskIndex]) && (
                        <div className="space-y-4">
                          <p className="text-xs text-zinc-300 bg-black/40 p-3 border border-zinc-900">{taskPayload.taskObject?.prompt}</p>
                          <div className="grid grid-cols-2 gap-4">
                            {(
                              taskPayload.taskObject?.responses ||
                              [
                                { content: taskPayload.taskObject?.responseA },
                                { content: taskPayload.taskObject?.responseB },
                              ]
                            )
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((resp: { content?: string }, idx: number) => (
                                <div key={idx} className="space-y-1">
                                  <span className="text-[8px] text-zinc-600 font-bold uppercase">Response {idx === 0 ? "A" : "B"}</span>
                                  <div className="bg-black/50 p-3 border border-zinc-900 rounded-sm">
                                    <RlhfResponseContent
                                      content={resp?.content || ""}
                                      contentType={resolveContentType(batchTasks[activeTaskIndex]) as ContentType}
                                      label={`Response ${idx === 0 ? "A" : "B"}`}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* R2 Output Render (Operator submission / Response) */}
              <div className="space-y-1 bg-zinc-950/60 border border-zinc-900/60 p-5 rounded-sm">
                <span className="text-[8px] font-mono text-emerald-400/80 uppercase tracking-wider block">// Operator Output</span>
                {taskPayload.submissionObject ? (
                  <div className="space-y-3">
                    {taskPayload.submissionObject.label !== undefined && (
                      <p className="text-sm font-mono font-bold text-zinc-100">{String(taskPayload.submissionObject.label)}</p>
                    )}
                    {taskPayload.submissionObject.selectedResponse !== undefined && (
                      <p className="text-sm font-mono text-zinc-100">Selected Response {taskPayload.submissionObject.selectedResponse}</p>
                    )}
                    {(taskPayload.submissionObject.audioBase64 || taskPayload.submissionObject.audio) && (
                      <div className="space-y-3 pt-1">
                        <audio 
                          controls 
                          src={taskPayload.submissionObject.audioBase64 || taskPayload.submissionObject.audio} 
                          className="w-full" 
                        />
                        {taskPayload.submissionObject.transcription && (
                          <p className="text-xs text-zinc-200 italic">"{taskPayload.submissionObject.transcription}"</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-[9px] font-mono text-zinc-500">
                          {taskPayload.submissionObject.selectedTone && (
                            <div>Tone: {taskPayload.submissionObject.selectedTone}</div>
                          )}
                          {taskPayload.submissionObject.languageUsed && (
                            <div>Language: {taskPayload.submissionObject.languageUsed}</div>
                          )}
                          {taskPayload.submissionObject.recordedAt && (
                            <div>Recorded: {new Date(taskPayload.submissionObject.recordedAt).toLocaleString()}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-zinc-600 text-xs italic py-2">
                    No external output payload found. Review metadata manually.
                  </div>
                )}
              </div>

              {/* Collapsable JSON Inspector (Hidden by default to avoid clutter) */}
              <div>
                <button 
                  onClick={() => setShowJsonInspector(!showJsonInspector)}
                  className="flex items-center gap-1 text-[8px] font-mono text-zinc-600 hover:text-zinc-400 uppercase font-bold tracking-wider"
                >
                  <Code size={10} /> {showJsonInspector ? 'Hide raw JSON data' : 'Inspect raw JSON data'}
                </button>
                {showJsonInspector && (
                  <pre className="text-[9px] text-zinc-500 font-mono bg-zinc-950 p-4 border border-zinc-900 overflow-x-auto mt-2 max-h-48 rounded-sm select-all">
                     {JSON.stringify(taskPayload.submissionObject, null, 2)}
                  </pre>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <AlertTriangle className="text-rose-500" size={20} />
            <span className="text-xs text-rose-400">Failed to render assets.</span>
          </div>
        )}
      </div>

      {/* Floating minimal audit control footer bar */}
      <footer className="shrink-0 p-5 border-t border-zinc-900 bg-zinc-950 flex justify-between items-center relative z-50">
        <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
          review session locked
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRejectModal(true)}
            disabled={submittingAction || fetchingDetail}
            className="flex items-center gap-1.5 px-5 py-2.5 border border-rose-500/40 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-sm text-[10px] font-mono uppercase transition-all disabled:opacity-50"
          >
            <ThumbsDown size={12} /> Reject
          </button>

          <button 
            onClick={handleApprove}
            disabled={submittingAction || fetchingDetail}
            className="flex items-center gap-1.5 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-[10px] font-mono uppercase transition-all disabled:opacity-50"
          >
            <ThumbsUp size={12} /> Approve &amp; Next
          </button>

          {isBatchAudited() && (
            <button 
              onClick={handleFinalizeBatchAudit}
              disabled={submittingAction}
              className="flex items-center gap-1.5 px-7 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-sm text-[10px] font-mono uppercase transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            >
              <CheckCircle size={12} /> Finalize Audit
            </button>
          )}
        </div>
      </footer>

      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#05070A] border border-zinc-900 w-full max-w-sm p-6 rounded-sm space-y-5 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] text-rose-500 uppercase tracking-widest font-mono font-bold block mb-1">// Rejection Reason</span>
                <h3 className="text-xs font-bold text-zinc-300 uppercase">Select disposition</h3>
              </div>
              <button 
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectNote(''); }}
                className="text-zinc-600 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {REJECTION_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={`p-2.5 text-left text-[9px] font-mono uppercase tracking-wider border transition-all rounded-sm flex justify-between items-center ${
                    rejectReason === reason 
                      ? 'border-rose-500 bg-rose-500/5 text-rose-400' 
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-350'
                  }`}
                >
                  {reason}
                  {rejectReason === reason && <Check size={11} />}
                </button>
              ))}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[8px] font-mono text-zinc-600 uppercase block block">
                Additional Notes {rejectReason !== 'Other' && '(Optional)'}
              </label>
              <textarea
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                placeholder={rejectReason === 'Other' ? "Provide notes detailing the rejection (Required)..." : "Provide optional notes for the operator..."}
                rows={3}
                className="w-full bg-black border border-zinc-800 focus:border-rose-500/50 p-2.5 text-xs text-zinc-300 outline-none rounded-sm font-mono placeholder:text-zinc-700 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectNote(''); }}
                className="flex-1 py-2.5 border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[9px] font-mono uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason || (rejectReason === 'Other' && !rejectNote.trim()) || submittingAction}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-mono uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default AuditReviewV2;
