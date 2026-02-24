import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/useAuthstore";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname.startsWith("/admin") && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Render the children (the protected component)
  return <Outlet />;
};

export default ProtectedRoute;
