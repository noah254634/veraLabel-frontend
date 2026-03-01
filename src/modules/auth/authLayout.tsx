import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black selection:bg-indigo-500/30">
      {/* High-End Ambient Background */}
      <div className="absolute inset-0 z-0">
        {/* Top Glow */}
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        {/* Subtle Mesh Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Persistent VeraLabel Branding */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:translate-x-0 z-20">
        <Link 
          to="/" 
          className="text-white font-bold text-2xl tracking-tighter transition-transform active:scale-95 block"
        >
          VeraLabel<span className="text-indigo-500">.</span>
        </Link>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[440px] px-6">
        <div className="relative group">
          {/* Decorative Border Glow */}
          <div className="absolute -inset-px bg-gradient-to-b from-white/20 to-transparent rounded-[2rem] -z-10 group-hover:from-indigo-500/40 transition-colors duration-500" />
          
          <div className="bg-zinc-900/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/5">
            {/* Top accent line */}
            <div className="w-12 h-1 bg-indigo-500 rounded-full mb-8" />
            
            <div className="text-white">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em]">
            Secure Infrastructure for Global AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;