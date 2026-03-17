import React, { useState } from 'react';
import RegistryHeader from './RegistryHeader';
import GlobalHealth from './GlobalHealth';
import ControlBar from './ControlBar';
import ProjectCard from './ProjectCard';
import TaskConsole from './TaskConsole';
import { LayoutGrid, Activity, Terminal } from 'lucide-react';

const AdminProjects = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  const projects = [
    { id: 'v4-nav', name: "Autonomous Navigation v4", buyer: "Tesla", progress: 78, accuracy: 94.2, nodes: 124, status: "Active" },
    { id: 'mri-seg', name: "Medical MRI Segmentation", buyer: "Mayo Clinic", progress: 32, accuracy: 98.9, nodes: 12, status: "At Risk" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black animate-in fade-in duration-700 border-l border-zinc-900">
      
      {/* SECTION 1: HEADER & STATS (Locked to top) */}
      <div className="p-6 lg:p-10 border-b border-zinc-900">
        <RegistryHeader activeCount={projects.length} />
        <div className="mt-10">
          <GlobalHealth stable={18} atRisk={4} critical={2} />
        </div>
      </div>

      {/* SECTION 2: NAVIGATION TABS (Sticky Anchor) */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <TabButton 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')}
            icon={<LayoutGrid size={14} />}
            label="Project_Inventory"
          />
          <TabButton 
            active={activeTab === 'operations'} 
            onClick={() => setActiveTab('operations')}
            icon={<Activity size={14} />}
            label="Live_Operations_Console"
          />
        </div>
      </div>

      {/* SECTION 3: DYNAMIC CONTENT AREA */}
      <div className="flex-1 bg-black">
        {activeTab === 'inventory' ? (
          <div className="flex flex-col">
            {/* Control Bar as a sub-header */}
            <div className="bg-[#050505] p-4 border-b border-zinc-900">
              <ControlBar />
            </div>
            
            {/* Grid with hairline borders to prevent floating cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-zinc-900 border-b border-zinc-900">
              {projects.map(project => (
                <div key={project.id} className="bg-black">
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-10 animate-in slide-in-from-bottom-2 duration-500">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight italic">// Task_Orchestration_Unit</h2>
                <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Manual override and assignment protocols active.</p>
              </div>
              <div className="px-3 py-1 border border-indigo-500/30 bg-indigo-500/5 rounded-sm flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping" />
                <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest text-nowrap">Live_Sync</span>
              </div>
            </div>
            <TaskConsole />
          </div>
        )}
      </div>

      {/* FOOTER NODE (Grounds the bottom of the page) */}
      <footer className="mt-auto border-t border-zinc-900 p-4 bg-[#020202]">
        <div className="flex items-center gap-2 opacity-20">
          <Terminal size={10} className="text-white" />
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white">VeraLabel_Internal_Systems_Auth_2026</span>
        </div>
      </footer>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 py-5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all relative group ${
      active ? 'text-indigo-500' : 'text-zinc-600 hover:text-zinc-400'
    }`}
  >
    {icon}
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
    )}
  </button>
);

export default AdminProjects;