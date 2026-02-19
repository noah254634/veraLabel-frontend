import React, { useState } from 'react';
import { Mail, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PasswordInput } from './passwordInput';
import { useAuthStore } from './useAuthstore';

const SignupPage = () => {
  const { loading, error, signup } = useAuthStore();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
        <p className="text-gray-500 mt-2">Join VeraLabel and start managing your data.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Noah Khaemba" 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" 
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Email address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@kibabii.ac.ke" 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" 
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <PasswordInput 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••" 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full cursor-pointer bg-[#635bff] hover:bg-[#0a2540] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(99,91,255,0.39)] active:scale-[0.98]"
        >
          {loading ? "Creating account..." : "Get started"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          By signing up, you agree to our <span className="text-indigo-600 cursor-pointer hover:underline">Terms</span>.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </>
  );
};

export default SignupPage;
