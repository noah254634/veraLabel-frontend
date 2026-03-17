import React from 'react';
import { Terminal, Plus } from 'lucide-react';

const RegistryHeader = ({ activeCount }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-indigo-500 mb-4">
        <Terminal size={14} />
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">
          Pipeline_Registry_v.01
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
        Project Registry
      </h1>
      <p className="text-zinc-500 font-light text-sm mt-4">
        Monitoring <span className="text-indigo-400 font-mono font-bold">{activeCount}</span> active production pipelines.
      </p>
    </div>
    <button className="flex items-center gap-2 bg-white text-black px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-2xl shadow-indigo-500/20 active:scale-95">
      <Plus size={16} /> Provision_New_Project
    </button>
  </header>
);

export default RegistryHeader;