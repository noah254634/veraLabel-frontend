import { BookOpen, LogOut, ShieldCheck, Target, Trophy } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../auth/useAuthstore";

export const OnboardingSidebar = ({ view, currentStep }: { view: string, currentStep: number }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
      toast.success("Logout successful");
    } catch {
      toast.error("Logout failed");
    }
  };

  const steps = [
    { id: 1, icon: <BookOpen size={16} /> },
    { id: 2, icon: <ShieldCheck size={16} /> },
    { id: 3, icon: <Target size={16} /> },
    { id: 4, icon: <Trophy size={16} />, isFinal: true },
  ];

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-[#0B0E14]/80 backdrop-blur-2xl p-6 md:p-10 flex flex-row md:flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 sticky top-0 z-10">
      <div className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-12 w-full">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-lg">V</span>
          </div>
          <span className="hidden sm:block font-bold tracking-widest text-white uppercase text-xs">VeraLabel</span>
        </div>
        {/* Mobile: always allow sign out while onboarding blocks the app */}
        <button
          type="button"
          onClick={handleLogout}
          className="md:hidden ml-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>

        {/* Adaptive Step Indicator */}
        <nav className="flex flex-row md:flex-col flex-1 justify-around md:justify-start md:space-y-8 w-full">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-4 relative">
              <div className={`z-10 p-2 md:p-3 rounded-xl transition-all duration-500 ${
                (currentStep >= s.id || (s.isFinal && view === 'SUCCESS')) 
                ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-white/5 text-gray-500'
              }`}>
                {s.icon}
              </div>
              {/* Connector Line (Desktop) */}
              {i !== steps.length - 1 && (
                <div className="hidden md:block absolute left-[19px] top-10 w-[2px] h-8 bg-white/5">
                  <div className={`h-full bg-blue-500 transition-all duration-700 ${currentStep > s.id ? 'w-full' : 'h-0'}`} />
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Branding (Desktop Only) */}
      <div className="hidden md:block pt-6 border-t border-white/5">
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Noah Khaemba-pioneer</p>
        <p className="text-[9px] text-blue-500/60 font-medium uppercase mt-1">Class of 2026</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default OnboardingSidebar;