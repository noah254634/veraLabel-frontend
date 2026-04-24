import React from "react";
import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  LayoutDashboard,
  Search,
  Zap,
  Wallet,
  Settings,
  HelpCircle,
  Terminal,
  Activity,
  GraduationCap
} from 'lucide-react';
import LogoutButton from "../../auth/logout";

export const LabellerSidebar = () => {
  return (
    <nav className="flex flex-col h-full py-4 selection:bg-indigo-500/30">
      
      {/* --- SECTION 1: LABELLER OPERATIONS --- */}
      <div className="px-4 mb-4 flex items-center gap-2 opacity-30">
        <Terminal size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Labeller_Operations
        </span>
      </div>

      <div className="space-y-1">
        <NavItem
          to="/labeller"
          label="Dashboard"
          icon={<LayoutDashboard size={18} strokeWidth={1.5} />}
          end
        />
        <NavItem 
          to="/labeller/work" 
          label="Find Work" 
          icon={<Search size={18} strokeWidth={1.5} />} 
        />
        <NavItem 
          to="/labeller/workbench" 
          label="Pro Space" 
          icon={<Zap size={18} strokeWidth={1.5} />} 
        />
      </div>

      {/* --- SECTION 2: EARNINGS & REWARDS --- */}
      <div className="mt-8 px-4 mb-4 flex items-center gap-2 opacity-30">
        <Activity size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Earnings_Rewards
        </span>
      </div>

      <div className="space-y-1">
        <NavItem 
          to="/labeller/wallet" 
          label="Wallet & Payouts" 
          icon={<Wallet size={18} strokeWidth={1.5} />} 
        />
      </div>

      {/* --- SECTION 3: TRAINING & SETTINGS --- */}
      <div className="mt-8 px-4 mb-4 flex items-center gap-2 opacity-30">
        <GraduationCap size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Training_Config
        </span>
      </div>

      <div className="space-y-1">
        <NavItem 
          to="/labeller/onboarding" 
          label="Training Programs" 
          icon={<GraduationCap size={18} strokeWidth={1.5} />} 
        />
        <NavItem 
          to="/labeller/settings" 
          label="Preferences" 
          icon={<Settings size={18} strokeWidth={1.5} />} 
        />
      </div>

      {/* --- BOTTOM: SUPPORT & LOGOUT --- */}
      <div className="mt-auto pt-8 px-4 mb-4 flex items-center gap-2 opacity-30">
        <HelpCircle size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Support
        </span>
      </div>

      <div className="px-4 space-y-1">
        <LogoutButton />
      </div>

      {/* Status Indicator */}
      <div className="mt-auto px-4 pt-8">
        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-sm">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Node_Labeller_Active</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LabellerSidebar;
