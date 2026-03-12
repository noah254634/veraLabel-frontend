import type { ReactNode } from "react"
import React, { useState } from "react"
import { Menu, X, Activity } from "lucide-react";

type AppLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
};

export function AppLayout({ children, sidebar, header }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    /* 1. FIXED HEIGHT VIEWPORT: Prevents the whole page from scrolling */
    <div className="h-screen w-full bg-[#020203] text-zinc-100 flex overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Now using h-full to stay locked */}
      <aside
        className={`fixed top-0 left-0 bg-[#050505] border-zinc-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[70]
        w-[280px] h-full border-r flex flex-col
        md:translate-x-0 ${sidebarOpen ? "translate-x-0 shadow-2xl shadow-indigo-500/10" : "-translate-x-full"}`}
      >
        <div className="p-6 shrink-0 flex items-center justify-between border-b border-zinc-900/50">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="h-5 w-5 bg-indigo-600 rounded-sm" />
            VeraLabel<span className="text-indigo-500">.</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-1">
            {sidebar}
          </div>
        </div>
      </aside>

      {/* Main Container: Controlled flex growth */}
      <div className="flex-1 flex flex-col md:ml-[280px] min-w-0 h-full relative">
        
        {/* Header: Locked to top */}
        <header className="h-16 shrink-0 bg-[#020203]/80 backdrop-blur-xl border-b border-zinc-900 flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-zinc-400 md:hidden hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            
            <div className="text-sm font-mono uppercase tracking-widest text-zinc-500 truncate">
              {header || "// System_Active"}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-sm">
                <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Node_Secure</span>
             </div>
          </div>
        </header>

        {/* 2. THE CONTENT STAGE: This handles all internal scrolling */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#020203]">
           {/* Global Subtle Ambient Glow */}
           <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />
           
           {/* Internal Scroll Wrapper */}
           <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto min-h-full">
                 {children}
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}