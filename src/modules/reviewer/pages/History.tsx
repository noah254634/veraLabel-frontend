import React, { useEffect, useState } from 'react';
import { 
  Activity, CheckCircle, XCircle, Clock, Database, RefreshCw, AlertTriangle
} from 'lucide-react';
import { api } from '../../../shared/types/api';
import toast from 'react-hot-toast';

interface CompletedReview {
  _id: string;
  taskId: string;
  taskType: string;
  status: 'verified' | 'rejected' | string;
  verificationScore?: number;
  reviewedAt?: string;
  reviewComment?: string;
  rejectionReason?: string;
  datasetId?: {
    _id: string;
    name: string;
  };
}

const ReviewerHistory = () => {
  const [reviews, setReviews] = useState<CompletedReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviewer/completed?limit=100');
      const data = response.data?.data || response.data;
      setReviews(data.tasks || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to sync audit archives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedReviews();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#020408] p-8 font-mono text-slate-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <span className="text-[9px] text-indigo-500 uppercase tracking-[0.4em] font-bold">// Archive_Telemetry</span>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-none italic">
            Verified Archives
          </h1>
          <p className="text-zinc-500 text-xs max-w-2xl">
            A secure registry of all submissions verified or rejected by your node.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={fetchCompletedReviews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-600 hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Sync_Archives
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Activity className="animate-spin text-indigo-500" size={24} />
          <span className="text-xs uppercase tracking-[0.2em]">Retrieving archives...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="border border-dashed border-zinc-900 p-16 text-center rounded-sm max-w-md mx-auto mt-12 space-y-6">
          <Clock className="mx-auto text-zinc-700" size={32} />
          <h2 className="text-zinc-400 uppercase tracking-widest font-bold text-xs">No Archive Logs</h2>
          <p className="text-[10px] text-zinc-600 leading-relaxed italic">
            You have not reviewed any tasks in the current cycle.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-900 bg-[#05070A] rounded-sm max-w-5xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-600 uppercase text-[9px] tracking-wider bg-black/40">
                <th className="p-4 font-bold">Task ID</th>
                <th className="p-4 font-bold">Dataset</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Score</th>
                <th className="p-4 font-bold">Disposition Detail</th>
                <th className="p-4 font-bold text-right">Date Reviewed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-400">
              {reviews.map(review => (
                <tr key={review._id} className="hover:bg-black/30 transition-colors">
                  <td className="p-4 font-bold text-white font-mono">{review.taskId || review._id}</td>
                  <td className="p-4 truncate max-w-[180px]">{review.datasetId?.name || "Unassociated"}</td>
                  <td className="p-4">
                    <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 uppercase rounded-sm">
                      {review.taskType}
                    </span>
                  </td>
                  <td className="p-4">
                    {review.status === 'verified' ? (
                      <span className="text-emerald-500 flex items-center gap-1.5 font-bold uppercase text-[9px]">
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5 font-bold uppercase text-[9px]">
                        <XCircle size={12} /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold font-mono text-zinc-300">
                    {review.status === 'verified' ? (review.verificationScore ?? 5) : 0}
                  </td>
                  <td className="p-4 italic max-w-xs truncate text-zinc-500">
                    {review.status === 'verified' 
                      ? (review.reviewComment || "No comment") 
                      : (review.rejectionReason || "No reason specified")}
                  </td>
                  <td className="p-4 text-right text-[10px] text-zinc-500 font-mono">
                    {formatDate(review.reviewedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ReviewerHistory;
