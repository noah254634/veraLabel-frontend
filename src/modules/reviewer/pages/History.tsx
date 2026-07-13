import { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, RefreshCw
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

export const ReviewerHistory = () => {
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
      toast.error("Failed to fetch audit history.");
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
    <div className="w-full min-h-screen bg-[#020203] p-8 font-sans text-zinc-400">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8 max-w-5xl mx-auto">
        <div className="space-y-1">
          <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-[0.35em] font-bold">// Logs Registry</span>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Audit Archives
          </h1>
          <p className="text-zinc-500 text-xs">
            Review log of all verified or rejected submissions.
          </p>
        </div>

        <button 
          onClick={fetchCompletedReviews}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-900 text-zinc-500 hover:text-zinc-300 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all disabled:opacity-50"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Sync History
        </button>
      </header>

      {/* Main Table Content */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[30vh] space-y-3">
            <RefreshCw size={20} className="text-indigo-400 animate-spin" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-600">Retrieving review archives...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-dashed border-zinc-900 py-16 text-center rounded-sm max-w-sm mx-auto mt-12 space-y-4">
            <Clock className="mx-auto text-zinc-800" size={28} />
            <h2 className="text-zinc-400 uppercase tracking-widest font-bold text-[10px]">No Archives</h2>
            <p className="text-[11px] text-zinc-650 italic">
              No tasks have been audited in this cycle.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-zinc-900 bg-zinc-950/20 rounded-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 uppercase text-[9px] tracking-wider bg-zinc-950/80">
                  <th className="p-4 font-bold">Task ID</th>
                  <th className="p-4 font-bold">Dataset</th>
                  <th className="p-4 font-bold">Modality</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Score</th>
                  <th className="p-4 font-bold">Notes</th>
                  <th className="p-4 font-bold text-right">Date Reviewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-450">
                {reviews.map(review => (
                  <tr key={review._id} className="hover:bg-zinc-950/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-zinc-200">{review.taskId || review._id}</td>
                    <td className="p-4 truncate max-w-[180px]">{review.datasetId?.name || "Unassociated"}</td>
                    <td className="p-4">
                      <span className="text-[8px] bg-zinc-900/60 border border-zinc-800 text-zinc-500 px-2 py-0.5 uppercase rounded-sm font-mono">
                        {review.taskType}
                      </span>
                    </td>
                    <td className="p-4">
                      {review.status === 'verified' ? (
                        <span className="text-emerald-500 flex items-center gap-1.5 font-bold uppercase text-[9px]">
                          <CheckCircle size={11} /> Approved
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1.5 font-bold uppercase text-[9px]">
                          <XCircle size={11} /> Rejected
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

    </div>
  );
};

export default ReviewerHistory;
