import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useBuyerStore from './store/buyerStore';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { finalizePayment } = useBuyerStore();
  
  // Paystack sends 'reference' or 'trxref'
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  
  // Prevent double-firing in React Strict Mode
  const hasRun = useRef(false);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (hasRun.current) return;
    
    if (reference) {
      hasRun.current = true;
      verifyPayment(reference);
    } else {
      setStatus('error');
      toast.error("No payment reference found.");
    }
  }, [reference]);

  const verifyPayment = async (ref: string) => {
    try {
      await finalizePayment(ref);
      setStatus('success');
      toast.success("Payment verified successfully!");
      // Redirect to orders page after a short delay
      setTimeout(() => {
        navigate('/buyer/order');
      }, 2000);
    } catch (error) {
      console.error("Verification failed:", error);
      setStatus('error');
      toast.error("Payment verification failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-200 p-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
        
        {status === 'verifying' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <Loader2 className="animate-spin mx-auto text-indigo-500 mb-4" size={48} />
            <h2 className="text-2xl font-black text-white mb-2">Verifying Payment</h2>
            <p className="text-slate-400 text-sm">Securely communicating with Paystack...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Purchase Complete</h2>
            <p className="text-slate-400 text-sm mb-6">Your dataset access has been granted.</p>
            <p className="text-xs text-slate-500 animate-pulse">Redirecting to orders...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 border border-red-500/20">
              <XCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Verification Failed</h2>
            <p className="text-slate-400 text-sm mb-6">We couldn't verify your transaction reference.</p>
            <button 
              onClick={() => navigate('/buyer')}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Return to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;