import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "./passwordInput";
import { useAuthStore } from "./useAuthstore";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error, login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role as string === "admin") navigate("/admin", { replace: true });
      else if (user.role as string === "buyer") navigate("/buyer", { replace: true });
      else navigate("/labeler", { replace: true });
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
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-zinc-400 mt-3 font-light">
          Enter your credentials to access your secure workstation.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
              size={18}
            />
            <input
              type="email"
              placeholder="name@company.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-white transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Password
            </label>
            <Link
              to="/login"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-tighter"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative group">
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3.5 bg-zinc-950 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-white transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-1">
            <p className="text-red-400 text-sm font-medium flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-400" />
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full group relative flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-black py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Sign in to Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <p className="text-center text-sm text-zinc-500 font-light">
          New to the platform?{" "}
          <Link
            to="/signup"
            className="text-white font-bold hover:text-indigo-400 transition-colors ml-1"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;