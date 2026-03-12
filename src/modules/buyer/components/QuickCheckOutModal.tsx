import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, Lock, ArrowRight, Terminal } from 'lucide-react';
import useBuyerStore from '../store/buyerStore';
import { toast } from 'react-hot-toast';

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: {
    id: string;
    title: string;
    price: number;
    format?: string;
  } | null;
}

const QuickCheckoutModal: React.FC<QuickCheckoutModalProps> = ({ isOpen, onClose, dataset }) => {
  const [status, setStatus] = useState<'idle' | 'processing'>('idle');
  const { checkOut } = useBuyerStore();

  if (!isOpen || !dataset) return null;

  const handlePaymentRedirect = async () => {
    if (!dataset.id) {
      toast.error("Invalid dataset reference.");
      return;
    }

    setStatus('processing');
    try {
      const url: string = await checkOut(dataset.id, false);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Initialization failed.");
        setStatus('idle');
      }
    } catch (error) {
      setStatus('idle');
    }
  };

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dataset.price * 1.08); // Including systemic service fee

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Heavy Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-500" 
        onClick={status === 'processing' ? undefined : onClose}
      />

      {/* Modal: Obsidian Container */}
      <div className="relative bg-[#0A0A0A] w-full max-w-md border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Decorative Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50" />

        <div className="p-8 sm:p-10">
          {status === 'processing' ? (
            /* 🌀 SECURE PROCESSING STATE */
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in slide-in-from-bottom-2">
              <div className="relative mb-8">
                <Loader2 className="animate-spin text-indigo-500" size={40} strokeWidth={1} />
                <Lock className="absolute inset-0 m-auto text-indigo-500/40" size={12} />
              </div>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-[0.3em]">Encrypting_Session</h2>
              <p className="text-zinc-500 mt-4 text-[10px] uppercase tracking-widest leading-relaxed px-4">
                Routing to Paystack Secure Gateway...
              </p>
            </div>
          ) : (
            /* ✅ TRANSACTION MANIFEST STATE */
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <div className="flex items-center gap-2 text-indigo-500 mb-4">
                  <Terminal size={14} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Checkout_v4.0</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tighter italic">Final Review</h2>
              </header>

              <div className="space-y-6">
                {/* Technical Summary List */}
                <div className="bg-black/40 border border-zinc-900 divide-y divide-zinc-900">
                  <ManifestItem label="Asset" value={dataset.title} />
                  <ManifestItem label="Format" value={dataset.format || "N/A"} />
                  <ManifestItem label="Node Fee" value="8.00%" />
                  <div className="p-4 flex justify-between items-center bg-indigo-500/5">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Total_Settlement</span>
                    <span className="text-xl font-bold text-white tabular-nums">{formattedTotal}</span>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="space-y-6">
                  <button
                    onClick={handlePaymentRedirect}
                    className="group w-full py-4 bg-white text-black hover:bg-indigo-50 transition-all duration-300 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Authorize Transaction</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex flex-col gap-4 items-center">
                    <p className='text-zinc-600 font-medium text-[9px] text-center uppercase tracking-widest leading-relaxed'>
                      Secure connection via <span className="text-zinc-400">Paystack Infrastructure</span>
                    </p>
                    
                    <div className="flex items-center gap-6 opacity-20 grayscale">
                      <ShieldCheck size={16} className="text-white" />
                      <Lock size={14} className="text-white" />
                    </div>
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

// Helper for row items
const ManifestItem = ({ label, value }: { label: string, value: string }) => (
  <div className="p-4 flex justify-between items-center gap-4">
    <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">// {label}</span>
    <span className="text-xs font-medium text-zinc-300 truncate max-w-[200px]">{value}</span>
  </div>
);

export default QuickCheckoutModal;