import { CheckCircle2, DollarSign, Target, Trophy, Terminal, Activity, Zap, ChevronRight } from "lucide-react";
import { ProgressBar } from "../components/ProgressBar";
import { QualificationCard } from "../components/QualificationCard";
import { StatCard } from "../components/StatCard";
import { useAuthStore } from "../../auth/useAuthstore";

export const LabellerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* 1. Header: Operator Session Initialized */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Operator_Session_v.04</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
            Welcome back, <span className="text-indigo-400 font-light not-italic">{user?.name || "Operator"}</span>
          </h1>
          <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed italic">
            Telemetry synchronized. Your node is currently ranked in the <span className="text-zinc-300 font-mono">98th_Percentile</span> for accuracy.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-xl shadow-indigo-500/10 active:scale-95">
             Start_Work_Session
          </button>
        </div>
      </header>

      {/* 2. Primary KPI Grid: Hairline-Px Separation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 mb-12 shadow-2xl">
        <StatCard label="Total_Earned" value="$1,240.00" icon={<DollarSign size={16} />} trend="+14%" color="emerald" />
        <StatCard label="Avg_Accuracy" value="98.2%" icon={<Target size={16} />} color="indigo" />
        <StatCard label="Assets_Verified" value="14,201" icon={<CheckCircle2 size={16} />} color="indigo" />
        <StatCard label="Node_Rank" value="Gold_Level" icon={<Trophy size={16} />} color="amber" />
      </div>

      {/* 3. Operational Focus Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Qualification: Asset Specialization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Activity size={16} className="text-indigo-500" />
            <h3 className="text-lg font-bold text-white tracking-tight italic">Qualification Registry</h3>
          </div>
          <div className="bg-[#050505] border border-zinc-900 p-2 group hover:bg-black transition-all">
            <QualificationCard
              title="Medical Imaging Expert"
              category="IMAGE_SCAN"
              potentialReward="$0.85 / asset"
              status="in-progress"
              progress={65}
              description="Learn to identify neural anomalies in X-ray and MRI scans with 99.9% precision."
            />
          </div>
        </div>

        {/* Daily Telemetry Goal */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Zap size={16} className="text-amber-500" />
            <h3 className="text-lg font-bold text-white tracking-tight italic">Daily Quota</h3>
          </div>
          <div className="bg-[#050505] border border-zinc-900 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">// Goal: $20.00</span>
                <span className="text-lg font-bold text-white tabular-nums">80%</span>
              </div>
              <ProgressBar progress={80} className="!h-1 !bg-zinc-900" />
              <p className="text-[10px] text-zinc-500 mt-6 italic leading-relaxed font-light">
                "Calibration nearly complete. 5 additional high-precision tasks required to reach node target."
              </p>
              <button className="w-full mt-8 py-3 bg-zinc-950 border border-zinc-900 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">
                View_Schedule <ChevronRight size={12} className="inline ml-1" />
              </button>
            </div>
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
};