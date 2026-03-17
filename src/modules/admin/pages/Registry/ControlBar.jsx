import React from 'react';
import { Search, Filter, BarChart3 } from 'lucide-react';

const ControlBar = () => (
  <div className="flex items-center justify-between bg-[#050505] p-2 border border-zinc-900 mb-10">
    <div className="flex items-center gap-3 px-3 flex-1">
      <Search size={16} className="text-zinc-700" />
      <input 
        type="text" 
        placeholder="Query projects by buyer, tag, or UUID..." 
        className="bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-800 w-full font-mono focus:ring-0"
      />
    </div>
    <div className="flex gap-px bg-zinc-900 border border-zinc-900">
      <button className="p-3 bg-black hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-white">
        <Filter size={16} />
      </button>
      <button className="p-3 bg-black hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-white">
        <BarChart3 size={16} />
      </button>
    </div>
  </div>
);

export default ControlBar;