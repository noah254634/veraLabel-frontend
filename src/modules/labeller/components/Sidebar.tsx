import { Home, Search, LayoutPanelLeft, Wallet, Settings, LogOut, Award,Telescope } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../auth/useAuthstore";
import toast from "react-hot-toast";

export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login", { replace: true });
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
        <aside className="h-full min-h-0 w-64 bg-[#0B0E14] border-r border-white/5 flex flex-col shrink-0">
      {/* BRANDING */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center">
            <span className="text-white font-black text-xl italic">V</span>
          </div>
          <span className="font-bold text-lg tracking-tight">VeraLabel</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 min-h-0 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-4">
        <NavItem to="/labeller" label="Dashboard" icon={<Home size={20} strokeWidth={1.5} />} end />
        <NavItem to="/labeller/work" label="Find Work" icon={<Search size={20} strokeWidth={1.5} />} />
        <NavItem to="/labeller/workbench" label="Pro Space" icon={<LayoutPanelLeft size={20} strokeWidth={1.5} />} />
        <NavItem to="/labeller/wallet" label="Wallet" icon={<Wallet size={20} strokeWidth={1.5} />} />
        <NavItem to="/labeller/onboarding" label="Onboarding" icon={<Telescope size={20} strokeWidth={1.5} />} />
        <div className="pt-8 pb-4 px-3">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[2px]">Configuration</p>
        </div>
        
        <NavItem to="/labeller/settings" label="Settings" icon={<Settings size={20} strokeWidth={1.5} />} />
      </nav>

      {/* BOTTOM WIDGET: PROGRESS & LOGOUT */}
      <div className="p-4 mt-auto">
        <div className="bg-[#161B22] rounded-2xl p-4 border border-white/5 mb-4">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Award size={14} />
            <span className="text-[10px] font-bold uppercase">Level: Gold</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full w-[70%] rounded-full" />
          </div>
          <p className="text-[9px] text-gray-500 mt-2 text-center italic">120 XP to Diamond</p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all text-sm font-medium">
          <LogOut size={18} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// HELPER COMPONENT FOR CLEANER CODE
function NavItem({ to, label, icon, end = false }: { to: string; label: string; icon: any; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]' 
          : 'text-gray-500 hover:text-white hover:bg-white/5'}
      `}
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default Sidebar;
