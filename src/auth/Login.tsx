import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PasswordInput } from './passwordInput';
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" placeholder="admin@kibabii.ac.ke" className="w-full pl-10 py-2 border rounded-lg outline-none" />
            </div>
          </div>
          
          <PasswordInput label="Password" placeholder="••••••••" />

          <div className="text-right">
            <Link title="Forgot Password" to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
            Sign In <ArrowRight size={18} />
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          New here? <Link to="/signup" className="text-blue-600 font-bold">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;