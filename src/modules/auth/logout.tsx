import { useAuthStore } from "./useAuthstore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
const LogoutButton = () => {
    const navigate = useNavigate();
  // 1. Hooks must be at the top level of the component
  const { logout } = useAuthStore();

  // 2. Define the click handler correctly
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
      toast.success("Logout successful");
      //useNavigate()("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  // 3. Return the JSX
  return (
    <div
      onClick={handleLogout}
      className="group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 
                 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 
                 cursor-pointer active:scale-95"
    >
      <LogOut className="h-5 w-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
      
      <p className="text-zinc-500 text-[11px] font-mono font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors">
        Terminate_Session
      </p>
    </div>
  );
};

export default LogoutButton;
