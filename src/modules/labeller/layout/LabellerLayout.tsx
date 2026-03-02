import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export const LabellerLayout = () => {
  return (
    // Ensure no 'gap' here. w-full and h-screen prevent outside margins.
    <div className="flex h-screen w-full bg-[#07090D] text-white overflow-hidden font-inter">
      
      {/* 1. SIDEBAR: Force a fixed width so the content area knows where to start */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]">
        
        {/* 2. TOPBAR: Flush against the Sidebar border */}
        <header className="h-16 border-b border-white/5 bg-[#0B0E14]/40 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Portal</span>
             <span className="text-xs text-blue-400 font-medium">Labeller Dashboard</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-8 w-[1px] bg-white/5" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Noah Khaemba</span>
              <span className="text-xs text-green-400 font-mono font-bold">$1,240.50</span>
            </div>
          </div>
        </header>

        {/* 3. MAIN CONTENT: Remove 'p-8' if you want the dashboard to touch the edges, 
            but keep it if you want the cards centered. */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};