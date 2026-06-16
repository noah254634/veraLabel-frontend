import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, User, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordInput } from './passwordInput';
import { useAuthStore } from './useAuthstore';
import RoleToggle from './RoleToggle';

const SignupPage = () => {
  const { loading, error, signup, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = String(user.role).toLowerCase();
      if (role === "buyer") navigate("/buyer", { replace: true });
      else if (role === "labeler" || role === "labeller") navigate("/labeller/onboarding", { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedRole: "buyer" | "seller") => {
    setRole(selectedRole);
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate(`/verify?email=${encodeURIComponent(formData.email)}`, { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-2 duration-700">

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4 text-indigo-500 justify-center md:justify-start">
          <ShieldCheck size={18} strokeWidth={2.5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
            Auth_Registration_01
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter text-center md:text-left">
          Create Account<span className="text-indigo-600">.</span>
        </h2>
        <p className="text-zinc-500 mt-4 font-light text-sm text-center md:text-left leading-relaxed">
          Access the infrastructure powering 
          <span className="text-zinc-300"> inclusive, representative AI training</span>.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-3 group">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
            // Full_Name
          </label>
          <div className="relative">
            <User
              className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors"
              size={16}
            />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Noah Khaemba" 
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
            />
          </div>
        </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="lead@infrastructure.ai" 
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
            />
          </div>
        </div>
        
        <div className="space-y-3 group">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
            // Access_Key
          </label>
          <div className="relative">
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="w-full pl-8 pr-10 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-sm font-light"
            />
          </div>
          <p className="text-[10px] text-zinc-600 ml-1 font-medium tracking-wide">MINIMUM 8 CHARACTERS</p>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 ml-1">
            // User_Role
          </label>
          <RoleToggle role={role} onChange={handleRoleChange} />
        </div>

        {error && (
          <div className="p-4 border-l-2 border-red-900 bg-red-950/10 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-red-500 text-[11px] font-mono uppercase tracking-wider flex items-center gap-3">
              <span className="h-1 w-1 bg-red-500 rounded-full" />
              Auth_Error: {error}
            </p>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full group flex items-center justify-center gap-3 bg-zinc-100 hover:bg-white text-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Create Enterprise Account
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-zinc-900/50">
        <p className="text-center text-[11px] text-zinc-600 font-light tracking-wide">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-zinc-300 font-bold hover:text-indigo-400 transition-colors uppercase tracking-tighter"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;