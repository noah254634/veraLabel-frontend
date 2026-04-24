import React, { createContext, useContext } from 'react';

interface SidebarContextType {
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ 
  children, 
  setSidebarOpen 
}: { 
  children: React.ReactNode; 
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <SidebarContext.Provider value={{ setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}
