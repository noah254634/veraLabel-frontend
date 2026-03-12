import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LoginPage from "./modules/auth/Login";
import AuthLayout from "./modules/auth/authLayout";
import SignupPage from "./modules/auth/Signup";
import { Toaster } from "react-hot-toast";
import LandingPage from "./modules/landingPage/pages/LandingPage";
import HelpPage from "./modules/landingPage/components/help";
import ProtectedRoute from "./app/router/ProtectedRoute";
import { AdminRoutes } from "./modules/admin/routes";
import BuyerRoutes from "./modules/buyer/routes";
import LabellerRoutes from "./modules/labeller/routes";
import { useEffect } from "react";
import { useAuthStore } from "./modules/auth/useAuthstore";
import "./app.css";
import PaymentVerify from "./modules/buyer/PaymentVerify";
// @ts-ignore
import { Careers } from "./modules/landingPage/FooterComponents/Carreers";
// @ts-ignore
import { Mission } from "./modules/landingPage/FooterComponents/Mission.jsx";
// @ts-ignore
import { About } from "./modules/landingPage/FooterComponents/About";
import { PrivacyPolicy } from "./modules/landingPage/pages/privacyPolicy";
// @ts-ignore
import { DataPolicy } from "./modules/landingPage/FooterComponents/DataPolicy";
import { Contact } from "./modules/landingPage/FooterComponents/Contact";
import { Terms } from "./modules/landingPage/FooterComponents/terms.js";
import ForgotPassword from "./modules/auth/ForgotPassword.js";

export const App = () => {
  const { isRestoringSession, syncAuth } = useAuthStore();
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      syncAuth();
    }
  }, [syncAuth]);

  if (isRestoringSession) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm font-medium animate-pulse">
            Restoring Session...
          </p>
        </div>
      </div>
    );
  }
  return (
    <BrowserRouter>
    <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000, // 1s is a bit too fast to read technical alerts
    style: {
      background: "#0A0A0A", // Matches your Modal and Sidebar
      backdropFilter: "blur(12px)",
      border: "1px solid #18181b", // Zinc-900 hairline
      borderRadius: "2px", // Sharp geometry
      padding: "12px 20px",
      fontSize: "11px",
      fontFamily: "monospace",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#D4D4D8", // Zinc-300
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
    success: {
      iconTheme: {
        primary: "#6366f1", // Indigo accent to match your nodes
        secondary: "#0A0A0A",
      },
      style: {
        borderLeft: "2px solid #6366f1",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444", // Red for system alerts
        secondary: "#0A0A0A",
      },
      style: {
        borderLeft: "2px solid #ef4444",
      },
    },
  }}
/>
      {/* public routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/payments/success" element={<PaymentVerify />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/about" element={<About />} />
        <Route path="/data-policy" element={<DataPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        {/* auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          {AdminRoutes}
          <Route path="buyer/*" element={<BuyerRoutes />} />
          <Route path="labeller/*" element={<LabellerRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
