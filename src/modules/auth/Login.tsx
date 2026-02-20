import React, { useEffect } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PasswordInput } from "./passwordInput";
import { useAuthStore } from "./useAuthstore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({email: "", password: ""});
  const { loading, error, login } = useAuthStore();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevents the page from refreshing
  console.log("Form submitted with:", formData); // Log the form data to verify it's correct
  // Call the login function right here
  try {
    await login(formData);
    console.log("Login successful!");
    navigate("/admin/"); // Redirect to the dashboard after successful login
  } catch (err) {
    console.error("Login failed:", err);
  }
};

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-gray-500 mt-2">
          Enter your credentials to access your account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            Email address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="email"
              placeholder="admin@kibabii.ac.ke"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
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
          {loading ? "Verifying..." : "Sign in to your account"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-bold hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
