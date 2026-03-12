import React from 'react';

interface StatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: "indigo" | "emerald" | "amber" | "rose"; // Added for semantic variety
}

export const StatCard: React.FC<StatProps> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  color = "indigo" 
}) => {
  const accentColors = {
    indigo: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
    emerald: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
    amber: "text-amber-500 border-amber-500/20 bg-amber-500/5",
    rose: "text-rose-500 border-rose-500/20 bg-rose-500/5",
  };

  return (
    <div className="group relative bg-[#050505] border border-zinc-900 p-6 rounded-sm hover:bg-black hover:border-zinc-700 transition-all duration-300 overflow-hidden">
      
      {/* Top Telemetry Header */}
      <div className="flex justify-between items-start mb-8">
        <div className={`p-2 border transition-colors duration-500 ${accentColors[color]}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 2 })}
        </div>
        
        {trend && (
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 tracking-tighter">
              {trend}
            </span>
            <span className="text-[7px] font-mono text-zinc-700 mt-1 uppercase tracking-widest">
              Live_Sync
            </span>
          </div>
        )}
      </div>

      {/* Main Metric Data */}
      <div className="relative z-10">
        <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">
          // {label.replace(" ", "_")}
        </p>
        <h3 className="text-3xl font-bold text-white tracking-tighter tabular-nums">
          {value}
        </h3>
      </div>

      {/* Interactive Bottom Scanline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900 group-hover:bg-indigo-500/50 transition-colors duration-500" />
      
      {/* Subtle corner accent on hover */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};