import React from "react";
import { Terminal, ShieldAlert, ShieldCheck, Clock, RefreshCw, LogOut, ArrowRight, HelpCircle } from "lucide-react";
import { useAuthStore } from "../../auth/useAuthstore";

interface VerificationOverlayProps {
  status: "pending" | "rejected";
  adminNotes?: string;
  onReset: () => void;
}

export const VerificationOverlay: React.FC<VerificationOverlayProps> = ({ status, adminNotes, onReset }) => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-2xl mx-auto my-16 bg-[#050505] border border-zinc-900 rounded-sm p-8 md:p-12 relative overflow-hidden animate-in fade-in duration-500">
      <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        status === "rejected" ? "bg-red-500/10" : "bg-indigo-500/10"
      }`} />
      <div className="relative mb-10">
        <div className="flex items-center gap-2 text-indigo-500 mb-3">
          <Terminal size={14} />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">
            Security_Vetting_Console
          </span>
        </div>
        
        {status === "pending" ? (
          <>
            <h2 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
              <Clock className="text-indigo-400 animate-pulse" size={24} />
              Vetting in Progress
            </h2>
            <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
              Your organization details have been received and recorded in our secure ledger. Our admin team will inspect your website and LinkedIn profiles to authenticate your company credentials.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-500 tracking-tighter flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={24} />
              Verification Declined
            </h2>
            <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
              Your buyer application could not be verified with the details provided. Please check the feedback below, modify your profile, and re-submit for audit.
            </p>
          </>
        )}
      </div>
      {status === "rejected" && (
        <div className="mb-10 p-6 bg-red-500/5 border border-red-500/20 rounded-sm relative">
          <p className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            // Vetting_Feedback
          </p>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            {adminNotes || "No specific comments provided. Please ensure all company websites and LinkedIn profiles are valid and public."}
          </p>
        </div>
      )}
      {status === "pending" && (
        <div className="mb-10 bg-zinc-950/60 border border-zinc-900 rounded-sm p-6 space-y-5">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            // Telemetry_Checklist
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <ShieldCheck size={14} />
              </div>
              <div>
                <p className="text-xs font-mono text-white">01. ONBOARDING_SUBMITTED</p>
                <p className="text-[10px] text-zinc-500 font-light">Company info successfully recorded</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600 animate-pulse">
                <Clock size={12} />
              </div>
              <div>
                <p className="text-xs font-mono text-zinc-400">02. ADMIN_VETTING_PROCESS</p>
                <p className="text-[10px] text-zinc-500 font-light">Credentials and LinkedIn link verification active</p>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-40">
              <div className="flex-shrink-0 h-6 w-6 rounded-full border border-zinc-900 bg-zinc-950 flex items-center justify-center text-zinc-700">
                <ArrowRight size={12} />
              </div>
              <div>
                <p className="text-xs font-mono text-zinc-500">03. DATA_REGISTRY_ACTIVATION</p>
                <p className="text-[10px] text-zinc-600 font-light">Enables full write access to the marketplace</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-zinc-900">
        <button
          onClick={handleLogout}
          className="px-6 py-3 border border-zinc-900 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white transition-all text-xs font-mono uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
        >
          <LogOut size={12} /> Terminate Session
        </button>

        {status === "rejected" ? (
          <button
            onClick={onReset}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-mono uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
          >
            <RefreshCw size={12} /> Re-Submit Details
          </button>
        ) : (
          <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-mono justify-center">
            <HelpCircle size={12} /> Questions? Contact support@veralabel.com
          </div>
        )}
      </div>
    </div>
  );
};
