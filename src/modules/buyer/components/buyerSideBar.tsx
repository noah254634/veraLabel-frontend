import { FaSignOutAlt } from "react-icons/fa";
import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  Settings,
  LogOut,
  Database,
  Terminal
} from "lucide-react";

function BuyerSideBar() {
  return (
    <nav className="flex flex-col h-full py-4">
      {/* Infrastructure Section Label */}
      <div className="px-4 mb-4 flex items-center gap-2 opacity-30">
        <Terminal size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Market_Operator_v1
        </span>
      </div>

      <div className="space-y-1">
        <NavItem 
          to="/buyer" 
          label="Control Center" 
          icon={<LayoutDashboard size={18} strokeWidth={1.5} />} 
          end
        />
        
        <NavItem 
          to="/buyer/browse" 
          label="Asset Registry" 
          icon={<Search size={18} strokeWidth={1.5} />} 
        />
        
        <NavItem 
          to="/buyer/order" 
          label="Transaction Logs" 
          icon={<ClipboardList size={18} strokeWidth={1.5} />} 
        />
      </div>

      {/* System Divider */}
      <div className="my-8 border-t border-zinc-900 mx-4" />

      <div className="px-4 mb-4 flex items-center gap-2 opacity-30">
        <Database size={12} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
          Configuration
        </span>
      </div>

      <div className="space-y-1">
        <NavItem 
          to="/buyer/settings" 
          label="System Settings" 
          icon={<Settings size={18} strokeWidth={1.5} />} 
        />
        
        <NavItem 
          to="/buyer/logout" 
          label="Terminate Session" 
          icon={<LogOut size={18} strokeWidth={1.5} />} 
          className="text-zinc-500 hover:text-red-400 transition-colors"
        />
      </div>

      {/* Bottom Identity Node (Optional visual flare) */}
      <div className="mt-auto px-4 pt-10">
        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-sm">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Node_01_Online</span>
            </div>
        </div>
      </div>
    </nav>
  );
}

export default BuyerSideBar;