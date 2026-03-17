import React from 'react';

const HealthMetric = ({ label, count, color }) => (
  <div className="bg-[#050505] p-6 flex items-center gap-6 group hover:bg-[#080808] transition-colors">
    <div className={`h-8 w-1 ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
    <div>
      <p className="text-3xl font-bold text-white leading-none tracking-tighter tabular-nums">{count}</p>
      <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em] mt-2">{label}</p>
    </div>
  </div>
);

const GlobalHealth = ({ stable, atRisk, critical }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-12 shadow-2xl">
    <HealthMetric label="Sync_Stable" count={stable} color="bg-emerald-500" />
    <HealthMetric label="Node_At_Risk" count={atRisk} color="bg-amber-500" />
    <HealthMetric label="System_Critical" count={critical} color="bg-rose-500" />
  </div>
);

export default GlobalHealth;