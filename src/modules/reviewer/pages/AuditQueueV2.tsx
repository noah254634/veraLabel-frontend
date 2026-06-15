import { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, AlertTriangle, 
  Play, Clock, 
  Check, X, ThumbsUp, ThumbsDown, User
} from 'lucide-react';
import { api } from '../../../shared/types/api';
import toast from 'react-hot-toast';
import { isRlhfTask, resolveContentType } from '../../../shared/utils/taskContext';
import { RlhfResponseContent } from '../../labeller/pages/modes/RlhfResponseContent';
import type { ContentType } from '../../../shared/utils/labellingProtocol';

interface TaskDetail {
  _id: string;
  taskId: string;
  taskType: string;
  contentType?: string;
  labellingMethod?: string;
  status: string;
  priority: number;
  datasetId?: {
    _id: string;
    name: string;
    description?: string;
  };
  assignedTo?: {
    _id: string;
    userId?: {
      name: string;
      email: string;
    };
  }[];
}

interface GroupedTask {
  taskId: string;
  taskType: string;
  priority: number;
  datasetId?: {
    _id: string;
    name: string;
    description?: string;
  };
  submissions: TaskDetail[];
}

interface TaskPayload {
  task: TaskDetail;
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

export const AuditReviewV2 = () => {
  const [groupedTasks, setGroupedTasks] = useState<GroupedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupedTask, setSelectedGroupedTask] = useState<GroupedTask | null>(null);
  const [activeSubmissionIndex, setActiveSubmissionIndex] = useState(0);
  
