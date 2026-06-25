import { useEffect, useState } from 'react';
import { 
  Wallet, TrendingUp, Clock, ArrowUpRight, 
  ArrowDownLeft, History, ShieldCheck, Zap,
  ExternalLink, Download, Filter
} from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { ProgressBar } from '../components/ProgressBar';

export const WalletPage = () => {
  const { 
    balance, totalEarned, pendingPayment, 
    transactions, fetchEarnings, requestPayout, requestWithdrawalOTP, loading 
  } = useWalletStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > balance) return;
    
    if (otpStep === 'request') {
      const success = await requestWithdrawalOTP(Number(withdrawAmount));
      if (success) {
        setOtpStep('verify');
      }
    } else {
      if (!otp || otp.length < 6) return;
      try {
        await requestPayout(Number(withdrawAmount), phoneNumber, otp);
        setIsModalOpen(false);
        setPhoneNumber('');
        setWithdrawAmount('');
        setOtpStep('request');
        setOtp('');
      } catch (err) {
        // Error handled in store, keep modal open
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOtpStep('request');
    setOtp('');
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Wallet size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold">Quantum_Wallet_v.04</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic">
            Financial Ledger
          </h1>
        </div>

        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest">
              <Download size={14} /> Export_CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest">
              <Filter size={14} /> Filter_History
           </button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
           <div className="relative bg-[#050505] border border-zinc-900 p-10 md:p-14 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-12 overflow-hidden">
              <div className="space-y-6 relative z-10">
                 <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">Liquid_Balance_Available</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl text-zinc-600 font-light">$</span>
                       <h2 className="text-7xl md:text-8xl font-bold text-white tabular-nums tracking-tighter">
                          {balance.toFixed(2)}
                       </h2>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/5 px-3 py-1 border border-emerald-500/10">
                       <TrendingUp size={12} /> +12% vs last week
                    </div>
                    <span className="text-zinc-600 uppercase tracking-widest">Node_Status: SYNCHRONIZED</span>
                 </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto relative z-10">
                 <button 
                   onClick={() => { setWithdrawAmount(balance); setIsModalOpen(true); }}
                   disabled={balance <= 0}
                   className="px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Request_Withdrawal <ArrowUpRight size={16} />
                 </button>
                 <button className="px-10 py-5 bg-zinc-950 text-white border border-zinc-800 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-900 transition-all flex items-center justify-center gap-2">
                    Payment_Settings
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
           </div>
        </div>
        <div className="space-y-4">
           <MetricCard 
             icon={<Zap className="text-amber-500" />} 
             label="Total_Historical_Earnings" 
             value={`$${totalEarned.toFixed(2)}`} 
             sub="Across all projects"
           />
           <MetricCard 
             icon={<Clock className="text-indigo-400" />} 
             label="Pending_Verification" 
             value={`$${pendingPayment.toFixed(2)}`} 
             sub="Estimated settlement: 24h"
           />
           <div className="p-6 bg-zinc-950 border border-zinc-900 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-600 uppercase">Payout_Threshold</span>
                  <span className="text-zinc-400">{((balance / 200) * 100).toFixed(0)}% to $200.00</span>
              </div>
              <ProgressBar progress={(balance / 200) * 100} />
           </div>
        </div>
      </div>
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-zinc-500 border-b border-zinc-900 pb-4">
           <History size={16} />
           <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em]">Operation_History_Ledger</h3>
        </div>

        <div className="bg-[#020203] border border-zinc-900 overflow-hidden shadow-2xl">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-zinc-900 bg-[#050505]">
                <th className="p-5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">// Ledger_ID</th>
                <th className="p-5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">// Activity</th>
                <th className="p-5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic text-right">// Value_Transfer</th>
                <th className="p-5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">// Status</th>
                <th className="p-5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">// Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-950/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-zinc-500">#{tx.reference?.slice(0, 8) || tx.id}</span>
                       <ExternalLink size={10} className="text-zinc-800 group-hover:text-zinc-600 cursor-pointer" />
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-full ${tx.type === 'earning' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tx.type === 'earning' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                       </div>
                       <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{tx.method || 'System_Sync'}</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <span className={`text-sm font-bold tabular-nums ${tx.type === 'earning' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                      {tx.type === 'earning' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${tx.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                       <span className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {tx.status}
                       </span>
                    </div>
                  </td>
                  <td className="p-5 text-[10px] text-zinc-600">
                    {new Date(tx.date).toLocaleDateString()} // {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transactions.length === 0 && (
            <div className="p-20 text-center space-y-4">
               <History size={32} className="mx-auto text-zinc-900" />
               <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Registry_Empty // No_Transfers_Detected</p>
            </div>
          )}
        </div>
      </section>
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 pt-10">
         <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
            <ShieldCheck size={20} className="text-indigo-500" />
            <p className="text-[8px] font-mono uppercase tracking-widest leading-relaxed">
               Bank-grade encryption active. <br/> All transfers are monitored by Vera_Shield.
            </p>
         </div>
         <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
            <TrendingUp size={20} className="text-emerald-500" />
            <p className="text-[8px] font-mono uppercase tracking-widest leading-relaxed">
               Real-time value settlement. <br/> Zero-latency ledger syncing active.
            </p>
         </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#050505] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
            <div className="p-8 space-y-6">
              
              {otpStep === 'request' ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white tracking-tighter">M-Pesa Withdrawal</h2>
                    <p className="text-xs text-zinc-400 font-mono">Transfer funds directly to your mobile wallet.</p>
                  </div>

                  <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Amount (USD)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={balance} 
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder={`Max: $${balance.toFixed(2)}`}
                        required
                      />
                      <p className="text-[9px] text-zinc-600 font-mono text-right">Approx: {Number(withdrawAmount || 0) * 130} KES</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">M-Pesa Number</label>
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="e.g. 254700000000"
                        required
                      />
                      <p className="text-[9px] text-amber-500/80 font-mono">Ensure the number is registered with Safaricom M-Pesa.</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-3 bg-zinc-900 text-white border border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-lg"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || !phoneNumber || !withdrawAmount || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0}
                        className="flex-1 px-4 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading && otpStep === 'request' ? (
                          <>
                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : 'Send OTP'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-emerald-500 tracking-tighter">Security Verification</h2>
                    <p className="text-xs text-zinc-400 font-mono">Enter the 6-digit authorization code sent to your email to verify this withdrawal.</p>
                  </div>

                  <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Authorization Code</label>
                      <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-4 text-white font-mono text-center tracking-[1em] text-2xl focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="••••••"
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-3 bg-zinc-900 text-white border border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-lg"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || !otp || otp.length < 6}
                        className="flex-1 px-4 py-3 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading && otpStep === 'verify' ? (
                          <>
                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                          </>
                        ) : 'Verify & Withdraw'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ icon, label, value, sub }: any) => (
  <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4 hover:border-zinc-800 transition-all">
    <div className="flex items-center gap-2 text-zinc-500">
       {icon}
       <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="space-y-1">
       <p className="text-2xl font-bold text-white tabular-nums tracking-tighter">{value}</p>
       <p className="text-[9px] text-zinc-700 font-mono uppercase tracking-widest italic">{sub}</p>
    </div>
  </div>
);
