import React, { use } from "react";
import { useAuthStore } from "./useAuthstore";
import toast from "react-hot-toast";
import { NavItem } from "../../shared/components/navigation/NavItem";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const LogoutButton = () => {
    const navigate = useNavigate();
  // 1. Hooks must be at the top level of the component
  const { logout } = useAuthStore();

  // 2. Define the click handler correctly
  const handleLogout = async () => {
    try {
      logout();
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
      className="flex  gap-2 p-3 rounded-md hover:bg-slate-800 cursor-pointer"
    >
      <NavItem to="/admin/logout" label="Logout" icon={<FaSignOutAlt />} />
    </div>
  );
};

export default LogoutButton;
