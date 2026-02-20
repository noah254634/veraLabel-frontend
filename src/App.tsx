import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./modules/admin/layout/AdminLayout";
import LoginPage from "./modules/auth/Login";
import AuthLayout from "./modules/auth/authLayout";
import SignupPage from "./modules/auth/Signup";
import { Toaster } from "react-hot-toast";
import LandingPage from "./modules/landingPage/pages/LandingPage";
import ProtectedRoute from "./app/router/ProtectedRoute";
//import AdminDashboard from "./modules/admin/pages/Dashboard"; // Example page
const BuyerDashboard = () => <div>Buyer Dashboard</div>; // Placeholder

export const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: "rgba(242, 249, 241, 0.9)", // Match your dark background      color: '#0a2540',
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#10b981", // Emerald green
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // Red
              secondary: "#fff",
            },
          },
        }}
      />
      {/* public routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="admin/*" element={<AdminLayout />} />
          <Route path="dashboard/buyer" element={<BuyerDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
