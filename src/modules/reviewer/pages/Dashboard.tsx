import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, RefreshCw, BarChart2,
  Wallet, ArrowUpRight, X
} from 'lucide-react';
import { useReviewerStore } from '../store/reviewerStore';
import toast from 'react-hot-toast';

export const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading, fetchStats, requestWithdrawalOTP, requestPayout } = useReviewerStore();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');
  const [submittingPayout, setSubmittingPayout] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    const pendingBalance = stats?.earnings?.pending || 0;
    if (!withdrawAmount || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amountNum > pendingBalance) {
      toast.error("Insufficient funds");
      return;
    }
    
    if (otpStep === 'request') {
      if (!phoneNumber) {
        toast.error("Phone number is required");
        return;
      }
      try {
        setSubmittingPayout(true);
        const success = await requestWithdrawalOTP(amountNum);
        if (success) {
          setOtpStep('verify');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSubmittingPayout(false);
      }
    } else {
      if (!otp || otp.length < 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }
      try {
        setSubmittingPayout(true);
        await requestPayout(amountNum, phoneNumber, otp);
        closeModal();
      } catch (err) {
        console.error(err);
      } finally {
        setSubmittingPayout(false);
      }
    }
  };

  const closeModal = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setPhoneNumber('');
    setOtpStep('request');
    setOtp('');
  };

  return (
    <div className="w-full min-h-screen bg-[#020203] p-8 font-sans text-zinc-400">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Reviewer Hub
          </h1>
          <p className="text-[11px] text-zinc-600">
            Secure audit session online
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-900 text-zinc-500 hover:text-zinc-300 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all disabled:opacity-50"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Sync Stats
        </button>
      </header>

      {loading && !stats ? (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-3">
          <RefreshCw size={20} className="text-indigo-400 animate-spin" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-650">Fetching account metrics...</span>
        </div>
      ) : stats ? (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Wallet Card */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-sm flex flex-col justify-between h-36 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Earnings</span>
                <Wallet size={12} className="text-emerald-500" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-zinc-100 tracking-tight">
                    ${(stats.earnings?.pending || 0).toFixed(2)}
                  </div>
                  <span className="text-[9px] text-zinc-600 font-mono block mt-1">
                    Paid: ${(stats.earnings?.paid || 0).toFixed(2)} | Total: ${(stats.earnings?.total || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={!((stats.earnings?.pending || 0) > 0)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono text-[9px] font-bold uppercase transition-all rounded-sm flex items-center gap-1"
                >
                  Withdraw <ArrowUpRight size={9} />
                </button>
              </div>
            </div>

            {/* Pending Queue */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-sm flex flex-col justify-between h-36">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Pending Queue</span>
              <div>
                <div className="text-3xl font-bold text-zinc-100 tracking-tight font-mono">{stats.pendingReviews}</div>
                <p className="text-[9px] text-zinc-600 mt-1">Batches awaiting review</p>
              </div>
            </div>

            {/* Total Audited */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-sm flex flex-col justify-between h-36">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Total Audited</span>
              <div>
                <div className="text-3xl font-bold text-zinc-100 tracking-tight font-mono">{stats.totalReviewed}</div>
                <p className="text-[9px] text-zinc-600 mt-1">Completed verifications</p>
              </div>
            </div>

          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Primary Action Callout */}
            <div className="md:col-span-2 bg-zinc-950/40 border border-zinc-900 p-8 rounded-sm flex flex-col justify-between min-h-[220px]">
              <div className="space-y-3">
                <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">// Directives</span>
                <p className="text-xs leading-relaxed text-zinc-400 max-w-xl">
                  Review completed batches to verify transcription and alignment metrics. 
                  Approve correct submissions or reject anomalies to return them back to the annotation pool.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => navigate('/reviewer/queue')}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-all rounded-sm"
                >
                  Launch Audit Terminal
                </button>
              </div>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-8 rounded-sm flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-4">
                <BarChart2 className="text-zinc-600" size={13} />
                <h3 className="text-zinc-300 text-[10px] font-mono uppercase tracking-wider">Breakdown</h3>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-center text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-zinc-900">
                  <span className="text-zinc-500">Approved Submissions</span>
                  <span className="font-bold text-zinc-300 font-mono">{stats.approved}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-zinc-900">
                  <span className="text-zinc-500">Rejected Submissions</span>
                  <span className="font-bold text-rose-400 font-mono">{stats.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Average Review Score</span>
                  <span className="font-bold text-zinc-300 font-mono">{stats.averageScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-3">
          <AlertTriangle size={24} className="text-rose-500" />
          <span className="text-xs text-rose-400">Failed to load account statistics.</span>
        </div>
      )}

      {/* Payout Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#05070A] border border-zinc-900 w-full max-w-sm p-6 rounded-sm space-y-5 animate-in zoom-in duration-200 relative">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] text-indigo-400 uppercase tracking-widest font-mono font-bold block mb-1">// Payout Protocol</span>
                <h3 className="text-xs font-bold text-zinc-200 uppercase">
                  {otpStep === 'request' ? 'M-Pesa Withdrawal' : 'Security Verification'}
                </h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-zinc-655 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {otpStep === 'request' ? (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        max={stats?.earnings?.pending || 0}
                        className="w-full bg-black border border-zinc-800 focus:border-indigo-500/50 p-2.5 text-xs text-zinc-350 outline-none rounded-sm font-mono animate-all"
                        required
                      />
                      <span className="text-[8px] text-zinc-600 font-mono mt-1 block">
                        Available: ${(stats?.earnings?.pending || 0).toFixed(2)} | Approx: {Number(withdrawAmount || 0) * 130} KES
                      </span>
                    </div>

                    <div>
                      <label className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">
                        M-Pesa Registered Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 254700000000"
                        className="w-full bg-black border border-zinc-800 focus:border-emerald-500/50 p-2.5 text-xs text-zinc-350 outline-none rounded-sm font-mono animate-all"
                        required
                      />
                      <span className="text-[8px] text-amber-500/80 font-mono mt-1 block">
                        Funds will transfer instantly to this Safaricom M-Pesa account.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[9px] font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > (stats?.earnings?.pending || 0) || !phoneNumber || submittingPayout}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-mono uppercase disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {submittingPayout ? (
                        <>
                          <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : 'Send OTP'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">
                      Authorization Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full bg-black border border-zinc-800 focus:border-emerald-500/50 p-3 text-lg font-bold text-center tracking-[1em] text-white outline-none rounded-sm font-mono"
                      required
                    />
                    <span className="text-[8px] text-zinc-650 font-mono mt-1 block text-center">
                      Check your email for the 6-digit confirmation code.
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[9px] font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!otp || otp.length < 6 || submittingPayout}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-mono uppercase disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {submittingPayout ? (
                        <>
                          <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : 'Confirm & Payout'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewerDashboard;