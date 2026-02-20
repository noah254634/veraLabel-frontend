import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/useAuthstore";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // While redirecting, you can render null or a loading spinner
  if (!isAuthenticated) return null;

  // Render the children (the protected component)
  return <Outlet />;
};

export default ProtectedRoute;
