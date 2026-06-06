import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, CheckCircle2, AlertTriangle,
  Activity, Cpu, Fingerprint, RefreshCw, BarChart2
} from 'lucide-react';
import { api } from '../../../shared/types/api';
import toast from 'react-hot-toast';

interface ReviewerStats {
  totalReviewed: number;
  averageScore: number;
  pendingReviews: number;
  approved: number;
  rejected: number;
  approvalRate: string;
}

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ReviewerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviewer/stats');
      const data = response.data?.data || response.data;
      setStats(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to sync operational telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020408] p-8 font-mono text-slate-500">
      <header className="flex justify-between items-start mb-12">
        <div className="flex gap-8">
          <div className="relative h-16 w-16 bg-indigo-500/5 border border-indigo-500/20 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full border-t-indigo-500 animate-spin duration-[3s]" />
            <Cpu className="text-indigo-500" size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Terminal_<span className="text-indigo-500">Reviewer_Node</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" /> Channel_Online
              </span>
              <span className="text-slate-800">//</span>
              <span>Secure Session Established</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-600 hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Sync_Telemetry
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <Activity size={32} className="text-indigo-500 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em]">Handshaking Core Metrics...</span>
        </div>
      ) : stats ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="bg-[#05070A] border border-slate-900 p-6 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pending_Queue</span>
                <Zap size={14} className="text-amber-500" />
              </div>
              <div>
                <div className="text-5xl font-black text-white italic tracking-tighter tabular-nums">{stats.pendingReviews}</div>
                <p className="text-[8px] uppercase tracking-wider mt-1 text-slate-700">Tasks awaiting verification</p>
              </div>
            </div>

            <div className="bg-[#05070A] border border-slate-900 p-6 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total_Audited</span>
                <BarChart2 size={14} className="text-indigo-500" />
              </div>
              <div>
                <div className="text-5xl font-black text-white italic tracking-tighter tabular-nums">{stats.totalReviewed}</div>
                <p className="text-[8px] uppercase tracking-wider mt-1 text-slate-700">Accumulated verified assets</p>
              </div>
            </div>

            <div className="bg-[#05070A] border border-slate-900 p-6 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Approval_Rate</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <div>
                <div className="text-5xl font-black text-emerald-500 italic tracking-tighter tabular-nums">{stats.approvalRate}</div>
                <p className="text-[8px] uppercase tracking-wider mt-1 text-slate-700">Acceptance frequency</p>
              </div>
            </div>

            <div className="bg-[#05070A] border border-slate-900 p-6 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Average_Score</span>
                <Fingerprint size={14} className="text-indigo-500" />
              </div>
              <div>
                <div className="text-5xl font-black text-white italic tracking-tighter tabular-nums">{stats.averageScore.toFixed(2)}</div>
                <p className="text-[8px] uppercase tracking-wider mt-1 text-slate-700">Mean quality rating (1.0 - 5.0)</p>
              </div>
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-[#05070A] border border-slate-900 p-8 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="text-indigo-500" size={16} />
                  <h3 className="text-white text-sm font-black uppercase tracking-widest">Core_Operational_Directives</h3>
                </div>
                <p className="text-xs leading-relaxed max-w-2xl text-slate-400">
                  You are authorized to review submitted data packets. Ensure adherence to high-quality guidelines. Rejected submissions must be stamped with standardized issue tags and optional directives to return tasks to the pool.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/reviewer/queue')}
                  className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_30px_rgba(99,102,241,0.15)] rounded-sm"
                >
                  Initialize_Audit_Terminal
                </button>
              </div>
            </div>
            <div className="bg-[#05070A] border border-slate-900 p-8 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="text-slate-600" size={16} />
                <h3 className="text-white text-xs font-black uppercase tracking-widest">Audit_Dispositions</h3>
              </div>

              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Approved_Submissions</span>
                  <span className="text-xs font-bold text-white font-mono tabular-nums">{stats.approved}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Rejected_Submissions</span>
                  <span className="text-xs font-bold text-rose-400 font-mono tabular-nums">{stats.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Net_Queue_Load</span>
                  <span className="text-xs font-bold text-zinc-400 font-mono tabular-nums">{stats.pendingReviews} pending</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <AlertTriangle size={32} className="text-rose-500" />
          <span className="text-xs uppercase tracking-widest text-rose-400">Failed to load system stats.</span>
        </div>
      )}

    </div>
  );
};

export default ReviewerDashboard;