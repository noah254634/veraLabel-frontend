/**
 * QuickCheckoutModal.tsx
 * Refined, compact version for a high-end focused checkout experience.
 */

import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, Lock, ArrowRight, CreditCard } from 'lucide-react';
import useBuyerStore from '../store/buyerStore';
import { toast } from 'react-hot-toast';

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: {
    id: string;
    title: string;
    price: number;
  } | null;
}

const QuickCheckoutModal: React.FC<QuickCheckoutModalProps> = ({ isOpen, onClose, dataset }) => {
  const [status, setStatus] = useState<'idle' | 'processing'>('idle');
  const { checkOut } = useBuyerStore();

  if (!isOpen || !dataset) return null;

  const handleStripeRedirect = async () => {
    setStatus('processing');
    try {
      toast.success("Securing connection...");
      const url: string = await checkOut(dataset.id, dataset.price);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No redirect URL provided");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setStatus('idle');
      toast.error("Payment system unavailable. Please try again.");
    }
  };

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dataset.price * 1.08);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop with stronger blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500" 
        onClick={status === 'processing' ? undefined : onClose}
      />

      {/* Compact Modal Container: Changed max-w-lg to max-w-md */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Compact Close Button */}
        {status === 'idle' && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        )}

        <div className="p-8 sm:p-10">
          {status === 'processing' ? (
            /* 🌀 COMPACT LOADING STATE */
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in slide-in-from-bottom-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 m-auto w-12 h-12 border-2 border-slate-100 rounded-full" />
                <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1.5} />
                <Lock className="absolute inset-0 m-auto text-indigo-600/40" size={14} />
              </div>

              <h2 className="text-xl font-black text-slate-900">Securing Session</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed px-4">
                Redirecting to Stripe's secure portal...
              </p>
            </div>
          ) : (
            /* ✅ COMPACT REVIEW STATE */
            <div className="animate-in fade-in duration-300">
              <header className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border border-emerald-100">
                  <ShieldCheck size={10} />
                  Verified Access
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Final Review</h2>
              </header>

              <div className="space-y-6">
                {/* Simplified Summary Card */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset</span>
                      <span className="text-xs font-bold text-slate-900 text-right truncate">{dataset.title}</span>
                    </div>
                    <div className="h-px bg-slate-200/60" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                      <span className="text-xl font-black text-indigo-600">{formattedTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="space-y-4">
                  <button
                    onClick={handleStripeRedirect}
                    className="group w-full py-4 bg-slate-950 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-[0.98]"
                  >
                    <span>Complete Purchase</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <p className='text-slate-400 font-medium text-[10px] text-center px-4 leading-relaxed'>
                    By proceeding, you agree to the <span className="text-slate-900 underline underline-offset-2 cursor-pointer">Dataset Terms</span>
                  </p>

                  <div className="flex items-center justify-center gap-4 opacity-30 pt-1">
                    <CreditCard size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Stripe Secure</span>
                    <Lock size={12} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickCheckoutModal;