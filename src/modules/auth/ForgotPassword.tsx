import React, { useState } from "react";
import { Mail, KeyRound, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { PasswordInput } from "./passwordInput";
import { useAuthStore } from "./useAuthstore";
import toast from "react-hot-toast";
import { api } from "../../shared/types/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request code, 2: Verify/Reset
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { forgotPassword } = useAuthStore();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const message = await forgotPassword(email);
      toast.success(message);
      setStep(2);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send reset code.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/resetPassword", {
        email,
        token: code,
        password: newPassword,
      });
      const message = response.data?.message ?? "Password updated successfully.";
      toast.success(message);
      // Redirect to login after a short delay
      setTimeout(() => window.location.assign("/login"), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Reset failed. Invalid or expired code.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-indigo-500 justify-center md:justify-start">
          <KeyRound size={18} strokeWidth={2.5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
            Protocol_Recovery_{step === 1 ? "01" : "02"}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tighter text-center md:text-left">
          {step === 1 ? "Reset Access Key" : "Verify Identity"}
        </h2>
        <p className="text-zinc-500 mt-4 font-light text-sm text-center md:text-left leading-relaxed">
          {step === 1
            ? "Initiate a secure recovery sequence for your workstation credentials."
            : `An authorization code has been dispatched to ${email || "your endpoint"}.`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border-l-2 border-red-900 bg-red-950/10 animate-in fade-in zoom-in-95 duration-300">
          <p className="text-red-500 text-[11px] font-mono uppercase tracking-wider flex items-center gap-3">
            <span className="h-1 w-1 bg-red-500 rounded-full" />
            Auth_Error: {error}
          </p>
        </div>
      )}

      {step === 1 ? (
        <form className="space-y-8" onSubmit={handleRequestCode}>
          <div className="space-y-3 group">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
              // Registered_Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors"
                size={16}
              />
              <input
                type="email"
                placeholder="lead@infrastructure.ai"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full group relative flex items-center justify-center gap-3 bg-zinc-100 hover:bg-white text-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                Transmit Recovery Code
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form className="space-y-8" onSubmit={handleResetPassword}>
          <div className="space-y-3 group">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
              // Authorization_Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-center text-2xl tracking-[1em] font-mono text-white transition-all placeholder:text-zinc-800"
            />
          </div>

          <div className="space-y-3 group">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
              // New_Access_Key
            </label>
            <PasswordInput
              name="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-8 pr-10 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-4 font-bold text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Credentials"}
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-zinc-900/50">
        <div className="flex items-start gap-3 p-4 bg-amber-950/5 border-l border-amber-900/50">
          <ShieldAlert size={14} className="text-amber-600 mt-0.5" />
          <p className="text-[10px] text-zinc-500 leading-relaxed italic">
            Recovery attempts are logged via IP telemetry. Excessive failed
            attempts result in temporary node lockout.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            Return to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
