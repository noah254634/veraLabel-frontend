import type { ReactNode } from "react"
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { useState } from "react";

type AppLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
};

export function AppLayout({ children, sidebar, header }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-950 border-r border-slate-800 p-4 transition-transform duration-300 ease-in-out z-20
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        w-64`}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        {header && (
          <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between">
            {header}
            {/* Toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-100 md:hidden"
            >
              {sidebarOpen ? "Close" : "Menu"}
            </button>
          </header>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
