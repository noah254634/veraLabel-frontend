import React, { useEffect, useState } from "react";
import { Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "./passwordInput";
import { useAuthStore } from "./useAuthstore";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error, login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = String(user.role).toLowerCase();
      if (role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
      if (role === "buyer") {
        navigate("/buyer", { replace: true });
        return;
      }
      if (role === "labeler" || role === "labeller") {
        const key = `labellerOnboardingCompleted:${user._id ?? user.email}`;
        const completed = localStorage.getItem(key) === "true";
        navigate(completed ? "/labeller" : "/labeller/onboarding", { replace: true });
        return;
      }
      if (role === "reviewer") {
        navigate("/reviewer", { replace: true });
        return;
      }
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header: Centered on mobile, precise alignment */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4 text-indigo-500 justify-center md:justify-start">
          <ShieldCheck size={18} strokeWidth={2.5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
            Auth_Gateway_01
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter text-center md:text-left">
          Welcome back<span className="text-indigo-600">.</span>
        </h2>
        <p className="text-zinc-500 mt-4 font-light text-sm text-center md:text-left leading-relaxed">
          Access your <span className="text-zinc-300">verified workstation</span> and 
          managed data pipelines.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Email Field: Sharper, no ring-border, focus-bottom */}
        <div className="space-y-3 group">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
            // Identity_Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors"
              size={16}
            />
            <input
              type="email"
              placeholder="lead@infrastructure.ai"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-3 group">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors">
              // Access_Key
            </label>
            <Link
              to="/forgot-password"
              className="text-[10px] font-bold text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <PasswordInput
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-8 pr-10 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
            />
          </div>
        </div>

        {/* Error Alert: High-density styling */}
        {error && (
          <div className="p-4 border-l-2 border-red-900 bg-red-950/10 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-red-500 text-[11px] font-mono uppercase tracking-wider flex items-center gap-3">
              <span className="h-1 w-1 bg-red-500 rounded-full" />
              Auth_Error: {error}
            </p>
          </div>
        )}

        {/* Submit Button: Sharp Corners, Solid Impact */}
        <button
          disabled={loading}
          className="w-full group relative flex items-center justify-center gap-3 bg-zinc-100 hover:bg-white text-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Initialize Session
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer: Subtle and wide-spaced */}
      <div className="mt-12 pt-8 border-t border-zinc-900/50">
        <p className="text-center text-[11px] text-zinc-600 font-light tracking-wide">
          UNAUTHORIZED ACCESS IS LOGGED.{" "}
          <Link
            to="/signup"
            className="text-zinc-300 font-bold hover:text-indigo-400 transition-colors ml-2 uppercase tracking-tighter"
          >
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;