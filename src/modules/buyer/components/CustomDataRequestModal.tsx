/**
 * CustomDataRequestModal.tsx
 * A premium, technical portal for bespoke dataset requests and direct annotation uploads.
 */

import React, { useState, useRef, useEffect } from 'react';
import useBuyerStore from '../store/buyerStore';
import type { datasetRequest } from '../types/datasetRequest';
import { 
  X, Send, Database, Cpu, Calendar, ChevronRight, 
  Loader2, ShieldCheck, Link as LinkIcon, Upload, 
  FileText, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CustomDataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomDataRequestModal: React.FC<CustomDataRequestModalProps> = ({ isOpen, onClose }) => {
  const { datasetRequest: submitDatasetRequest } = useBuyerStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState<'link' | 'upload'>('link');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    domain: '',
    specifications: '',
    volume: '',
    format: '',
    budget: '',
    sourceLink: '',
    uploadedFile: null as File | null,
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, uploadedFile: e.target.files![0] }));
      toast.success(`${e.target.files[0].name} staged for encryption`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('domain', formData.domain);
    data.append('specifications', formData.specifications);
    data.append('volume', formData.volume);
    data.append('format', formData.format);
    data.append('budget', formData.budget);
    data.append('sourceLink', formData.sourceLink);
    if (formData.uploadedFile) {
      data.append('uploadedFile', formData.uploadedFile);
    }

    await submitDatasetRequest(data as unknown as datasetRequest);
    
    setLoading(false);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#0B1022] border border-indigo-500/50 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}>
        <div className="flex-1 w-0 p-1">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5"><CheckCircle2 className="text-indigo-400" size={20} /></div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Transmission Successful</p>
              <p className="mt-1 text-xs text-slate-400">Our engineering team has received your brief.</p>
            </div>
          </div>
        </div>
      </div>
    ));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity" 
        onClick={loading ? undefined : onClose}
      />

      <div className="relative bg-[#0B1022] w-full max-w-2xl rounded-[3rem] border border-slate-800/50 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Cinematic Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-900">
          <div 
            className="h-full bg-gradient-to-r from-transparent via-indigo-500 to-indigo-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.8)]" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="p-10 sm:p-16">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  <Database size={12} /> Step 01 / Scope
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-3">Project Domain</h2>
                <p className="text-slate-400 text-sm font-medium">Select the foundational architecture for your dataset.</p>
              </header>

              <div className="grid grid-cols-2 gap-4">
                {['Computer Vision', 'Natural Language', 'Audio / Speech', 'Tabular / Finance'].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    className={`p-6 rounded-[2rem] border transition-all duration-300 text-left group relative overflow-hidden ${
                      formData.domain === domain ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-900/40 hover:border-slate-600'
                    }`}
                    onClick={() => { setFormData({...formData, domain}); setStep(2); }}
                  >
                    <span className={`block text-sm font-bold mb-1 transition-colors ${formData.domain === domain ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>{domain}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Select Domain</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-8">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  <Cpu size={12} /> Step 02 / Technicals
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">The Brief</h2>
              </header>

              <div className="space-y-6">
                <div className="flex p-1 bg-slate-950/50 border border-slate-800/50 rounded-2xl">
                  <button type="button" onClick={() => setUploadMethod('link')} className={`flex-1 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${uploadMethod === 'link' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>EXTERNAL LINK</button>
                  <button type="button" onClick={() => setUploadMethod('upload')} className={`flex-1 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${uploadMethod === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>SECURE UPLOAD</button>
                </div>

                {uploadMethod === 'link' ? (
                  <div className="relative group">
                    <input name="sourceLink" value={formData.sourceLink} onChange={handleInputChange} type="url" placeholder="S3, GCS, or Cloud storage link (Optional)" className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 pl-12 text-white text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600" />
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center hover:border-indigo-500/40 hover:bg-indigo-500/[0.02] transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <Upload className="text-slate-600 group-hover:text-indigo-400 mb-3 group-hover:-translate-y-1 transition-all" size={32} />
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">{formData.uploadedFile ? formData.uploadedFile.name : 'Drop local dataset'}</p>
                    <p className="text-[10px] text-slate-600 mt-2 font-medium">Encrypted AES-256 transfer • Max 2GB</p>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Dataset Specifications</label>
                  <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} rows={3} placeholder="Classes, labeling rules, edge cases..." className="w-full bg-slate-900/40 border border-slate-800 rounded-[1.5rem] p-5 text-white text-sm focus:border-indigo-500/50 outline-none transition-all resize-none" />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-[2] py-5 bg-slate-100 text-slate-950 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5">Continue <ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-10">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  <Calendar size={12} /> Step 03 / Logistics
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">Finalization</h2>
              </header>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Target Volume</label>
                    <input name="volume" value={formData.volume} onChange={handleInputChange} type="text" placeholder="e.g. 100k instances" className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Data Format</label>
                    <input name="format" value={formData.format} onChange={handleInputChange} type="text" placeholder="JSON, CSV, XML..." className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Est. Budget (USD)</label>
                    <input name="budget" value={formData.budget} onChange={handleInputChange} type="number" placeholder="5,000" className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50" />
                  </div>
                </div>

                <div className="p-6 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-[2rem] flex gap-5 items-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck size={80} className="text-indigo-400" />
                  </div>
                  <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 relative z-10"><ShieldCheck size={24} /></div>
                  <div className="relative z-10">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-bold uppercase tracking-tight mb-1">Secure Engineering Review</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Your request will be assigned to a Senior Data Architect. Expect a technical feasibility report and pricing matrix within 24 hours.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Transmit Brief <Send size={14} /></>}
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