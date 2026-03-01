/**
 * CustomDataRequestModal.tsx
 * A premium, technical form for buyers to request bespoke datasets.
 */

import React, { useState } from 'react';
import { X, Send, Database, Cpu, Calendar, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CustomDataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomDataRequestModal: React.FC<CustomDataRequestModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to your backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    toast.success("Brief sent to our engineering team!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#0B1022] w-full max-w-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="p-10 sm:p-14">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <header className="mb-10">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Database size={14} /> Step 01 / Scope
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">What are you building?</h2>
                <p className="text-slate-400 mt-2">Define the core domain for your custom data requirements.</p>
              </header>

              <div className="grid grid-cols-2 gap-4">
                {['Computer Vision', 'Natural Language', 'Audio / Speech', 'Tabular / Finance'].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                    onClick={() => setStep(2)}
                  >
                    <span className="block text-sm font-bold text-white mb-1 group-hover:text-indigo-400">{domain}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-black">Select Domain</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <header className="mb-10">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Cpu size={14} /> Step 02 / Technicals
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">The Brief</h2>
              </header>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dataset Specifications</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe specific labeling needs, edge cases, or environmental constraints..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Target Volume</label>
                    <input type="text" placeholder="e.g. 50k images" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">File Format</label>
                    <input type="text" placeholder="e.g. COCO JSON" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setStep(3)}
                  className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <header className="mb-10">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Calendar size={14} /> Step 03 / Logistics
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Final Details</h2>
              </header>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Est. Budget (USD)</label>
                  <input type="number" placeholder="5000" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50" />
                </div>
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex gap-4 items-center">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Our data engineers will review your brief and contact you within 24 hours with a feasibility report and quote.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Submit Brief <Send size={14} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomDataRequestModal;
