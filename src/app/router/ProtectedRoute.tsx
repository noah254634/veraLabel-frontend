import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/useAuthstore";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname.startsWith("/admin") && (user?.role as string) !== "admin") {
    return <Navigate to="/" replace />;
  }
  if (location.pathname.startsWith("/buyer") && (user?.role as string) !== "buyer") {
    return <Navigate to="/" replace />;
  }
if (location.pathname.startsWith("/labeler") && (user?.role as string) !== "labeler") {
  return <Navigate to="/" replace />;
}

  // Render the children (the protected component)
  return <Outlet />;
};

export default ProtectedRoute;
