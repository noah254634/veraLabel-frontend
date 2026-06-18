
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { SidebarProvider } from "../hooks/useSidebar";
import { NotificationBell } from "./NotificationBell";

import { LatencyIndicator } from "./LatencyIndicator";

type AppLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  noPadding?: boolean;
};

export function AppLayout({ children, sidebar, header, noPadding = false }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider setSidebarOpen={setSidebarOpen}>

      <div className="h-screen w-full bg-[#020203] text-zinc-100 flex overflow-hidden font-sans selection:bg-indigo-500/30">

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}


      <aside
        className={`fixed top-0 left-0 bg-[#050505] border-zinc-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[70]
        w-[280px] h-full border-r flex flex-col
        ${sidebarOpen ? "translate-x-0 shadow-2xl shadow-indigo-500/10" : "-translate-x-full"}`}
      >
        <div className="p-6 shrink-0 flex items-center justify-between border-b border-zinc-900/50">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">V</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VeraLabel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>


        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-1">{sidebar}</div>
        </div>
      </aside>


      <div className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-500 ${sidebarOpen ? "md:ml-[280px]" : ""}`}>

        <header className="h-16 shrink-0 bg-[#020203]/80 backdrop-blur-xl border-b border-zinc-900 flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="text-sm font-mono uppercase tracking-widest text-zinc-500 truncate">
              {header || "// System_Active"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LatencyIndicator />
            <NotificationBell />
          </div>
        </header>


        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#020203]">

          <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />


          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
            <div className={noPadding 
              ? "w-full h-full min-h-full flex flex-col flex-1" 
              : "p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto min-h-full flex flex-col flex-1"}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
}