  // Active review state
  const [taskPayload, setTaskPayload] = useState<TaskPayload | null>(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  
  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Fetch pending review tasks and group them
  const fetchPendingQueue = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviewer/pending?limit=100');
      const data = response.data?.data || response.data;
      const pendingSubmissions: TaskDetail[] = data.tasks || [];
      
      const groups: { [key: string]: GroupedTask } = {};
      pendingSubmissions.forEach(sub => {
        const tId = sub.taskId || sub._id;
        if (!groups[tId]) {
          groups[tId] = {
            taskId: tId,
            taskType: sub.taskType,
            priority: sub.priority || 0,
            datasetId: sub.datasetId,
            submissions: []
          };
        }
        groups[tId].submissions.push(sub);
      });
      
      const groupedList = Object.values(groups);
      groupedList.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      setGroupedTasks(groupedList);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load audit queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  // Fetch specific task details (input R2 + result R2)
  const fetchTaskDetails = async (task: TaskDetail) => {
    try {
      setFetchingDetail(true);
      setTaskPayload(null);
      const response = await api.get(`/reviewer/task/${task._id}`);
      const data = response.data?.data || response.data;
      setTaskPayload(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to stream task assets from R2.");
    } finally {
      setFetchingDetail(false);
    }
  };

  const handleSelectGroupedTask = (group: GroupedTask) => {
    setSelectedGroupedTask(group);
    setActiveSubmissionIndex(0);
    fetchTaskDetails(group.submissions[0]);
  };

  const handleBackToQueue = () => {
    setSelectedGroupedTask(null);
    setTaskPayload(null);
    setShowRejectModal(false);
    setRejectReason('');
    setRejectNote('');
    fetchPendingQueue(); // Reload queue
  };

  const handleApprove = async () => {
    if (!selectedGroupedTask || submittingAction) return;
    const currentSubmission = selectedGroupedTask.submissions[activeSubmissionIndex];
    try {
      setSubmittingAction(true);
      await api.put(`/reviewer/approve/${currentSubmission._id}`, { comment: 'Approved by reviewer' });
      toast.success("Submission Approved.");
      
      // Check if there are other pending submissions in this group
      const nextPendingIndex = selectedGroupedTask.submissions.findIndex(
        (s, idx) => idx !== activeSubmissionIndex && s.status === 'submitted'
      );
      if (nextPendingIndex !== -1) {
        setActiveSubmissionIndex(nextPendingIndex);
        fetchTaskDetails(selectedGroupedTask.submissions[nextPendingIndex]);
      } else {
        // Move to next grouped task in the queue
        const currentGroupIndex = groupedTasks.findIndex(g => g.taskId === selectedGroupedTask.taskId);
        if (currentGroupIndex !== -1 && currentGroupIndex < groupedTasks.length - 1) {
          handleSelectGroupedTask(groupedTasks[currentGroupIndex + 1]);
        } else {
          handleBackToQueue();
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error approving submission.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedGroupedTask || !rejectReason || submittingAction) return;
    if (rejectReason === 'Other' && !rejectNote.trim()) {
      toast.error("Note is required when 'Other' is selected.");
      return;
    }
    const currentSubmission = selectedGroupedTask.submissions[activeSubmissionIndex];

    try {
      setSubmittingAction(true);
      await api.put(`/reviewer/reject/${currentSubmission._id}`, {
        reason: rejectReason,
        suggestions: rejectNote ? [rejectNote] : []
      });
      toast.success("Submission Rejected.");
      setShowRejectModal(false);
      setRejectReason('');
      setRejectNote('');

      // Check if there are other pending submissions in this group
      const nextPendingIndex = selectedGroupedTask.submissions.findIndex(
        (s, idx) => idx !== activeSubmissionIndex && s.status === 'submitted'
      );
      if (nextPendingIndex !== -1) {
        setActiveSubmissionIndex(nextPendingIndex);
        fetchTaskDetails(selectedGroupedTask.submissions[nextPendingIndex]);
      } else {
        // Move to next grouped task in the queue
        const currentGroupIndex = groupedTasks.findIndex(g => g.taskId === selectedGroupedTask.taskId);
        if (currentGroupIndex !== -1 && currentGroupIndex < groupedTasks.length - 1) {
          handleSelectGroupedTask(groupedTasks[currentGroupIndex + 1]);
        } else {
          handleBackToQueue();
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error rejecting submission.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const getPriorityBadge = (p: number) => {
    if (p > 5) return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    if (p > 2) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  };

  if (!selectedGroupedTask) {
    return (
      <div className="w-full min-h-screen bg-[#020408] p-8 font-mono text-slate-500">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div className="space-y-2">
            <span className="text-[9px] text-indigo-500 uppercase tracking-[0.4em] font-bold">// Operational_Registry</span>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-none italic">
              Active Audit Queue
            </h1>
            <p className="text-zinc-500 text-xs max-w-2xl">
              Verification queue containing submissions pending operational review. Grouped by core task node.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 p-3 rounded-sm">
            <Clock size={14} className="text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Grouped Tasks: {groupedTasks.length}</span>
          </div>
        </header>

        {loading && groupedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
            <ActivityIcon className="animate-spin text-indigo-500" />
            <span className="text-xs uppercase tracking-[0.2em]">Querying pending registry...</span>
          </div>
        ) : groupedTasks.length === 0 ? (
          <div className="border border-dashed border-zinc-900 p-16 text-center rounded-sm max-w-md mx-auto mt-12 space-y-6">
            <CheckCircle className="mx-auto text-zinc-700" size={32} />
            <h2 className="text-zinc-400 uppercase tracking-widest font-bold text-xs">Registry Clear</h2>
            <p className="text-[10px] text-zinc-600 leading-relaxed italic">
              No tasks currently require verification. Telemetry channel is stable.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-5xl">
            {groupedTasks.map((group, idx) => (
              <div 
                key={group.taskId} 
                onClick={() => handleSelectGroupedTask(group)}
                className="flex items-center justify-between p-4 bg-[#05070A] border border-slate-900 hover:border-indigo-500/40 hover:bg-black transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">Index</span>
                    <p className="text-xs text-zinc-500">#{idx + 1}</p>
                  </div>
                  <div className="h-6 w-px bg-zinc-900" />
                  <div>
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">Task ID</span>
                    <p className="text-xs font-bold text-white tracking-tight">{group.taskId}</p>
                  </div>
                  <div className="h-6 w-px bg-zinc-900 hidden md:block" />
                  <div className="hidden md:block">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">Dataset</span>
                    <p className="text-xs text-zinc-400">{group.datasetId?.name || "Unassociated"}</p>
                  </div>
                  <div className="h-6 w-px bg-zinc-900 hidden md:block" />
                  <div className="hidden md:block">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">Submissions</span>
                    <p className="text-xs text-indigo-400 font-bold">{group.submissions.length} Pending</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`px-2 py-0.5 border rounded-sm text-[8px] font-bold uppercase tracking-tighter ${getPriorityBadge(group.priority || 0)}`}>
                    P: {group.priority || 0}
                  </span>
                  <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 uppercase">
                    {group.taskType}
                  </span>
                  <Play size={12} className="text-zinc-700 group-hover:text-indigo-500 transition-colors" />
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
    <div className="w-full h-screen bg-[#020408] font-mono flex flex-col animate-in fade-in duration-500">
      <nav className="shrink-0 p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/60 backdrop-blur-md">
        <button
          onClick={handleBackToQueue}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all"
        >
          <ArrowLeft size={14} /> Back_To_Queue
        </button>

        <div className="flex items-center gap-6">
          <div className="text-[10px] text-zinc-400 uppercase">
            Dataset: <span className="text-indigo-400 font-bold">{selectedGroupedTask.datasetId?.name || "Unassociated"}</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="text-[10px] font-bold text-zinc-300">
            Task ID: #{selectedGroupedTask.taskId}
          </div>
        </div>

        <div className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 uppercase">
          {selectedGroupedTask.taskType}
        </div>
      </nav>

      {selectedGroupedTask.submissions.length > 1 && (
        <div className="flex gap-2 p-2 bg-zinc-950/80 border-b border-zinc-900 overflow-x-auto shrink-0 select-none">
          {selectedGroupedTask.submissions.map((sub, idx) => (
            <button
              key={sub._id}
              onClick={() => {
                setActiveSubmissionIndex(idx);
                fetchTaskDetails(sub);
              }}
              className={`px-4 py-2 border rounded-sm font-mono text-[9px] font-bold uppercase transition-all flex items-center gap-2 ${
                activeSubmissionIndex === idx
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-zinc-800 bg-black text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <User size={10} />
              {sub.assignedTo?.[0]?.userId?.name || `Operator ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <aside className="w-72 border-r border-zinc-900 bg-black/60 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto">
          <div className="space-y-2">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">Labeller Operator</span>
            <div className="p-3 bg-[#05070A] border border-zinc-900 rounded-sm flex items-center gap-3">
              <User size={14} className="text-indigo-400" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate">
                  {selectedGroupedTask.submissions[activeSubmissionIndex]?.assignedTo?.[0]?.userId?.name || "Operator"}
                </p>
                <p className="text-[8px] text-zinc-600 truncate">
                  {selectedGroupedTask.submissions[activeSubmissionIndex]?.assignedTo?.[0]?.userId?.email || "No Email"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">Dataset Specifications</span>
            <p className="text-[10px] text-zinc-400 leading-relaxed italic">
              {selectedGroupedTask.datasetId?.description || "No specifications defined for this dataset node."}
            </p>
          </div>

          {taskPayload?.task?.priority !== undefined && (
            <div className="space-y-1">
              <span className="text-[8px] text-zinc-600 font-bold uppercase">Priority Code</span>
              <p className="text-xs text-white">Level: {taskPayload.task.priority}</p>
            </div>
          )}
        </aside>
        
        <main className="flex-1 bg-[#010101] p-10 overflow-y-auto flex flex-col">
          {fetchingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ActivityIcon className="animate-spin text-indigo-500" />
              <span className="text-[10px] uppercase tracking-widest text-zinc-600">Streaming R2 Assets...</span>
            </div>
          ) : taskPayload ? (
            <div className="flex-1 flex flex-col gap-10 max-w-4xl w-full mx-auto">
              <div className="space-y-4">
                <h3 className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-900 pb-2">
                  // Input Telemetry (R2)
                </h3>
                <div className="bg-[#05070A] border border-zinc-900 p-6 rounded-sm space-y-4">
                  {resolveContentType(selectedGroupedTask.submissions[activeSubmissionIndex]) === 'text' && !isRlhfTask(null, selectedGroupedTask.submissions[activeSubmissionIndex]) && (
                    <p className="text-sm text-zinc-300 leading-relaxed font-light">
                      {taskPayload.taskObject?.content || taskPayload.taskObject?.prompt || JSON.stringify(taskPayload.taskObject)}
                    </p>
                  )}
                  {resolveContentType(selectedGroupedTask.submissions[activeSubmissionIndex]) === 'image' && !isRlhfTask(null, selectedGroupedTask.submissions[activeSubmissionIndex]) && (
                    <div className="flex flex-col items-center gap-4">
                      {taskPayload.taskObject?.imageUrl || taskPayload.taskObject?.image || taskPayload.taskObject?.url ? (
                        <div className="relative inline-block border border-zinc-800 rounded-sm overflow-hidden bg-black select-none">
                          <img 
                            src={taskPayload.taskObject.imageUrl || taskPayload.taskObject.image || taskPayload.taskObject.url} 
                            alt="Verification Asset" 
                            className="max-h-[500px] object-contain rounded-sm"
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
                              <span className="absolute -top-5 left-0 text-[8px] font-mono bg-indigo-600 px-1.5 py-0.5 text-white whitespace-nowrap">
                                {box.label || `Object ${idx + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-rose-400">No Image URL in metadata.</p>
                      )}
                    </div>
                  )}
                  {selectedGroupedTask.taskType === 'audio' && (
                    <div className="space-y-4">
                      {taskPayload.taskObject?.audioUrl ? (
                        <audio controls src={taskPayload.taskObject.audioUrl} className="w-full" />
                      ) : (
                        <p className="text-[10px] text-rose-400">No Audio URL in metadata.</p>
                      )}
                      {taskPayload.taskObject?.transcript && (
                        <p className="text-xs text-zinc-400 italic">Expected Transcript: {taskPayload.taskObject.transcript}</p>
                      )}
                    </div>
                  )}
                  {isRlhfTask(null, selectedGroupedTask.submissions[activeSubmissionIndex]) && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[8px] text-indigo-400 font-bold uppercase">Prompt</span>
                        <p className="text-xs text-zinc-300 bg-black p-3 border border-zinc-900">{taskPayload.taskObject?.prompt}</p>
                      </div>
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
                              <span className="text-[8px] text-zinc-600 font-bold uppercase">
                                Response {idx === 0 ? "A" : "B"}
                              </span>
                              <div className="bg-black p-3 border border-zinc-900">
                                <RlhfResponseContent
                                  content={resp?.content || ""}
                                  contentType={resolveContentType(selectedGroupedTask.submissions[activeSubmissionIndex]) as ContentType}
                                  label={`Response ${idx === 0 ? "A" : "B"}`}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-900 pb-2">
                  // Submitted Disposition (R2 Output)
                </h3>
                <div className="bg-[#05070A] border border-zinc-900 p-6 rounded-sm">
                  {taskPayload.submissionObject ? (
                    <div className="space-y-4">
                      {taskPayload.submissionObject.label !== undefined && (
                        <div>
                          <span className="text-[8px] text-zinc-600 font-bold uppercase">Label Selected</span>
                          <p className="text-sm font-bold text-white font-mono">{String(taskPayload.submissionObject.label)}</p>
                        </div>
                      )}
                      {taskPayload.submissionObject.selectedResponse !== undefined && (
                        <div>
                          <span className="text-[8px] text-indigo-400 font-bold uppercase">Response Selected</span>
                          <p className="text-sm font-bold text-white font-mono">Response {taskPayload.submissionObject.selectedResponse}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase">Raw Annotation Result</span>
                        <pre className="text-[10px] text-zinc-500 font-mono bg-black p-3 border border-zinc-900 overflow-x-auto mt-1">
                           {JSON.stringify(taskPayload.submissionObject, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-zinc-600 text-xs italic">
                      No external R2 output payload found. Review metadata manually.
                    </div>
                  )}
                </div>
              </div>

              {taskPayload.otherSubmissions && taskPayload.otherSubmissions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-900 pb-2">
                    // Consensus Comparison (Other Labellers)
                  </h3>
                  <div className="space-y-4">
                    {taskPayload.otherSubmissions.map((otherSub: any) => (
                      <div key={otherSub._id} className="bg-[#05070A]/60 border border-zinc-900/60 p-4 rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-zinc-400 font-bold">
                            Operator: {otherSub.submittedBy?.name || "Anonymous"} ({otherSub.submittedBy?.email})
                          </span>
                          <span className={`text-[8px] px-2 py-0.5 border rounded-sm font-bold uppercase ${
                            otherSub.status === 'approved' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                            otherSub.status === 'rejected' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' :
                            'border-zinc-800 text-zinc-500 bg-zinc-950'
                          }`}>
                            {otherSub.status}
                          </span>
                        </div>
                        {otherSub.content ? (
                          <div className="space-y-2">
                            {otherSub.content.label !== undefined && (
                              <p className="text-xs font-bold text-zinc-300">
                                Label: <span className="text-white">{String(otherSub.content.label)}</span>
                              </p>
                            )}
                            {otherSub.content.selectedResponse !== undefined && (
                              <p className="text-xs font-bold text-zinc-300">
                                Response Selected: <span className="text-white">Response {otherSub.content.selectedResponse}</span>
                              </p>
                            )}
                            <pre className="text-[9px] text-zinc-600 font-mono bg-black/40 p-2 border border-zinc-900/40 overflow-x-auto mt-2">
                              {JSON.stringify(otherSub.content, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-600 italic">No response content fetched.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <AlertTriangle className="text-rose-500" />
              <span className="text-xs text-rose-400">Failed to render assets.</span>
            </div>
          )}
        </main>
      </div>

      <footer className="shrink-0 p-6 border-t border-zinc-900 bg-zinc-950 flex justify-between items-center relative z-50">
        <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">
          Operator // Reviewer
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowRejectModal(true)}
            disabled={submittingAction || fetchingDetail}
            className="flex items-center gap-2 px-6 py-3 border border-rose-500/50 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <ThumbsDown size={14} /> Reject
          </button>

          <button 
            onClick={handleApprove}
            disabled={submittingAction || fetchingDetail}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
          >
            <ThumbsUp size={14} /> Approve & Next
          </button>
        </div>
      </footer>

      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#05070A] border border-slate-900 w-full max-w-md p-8 rounded-sm space-y-6 animate-in zoom-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] text-rose-500 uppercase tracking-[0.2em] font-bold">// Rejection Protocol</span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Select Rejection Reason</h3>
              </div>
              <button 
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectNote(''); }}
                className="text-zinc-600 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {REJECTION_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={`p-3 text-left text-[10px] font-bold uppercase tracking-wider border transition-all rounded-sm flex justify-between items-center ${
                    rejectReason === reason 
                      ? 'border-rose-500 bg-rose-500/5 text-rose-400' 
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {reason}
                  {rejectReason === reason && <Check size={12} />}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-600 uppercase font-bold block block">
                Additional Notes {rejectReason !== 'Other' && '(Optional)'}
              </label>
              <textarea
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                placeholder={rejectReason === 'Other' ? "Provide notes detailing the rejection (Required)..." : "Provide optional notes for the operator..."}
                rows={3}
                className="w-full bg-black border border-zinc-800 focus:border-rose-500 p-3 text-xs text-zinc-300 outline-none rounded-sm font-mono placeholder:text-zinc-700"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectNote(''); }}
                className="flex-1 py-3 border border-zinc-800 text-zinc-600 hover:text-white text-[10px] font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason || (rejectReason === 'Other' && !rejectNote.trim()) || submittingAction}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityIcon = ({ className, size = 20 }: { className?: string; size?: number }) => (
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
