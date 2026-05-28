import { useState } from 'react';
import { ChevronRight, Target, ShieldAlert, CheckCircle2, Zap, Globe } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

export const OnboardingSlides = ({ mode, onComplete }: any) => {
  const [agreed, setAgreed] = useState(false);

  // THE REFINERY HANDSHAKE (Option #2)
  if (mode === 'LEARNING') {
    return (
      <div className="h-full flex flex-col animate-in fade-in duration-1000">
        <div className="relative mb-8">
          <div className="flex items-center gap-2 mb-2 opacity-40">
             <div className="w-1 h-1 bg-indigo-500 rounded-full" />
             <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Operational_Handshake // v2.0</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Mission<span className="text-indigo-500">_</span>Protocols
          </h2>
          <div className="h-px w-full bg-white/5 mt-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-500/50 w-1/3 animate-shimmer" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8 scrollbar-thin scrollbar-thumb-indigo-600/20 py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "PRECISION",
                title: "Pixel_Precision",
                desc: "Bounding boxes must encapsulate target with sub-pixel accuracy.",
                icon: <Target className="text-indigo-500" size={20} />,
                code: "PRO-01"
              },
              {
                id: "ISOLATION",
                title: "Object_Isolation",
                desc: "Annotations must remain distinct. Zero overlap allowed.",
                icon: <ShieldAlert className="text-indigo-500" size={20} />,
                code: "PRO-02"
              },
              {
                id: "INTEGRITY",
                title: "Semantic_Truth",
                desc: "Labels must reflect absolute ground truth accuracy.",
                icon: <CheckCircle2 className="text-indigo-500" size={20} />,
                code: "PRO-03"
              }
            ].map((item) => (
              <div key={item.id} className="p-6 bg-[#0a0a0c] border border-white/5 rounded-[24px] hover:border-indigo-500/20 transition-all group">
                <div className="mb-4 p-3 bg-indigo-500/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-2 italic">{item.title}</h4>
                <p className="text-zinc-500 text-[10px] leading-relaxed font-bold uppercase tracking-wider">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[24px]">
             <div className="flex gap-4">
                <Zap size={16} className="text-indigo-500 shrink-0" />
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-loose">
                  Refinery Authorization requires total adherence to the above vectors. Failure to maintain 95%+ accuracy results in immediate node de-authorization and marketplace lockout.
                </p>
             </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 mt-6 flex flex-col items-center gap-6">
           <div 
             className="flex items-center gap-4 group cursor-pointer bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/5 transition-all" 
             onClick={() => setAgreed(!agreed)}
           >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-white/10 group-hover:border-indigo-500'}`}>
                 {agreed && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span className="text-white text-[9px] font-black uppercase tracking-widest">Acknowledge_System_Briefing</span>
           </div>

           <button
             disabled={!agreed}
             onClick={onComplete}
             className={`w-full max-w-sm py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-4 ${
               agreed 
               ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-[0.98]' 
               : 'bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
             }`}
           >
             Initialize_Training <ChevronRight size={16} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">V-LAB_Initialization</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
          The<br /><span className="text-indigo-500">Refinery</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed italic">
            "We don't just label data. We refine it into the fuel that powers the world's most advanced AI models."
          </p>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 rounded-xl">
                <Globe className="text-indigo-500" size={20} />
             </div>
             <div>
                <p className="text-white text-[10px] font-black uppercase tracking-widest">Global Network</p>
                <p className="text-zinc-600 text-[8px] uppercase font-bold">Authorized in 24 Regions</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-8">
           <PrimaryButton onClick={onComplete} className="w-full py-6 text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl">
             Enter_Atmosphere <ChevronRight className="ml-3" />
           </PrimaryButton>
           
           <div className="flex items-center gap-2 opacity-20 mx-auto">
              {[1,2,3,4].map(i => <div key={i} className="w-8 h-[1px] bg-white" />)}
           </div>
        </div>
      </div>
    </div>
  );
};
