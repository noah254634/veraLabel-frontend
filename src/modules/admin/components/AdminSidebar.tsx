import React from "react";
import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  Gauge,
  Database,
  Bot,
  Layers,
  Users,
  Settings,
  HelpCircle,
  Terminal,
  Activity,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import LogoutButton from "../../auth/logout";

export const AdminSidebar = () => {
  return (
    <nav className="flex flex-col h-full py-4 selection:bg-indigo-500/30">
      
      {/* --- SECTION 1: SYSTEM CORE --- */}
      <div className="px-4 mb-4 flex items-center gap-2 opacity-30">
        <Terminal size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          System_Core_v4
        </span>
      </div>

      <div className="space-y-1">
        <NavItem
          to="/admin/dashboard"
          label="Root_Dashboard"
          icon={<Gauge size={18} strokeWidth={1.5} />}
        />
        <NavItem 
          to="/admin/users" 
          label="Personnel_Registry" 
          icon={<Users size={18} strokeWidth={1.5} />} 
        />
      </div>

      {/* --- SECTION 2: INFRASTRUCTURE --- */}
      <div className="mt-8 px-4 mb-4 flex items-center gap-2 opacity-30">
        <Activity size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Data_Infrastructure
        </span>
      </div>

      <div className="space-y-1">
        <NavItem 
          to="/admin/analytics" 
          label="Analytics_Suite" 
          icon={<TrendingUp size={18} strokeWidth={1.5} />} 
        />
        <NavItem 
          to="/admin/datasets" 
          label="Asset_Inventory" 
          icon={<Layers size={18} strokeWidth={1.5} />} 
        />
        <NavItem 
          to="/admin/projects" 
          label="Bespoke_Projects" 
          icon={<Database size={18} strokeWidth={1.5} />} 
        />
        <NavItem 
          to="/admin/models" 
          label="Neural_Models" 
          icon={<Bot size={18} strokeWidth={1.5} />} 
        />
      </div>

      {/* --- SECTION 3: CONFIGURATION --- */}
      <div className="mt-8 px-4 mb-4 flex items-center gap-2 opacity-30">
        <ShieldCheck size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Security_Auth
        </span>
      </div>

      <div className="space-y-1">
        <NavItem 
          to="/admin/settings" 
          label="Global_Settings" 
          icon={<Settings size={18} strokeWidth={1.5} />} 
        />
        <NavItem 
          to="/admin/help" 
          label="Support_Docs" 
          icon={<HelpCircle size={18} strokeWidth={1.5} />} 
        />
        
        {/* Logout typically sits at the bottom */}
        <div className="pt-4 mt-4 border-t border-zinc-900 mx-2">
          <LogoutButton />
        </div>
      </div>

      {/* --- STATUS NODE --- */}
      <div className="mt-auto px-4 pt-10">
        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-sm">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600">Admin_Session_Secure</span>
          </div>
        </div>
      </div>
    </nav>
  );
};