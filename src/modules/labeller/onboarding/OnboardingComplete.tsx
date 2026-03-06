import { ArrowRight, ShieldCheck, Award, Globe, Fingerprint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/useAuthstore";

export const OnboardingComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="text-center p-6 md:p-12 space-y-6 relative overflow-hidden h-full flex flex-col justify-center">
      {/* 1. Global Background Branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
        V-LAB
      </div>

      <div className="relative z-10 space-y-8">
        {/* 2. Professional Certification Icon */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full" />
          <div className="relative w-24 h-24 bg-[#0B0E14] border border-white/5 rounded-[32px] flex items-center justify-center shadow-2xl animate-in zoom-in duration-700">
            <Fingerprint className="text-blue-500/80" size={40} />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Authentication Successful
          </h1>
          <p className="text-gray-500 max-w-sm mx-auto mt-2 text-sm leading-relaxed">
            Welcome to the <span className="text-white font-semibold">VeraLabel Network</span>. Your node is now active and authorized to contribute to Africa's digital infrastructure.
          </p>
        </div>

        {/* 3. The "Network Identity" Card */}
        <div className="flex flex-col gap-3 pt-6 max-w-xs mx-auto">
          <div className="p-5 bg-[#0B0E14] border border-white/5 rounded-3xl shadow-inner relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-blue-500 animate-pulse" />
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">
                  Live Node: 254-NBO
                </span>
              </div>
              <ShieldCheck size={14} className="text-gray-600" />
            </div>

            <div className="text-left mb-6 space-y-1">
              <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Designation</p>
              <p className="text-white font-bold tracking-tight">Silver Tier Pioneer</p>
            </div>

            <button
              onClick={() => {
                if (user) {
                  const key = `labellerOnboardingCompleted:${user._id ?? user.email}`;
                  localStorage.setItem(key, "true");
                }
                navigate("/labeller");
              }}
              className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3 group/btn shadow-lg shadow-blue-900/20"
            >
              Initialize Workspace <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 4. Corporate Footer Branding */}
          <div className="pt-6 border-t border-white/5 mt-4">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]">
              VeraLabel Labs
            </p>
            <div className="flex justify-center items-center gap-3 mt-2 opacity-20">
              <div className="h-[1px] w-8 bg-white" />
              <p className="text-[8px] text-white uppercase font-medium">Refining the Future</p>
              <div className="h-[1px] w-8 bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. System Status Bar */}
      <div className="absolute bottom-8 left-12 right-12 flex items-center gap-4">
        <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-600" />
        </div>
        <span className="text-[8px] text-blue-500/50 font-black tracking-widest uppercase">
          Ready
        </span>
      </div>
    </div>
  );
};