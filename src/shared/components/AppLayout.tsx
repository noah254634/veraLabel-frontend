import type { ReactNode } from "react"
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"

type AppLayoutProps = {
  children: React.ReactNode
  showSidebar?: boolean
  sidebar?: React.ReactNode
  header?: React.ReactNode
}

export function AppLayout({
  children,
  showSidebar = false,
  sidebar,
  header,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {showSidebar && (
        <aside className="w-64 bg-slate-900 border-r border-slate-800">
          {sidebar}
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        {header && (
          <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
            {header}
          </header>
        )}

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
