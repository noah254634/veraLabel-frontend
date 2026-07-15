import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  Activity,
  Zap,
  CheckCircle,
  Fingerprint
} from 'lucide-react';
import LogoutButton from "../../auth/logout";

export const ReviewerSidebar = () => {
  return (
    <nav className="flex flex-col h-full py-4 selection:bg-indigo-500/30">
      
      <div className="px-4 mb-4 flex items-center gap-2 opacity-30">
        <Fingerprint size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Reviewer Portal
        </span>
      </div>

      <div className="space-y-1">
        <NavItem
          to="/reviewer/dashboard"
          label="Dashboard"
          icon={<Activity size={18} strokeWidth={1.5} />}
        />
        <NavItem 
          to="/reviewer/queue" 
          label="Review Queue" 
          icon={<Zap size={18} strokeWidth={1.5} className="text-indigo-500" />} 
        />
        <NavItem 
          to="/reviewer/history" 
          label="Review History" 
          icon={<CheckCircle size={18} strokeWidth={1.5} />} 
        />
      </div>

      <div className="pt-4 mt-4 border-t border-zinc-900 mx-2">
        <LogoutButton />
      </div>

      <div className="mt-auto px-4 pt-10">
        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Node_Active: Bungoma_S01</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-mono uppercase text-zinc-600">
                <span>Buffer_Load</span>
                <span>42%</span>
              </div>
              <div className="w-full h-[2px] bg-zinc-900 overflow-hidden">
                <div className="h-full bg-indigo-500 w-[42%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};