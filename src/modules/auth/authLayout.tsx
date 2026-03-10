import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-[#020203] selection:bg-indigo-500/30">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Top-focused glow for mobile visibility */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-indigo-600/10 blur-[100px] rounded-full opacity-60" />
        {/* Responsive Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Persistent Branding: Centered on mobile, top-right on desktop */}
      <div className="absolute top-8 left-0 right-0 md:left-auto md:right-12 z-20 flex justify-center md:block">
        <Link 
          to="/" 
          className="text-white font-bold text-xl md:text-2xl tracking-tighter transition-all active:scale-95 hover:text-indigo-200"
        >
          VeraLabel<span className="text-indigo-500">.</span>
        </Link>
      </div>

      {/* Content Container: Full width on small mobile, fixed on desktop */}
      <div className="relative z-10 w-full max-w-[460px] px-4 md:px-6 mt-12 md:mt-0">
        <div className="relative group">
          
          {/* Subtle Glow Ring - Adjusted for mobile edges */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-zinc-800 to-transparent rounded-3xl md:rounded-[2rem] -z-10 group-hover:from-indigo-500/30 transition-all duration-700" />
          
          {/* The Card: High-density blur and sharper mobile edges */}
          <div className="bg-zinc-900/80 backdrop-blur-3xl p-7 md:p-12 rounded-3xl md:rounded-[2rem] shadow-2xl border border-white/[0.03]">
            
            {/* Top accent line: Slimmer for modern look */}
            <div className="w-10 h-1 bg-indigo-500 rounded-full mb-10 md:mb-12 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
            
            <div className="text-white animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Support Footer: Refined typography */}
        <div className="mt-10 md:mt-12 text-center">
          <p className="text-zinc-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed">
            Secure Infrastructure <br className="md:hidden" /> for Global AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;