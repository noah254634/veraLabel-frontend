import { useState } from 'react';
import { ChevronRight, Target, ShieldAlert, CheckCircle2, Zap, Globe } from 'lucide-react';

export const OnboardingSlides = ({ mode, onComplete }: any) => {
  const [agreed, setAgreed] = useState(false);

  if (mode === 'LEARNING') {
    return (
      <div className="h-full flex flex-col animate-in fade-in duration-700 max-w-5xl mx-auto w-full">
        <div className="relative mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Quality Standards & Rules
          </h2>
          <p className="text-zinc-400 mt-2 text-lg">
            High-quality annotations are the foundation of AI. We reward accuracy and precision.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-indigo-600/20 py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "PRECISION",
                title: "Pixel-Perfect Accuracy",
                desc: "Bounding boxes and labels must fit objects tightly and accurately without missing parts.",
                icon: <Target className="text-indigo-500" size={24} />,
              },
              {
                id: "ISOLATION",
                title: "No Overlaps",
                desc: "Keep separate objects distinct. Ensure boundaries don't improperly overlap unless required.",
                icon: <ShieldAlert className="text-indigo-500" size={24} />,
              },
              {
                id: "INTEGRITY",
                title: "Quality = Higher Pay",
                desc: "Maintaining above 95% accuracy promotes you to higher tiers, unlocking premium tasks.",
                icon: <CheckCircle2 className="text-indigo-500" size={24} />,
              }
            ].map((item) => (
              <div key={item.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all group">
                <div className="mb-4 p-3 bg-indigo-500/10 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-white text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex gap-4 items-start">
             <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
               <ShieldAlert size={20} className="text-indigo-400" />
             </div>
             <div>
               <h4 className="text-white font-bold mb-1">Strict Quality Control</h4>
               <p className="text-sm text-zinc-300 leading-relaxed">
                 Submitting poor-quality or spam annotations will result in immediate task rejection and can lead to account suspension. Take your time to get it right.
               </p>
             </div>
          </div>
        </div>
        
        <div className="pt-6 mt-6 flex flex-col items-center gap-6 border-t border-white/10">
           <label 
             className="flex items-center gap-4 cursor-pointer bg-white/5 hover:bg-white/10 px-6 py-4 rounded-xl border border-white/10 transition-all w-full max-w-lg" 
           >
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="w-5 h-5 rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500 bg-zinc-900 cursor-pointer"
              />
              <span className="text-white text-sm font-medium">I understand and agree to maintain these quality standards.</span>
           </label>

           <button
             disabled={!agreed}
             onClick={onComplete}
             className={`w-full max-w-lg py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
               agreed 
               ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
               : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
             }`}
           >
             Start Practical Assessment <ChevronRight size={20} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto w-full">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Welcome to <span className="text-indigo-500">VeraLabel</span>
        </h2>
        <p className="text-xl text-zinc-400 font-medium leading-relaxed">
          Join our global network of labellers. Train advanced AI models through precise data annotation and get paid for high-quality work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-indigo-500/10 rounded-xl mt-1">
                <Globe className="text-indigo-500" size={24} />
             </div>
             <div>
                <h3 className="text-white text-lg font-bold">Global Opportunities</h3>
                <p className="text-zinc-400 text-sm mt-1">Access tasks from anywhere in the world and earn on a flexible schedule.</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="p-3 bg-indigo-500/10 rounded-xl mt-1">
                <Zap className="text-indigo-500" size={24} />
             </div>
             <div>
                <h3 className="text-white text-lg font-bold">Fast Payouts</h3>
                <p className="text-zinc-400 text-sm mt-1">Withdraw your earnings directly to M-Pesa or via Bank Transfer quickly and securely.</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-8">
           <button 
             onClick={onComplete} 
             className="w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-lg font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-3"
           >
             Get Started <ChevronRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};
