import type { ReactNode } from "react"
import React, { useState } from "react"
import { Menu, X } from "lucide-react";

type AppLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
};

export function AppLayout({ children, sidebar, header }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bg-gray-950 border-slate-800 p-4 transition-transform duration-300 ease-in-out z-20
        w-full h-auto max-h-screen overflow-y-auto border-b md:w-64 md:h-screen md:border-r md:border-b-0
        md:translate-y-0 ${sidebarOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col md:ml-64"
      >
        {/* Header */}
        <header className={`h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 ${!header ? 'md:hidden' : ''}`}>
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-100 md:hidden mr-4"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {header}
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
