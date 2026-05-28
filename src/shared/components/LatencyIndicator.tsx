import { Activity, Database, Cpu, Layers } from "lucide-react";
import { useLatency } from "../hooks/useLatency";
import { useState } from "react";

export const LatencyIndicator = () => {
  const { latency, status, health } = useLatency();
  const [showDetails, setShowDetails] = useState(false);
  
  const statusColors = {
    online: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10',
    degraded: 'text-amber-500 bg-amber-500/5 border-amber-500/10',
    offline: 'text-rose-500 bg-rose-500/5 border-rose-500/10'
  };

  const pulseColors = {
    online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    degraded: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    offline: 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className={`flex items-center gap-2 px-3 py-1 bg-black/20 border rounded-sm transition-all duration-500 cursor-help ${statusColors[status]}`}>
        <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${pulseColors[status]}`} />
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
           {status === 'offline' 
             ? 'Node_Offline' 
             : `Node_01_Online // ${latency !== null ? latency : '--'}ms`}
           <Activity size={10} className={status === 'online' ? 'opacity-40' : 'opacity-100'} />
        </span>
      </div>
      {showDetails && health && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-black border border-zinc-800 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-tighter">System_Telemetry</span>
              <span className="text-[8px] font-mono font-bold text-indigo-400">{health.network.environment}</span>
            </div>
            
            <div className="grid gap-2">
              <HealthItem 
                icon={<Database size={10} />} 
                label="DB_Latency" 
                value={health.database.latency} 
                color={health.database.status === 'connected' ? 'text-emerald-500' : 'text-rose-500'} 
              />
              <HealthItem 
                icon={<Cpu size={10} />} 
                label="CPU_Load_1m" 
                value={`${health.system.cpuLoad['1m']}`} 
              />
              <HealthItem 
                icon={<Layers size={10} />} 
                label="RAM_Usage" 
                value={health.system.memory.percentage} 
                warning={parseFloat(health.system.memory.percentage) > 85}
              />
              
              <div className="pt-2 border-t border-zinc-900 mt-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">Node_Uptime</span>
                  <span className="text-[8px] font-mono font-bold text-zinc-300 tabular-nums">{health.uptime.human}</span>
                </div>
                <div className="w-full h-0.5 bg-zinc-900">
                   <div className="h-full bg-indigo-500 opacity-30" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HealthItem = ({ icon, label, value, color = 'text-zinc-400', warning }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1.5">
      <span className="text-zinc-600">{icon}</span>
      <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-tighter">{label}</span>
    </div>
    <span className={`text-[9px] font-mono font-bold tabular-nums ${warning ? 'text-rose-500' : color}`}>{value}</span>
  </div>
);
