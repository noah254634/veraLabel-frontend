import React, { useState, useRef } from 'react';
import useBuyerStore from '../store/buyerStore';
import { 
  X, Send, Database, Cpu, Calendar, ChevronRight, 
  Loader2, ShieldCheck, Link as LinkIcon, Upload, 
  Terminal, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CustomDataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomDataRequestModal: React.FC<CustomDataRequestModalProps> = ({ isOpen, onClose }) => {
  const { datasetRequest: submitDatasetRequest } = useBuyerStore();
  const {uploadDataset}=useBuyerStore();
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
      toast.success(`${e.target.files[0].name} staged for transmission`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    await uploadDataset(data);
    await submitDatasetRequest(data);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" 
        onClick={loading ? undefined : onClose}
      />

      {/* Modal: Obsidian Frame */}
      <div className="relative bg-[#0A0A0A] w-full max-w-2xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Technical Status Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-900">
          <div 
            className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors z-10 p-2">
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-indigo-500 mb-4">
                  <Terminal size={14} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Request_Phase_01 // Classification</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tighter italic">Bespoke Architecture</h2>
                <p className="text-zinc-500 text-sm mt-2 font-light">Select the foundational domain for your synthetic or curated data project.</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                {['Computer Vision', 'Natural Language', 'Audio / Speech', 'Tabular / Finance'].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    className={`p-6 transition-all duration-300 text-left group relative ${
                      formData.domain === domain ? 'bg-indigo-500/5' : 'bg-[#050505] hover:bg-[#080808]'
                    }`}
                    onClick={() => { setFormData({...formData, domain}); setStep(2); }}
                  >
                    <span className={`block text-xs font-bold mb-1 uppercase tracking-widest ${formData.domain === domain ? 'text-indigo-400' : 'text-zinc-300'}`}>{domain}</span>
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Select_Endpoint</span>
                    {formData.domain === domain && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-indigo-500 mb-4">
                  <Terminal size={14} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Request_Phase_02 // Technicals</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tighter italic">Project Brief</h2>
              </header>

              <div className="space-y-8">
                {/* Method Toggle: Sharp Density */}
                <div className="flex bg-black border border-zinc-900 p-1">
                  <button type="button" onClick={() => setUploadMethod('link')} className={`flex-1 py-2 text-[10px] font-mono font-bold tracking-widest transition-all ${uploadMethod === 'link' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>SOURCE_LINK</button>
                  <button type="button" onClick={() => setUploadMethod('upload')} className={`flex-1 py-2 text-[10px] font-mono font-bold tracking-widest transition-all ${uploadMethod === 'upload' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>LOCAL_UPLOAD</button>
                </div>

                {uploadMethod === 'link' ? (
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">// Reference_URL</label>
                    <div className="relative">
                      <input name="sourceLink" value={formData.sourceLink} onChange={handleInputChange} type="url" placeholder="S3, GCS, or Cloud storage endpoint" className="w-full bg-zinc-950 border border-zinc-900 rounded-sm p-4 pl-12 text-white text-xs outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-800" />
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-zinc-800 bg-zinc-950 p-8 flex flex-col items-center justify-center hover:border-indigo-500/40 transition-all cursor-pointer group"
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <Upload className="text-zinc-700 group-hover:text-indigo-400 mb-3" size={24} />
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{formData.uploadedFile ? formData.uploadedFile.name : 'Initialize_Upload'}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">// Specifications</label>
                  <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} rows={3} placeholder="Labeling taxonomy, edge case protocols, dataset constraints..." className="w-full bg-zinc-950 border border-zinc-900 rounded-sm p-4 text-white text-xs outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-zinc-800" />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 text-zinc-600 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-[2] py-4 bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">Proceed <ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-indigo-500 mb-4">
                  <Terminal size={14} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Request_Phase_03 // Finalization</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tighter italic">System Logistics</h2>
              </header>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Volume_Target</label>
                    <input name="volume" value={formData.volume} onChange={handleInputChange} type="text" placeholder="e.g. 50k Instances" className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Asset_Format</label>
                    <input name="format" value={formData.format} onChange={handleInputChange} type="text" placeholder="COCO, YOLO, JSON..." className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500/50" />
                  </div>
                </div>

                {/* Secure Review Badge */}
                <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 flex gap-5 items-center">
                  <ShieldCheck size={24} className="text-indigo-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-200 font-bold uppercase tracking-tight mb-1">Architectural Review Triggered</p>
                    <p className="text-[9px] text-zinc-600 leading-relaxed font-mono">Your brief will be routed to a Senior Data Engineer. Technical feasibility and node-assignment cost matrix will follow via secure endpoint.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 text-zinc-600 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-4 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <>Transmit_Protocol <Send size={14} /></>}
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