import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../auth/useAuthstore";
import { OnboardingEnforcer } from "../onboarding/Onboarding";
import { Terminal, ShieldCheck, Wallet } from "lucide-react";

export const LabellerLayout = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const role = user ? String(user.role).toLowerCase() : "";
  const onboardingKey = user ? `labellerOnboardingCompleted:${user._id ?? user.email}` : null;
  const onboardingCompleted = onboardingKey ? localStorage.getItem(onboardingKey) === "true" : false;
  
  const shouldForceOnboarding =
    (role === "labeler" || role === "labeller") &&
    !onboardingCompleted &&
    !location.pathname.startsWith("/labeller/onboarding");

  return (
    /* 1. STYLES: Switched to Obsidian #020203 and removed font-inter for system sans */
    <div className="flex h-screen w-full bg-[#020203] text-zinc-300 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {shouldForceOnboarding && <OnboardingEnforcer />}

      {/* 2. SIDEBAR: Ensure your Sidebar component uses the same fixed-width logic as the Admin/Buyer sidebars */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Subtle Ambient Glow to replace the blue radial gradient */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />

        {/* 3. TOPBAR: Glassmorphism with technical monospaced details */}
        <header className="h-16 shrink-0 border-b border-zinc-900 bg-[#020203]/80 backdrop-blur-xl flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/5 border border-indigo-500/10 rounded-sm">
                <Terminal size={14} className="text-indigo-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-[0.2em]">
                Interface_Active
              </span>
              <span className="text-xs font-bold text-white tracking-tight italic">
                Operator Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* System Status Bit */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-tighter">Node_01_Online</span>
            </div>

            <div className="h-6 w-px bg-zinc-800" />
            
            {/* Identity & Wallet */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                  {user?.name || "Anonymous_Node"}
                </span>
                <div className="flex items-center gap-1.5">
                    <Wallet size={12} className="text-zinc-600" />
                    <span className="text-xs text-indigo-400 font-mono font-bold tabular-nums">
                        $1,240.50
                    </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 4. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Outlet />
            {children}
          </div>

          {/* Technical Footer Accent */}
          <footer className="mt-20 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-20 pb-10">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Authorized_Operator_Only</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em]">VeraLabel_Infrastructure_v4</span>
          </footer>
        </main>
      </div>
    </div>
  );
};