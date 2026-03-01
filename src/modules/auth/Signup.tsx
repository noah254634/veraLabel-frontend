import React, { useState } from 'react';
import { Mail, ArrowRight, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PasswordInput } from './passwordInput';
import { useAuthStore } from './useAuthstore';
import RoleToggle from './RoleToggle';

const SignupPage = () => {
  const { loading, error, signup } = useAuthStore();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

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
    await signup(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Create account
        </h2>
        <p className="text-zinc-400 mt-3 font-light">
          Join the infrastructure for global AI diversity.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
            Full Name
          </label>
          <div className="relative group">
            <User 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" 
              size={18} 
            />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Noah Khaemba" 
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-white transition-all placeholder:text-zinc-700" 
            />
          </div>
        </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@institution.edu" 
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-white transition-all placeholder:text-zinc-700" 
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
            Password
          </label>
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
          <p className="text-[10px] text-zinc-500 ml-1 font-medium tracking-wide">MINIMUM 8 CHARACTERS</p>
        </div>

        {/* Role Toggle */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
            Select Your Role
          </label>
          <RoleToggle role={role} onChange={handleRoleChange} />
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
          className="w-full group flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-black py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-10 pt-8 border-t border-white/5 text-center">
        <p className="text-xs text-zinc-500 leading-relaxed font-light">
          By signing up, you agree to our 
          <span className="text-zinc-300 mx-1 cursor-pointer hover:text-white underline underline-offset-4 decoration-zinc-700">Terms of Service</span>.
        </p>
        <p className="text-sm text-zinc-400 mt-4">
          Already have an account? 
          <Link to="/login" className="text-white font-bold hover:text-indigo-400 transition-colors ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;