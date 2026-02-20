import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a2540]">
      {/* The Universal Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] opacity-30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] bg-gradient-to-tr from-[#3b82f6] via-[#2dd4bf] to-[#6366f1] opacity-20 blur-[120px]" />
      </div>

      {/* Persistent VeraLabel Branding */}
      <div className="absolute top-8 right-8 z-20">
        <Link to="/" className="text-white font-bold text-xl tracking-tight opacity-90 hover:opacity-100 transition-opacity">
          Vera<span className="text-indigo-400">Label</span>
        </Link>
      </div>

      {/* This is where LoginPage, SignupPage, etc., will be injected */}
      <div className="relative z-10 w-full max-w-md mx-4  backdrop-blur-lg p-8 rounded-2xl shadow-lg border-none border-white/20">
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
          <Outlet />
        </div>
      
      </div>
    </div>
  );
};

export default AuthLayout;