import { useEffect } from "react";
import { CheckCircle2, DollarSign, Target, Trophy, Terminal, Activity, Zap, ChevronRight } from "lucide-react";
import { ProgressBar } from "../components/ProgressBar";
import { QualificationCard } from "../components/QualificationCard";
import { StatCard } from "../components/StatCard";
import { useAuthStore } from "../../auth/useAuthstore";
import { useLabelerStore } from "../store/labelerStore";
import { useNavigate } from "react-router-dom";

const DAILY_GOAL = 20; // $20 daily earnings goal

export const LabellerDashboard = () => {
  const { user } = useAuthStore();
  const { labeller, getLabeller } = useLabelerStore();
  const navigate = useNavigate();

  useEffect(() => {
    getLabeller();
  }, [getLabeller]);

  const expertise = typeof labeller?.expertise === "object" && labeller.expertise !== null
    ? labeller.expertise
    : undefined;

  const displayName = labeller?.userId && typeof labeller.userId === "object"
    ? (labeller.userId as any).name
    : user?.name || "Operator";

  const displayEmail = labeller?.userId && typeof labeller.userId === "object"
    ? (labeller.userId as any).email
    : user?.email || "n/a";

  const city = labeller?.profile?.location?.city || labeller?.location?.city || "Unknown";
  const country = labeller?.profile?.location?.country || labeller?.location?.country || "Unknown";
  const tier = labeller?.tier || "Trainee";
  const onboarded = labeller?.isOnboarded ? "Active" : "Pending";
  const skills = expertise?.skills?.length ? expertise.skills.join(", ") : "Unspecified";

  return (
    <div className="w-full animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Operator_Session_Initialized</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
            Welcome, Contributor <span className="text-indigo-400 font-light not-italic">{displayName}</span>
          </h1>
          <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed">
            Telemetry synchronized for <span className="text-zinc-300 font-mono">{displayEmail}</span>. Current node is {onboarded} and operating from <span className="text-zinc-300 font-mono">{city}, {country}</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/labeller/wallet')}
            className="bg-zinc-950 border border-zinc-900 px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all rounded-sm"
          >
            Performance_Log
          </button>
          <button
            onClick={() => navigate('/labeller/work')}
            className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-xl shadow-indigo-500/10 active:scale-95"
          >
            Start_Session
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 mb-12 shadow-2xl">
        <StatCard label="Total_Earned" value={`$${Number(labeller?.earnings?.totalEarned || 0).toFixed(2)}`} icon={<DollarSign size={16} />} trend="Live" color="emerald" />
        <StatCard label="Avg_Accuracy" value={`${Number(labeller?.performance?.averageQualityScore || 0).toFixed(1)}%`} icon={<Target size={16} />} color="indigo" />
        <StatCard label="Assets_Verified" value={String(labeller?.performance?.totalTasksCompleted || 0)} icon={<CheckCircle2 size={16} />} color="indigo" />
        <StatCard label="Node_Rank" value={`${tier}_Level`} icon={<Trophy size={16} />} color="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Activity size={16} className="text-indigo-500" />
            <h3 className="text-lg font-bold text-white tracking-tight italic">Qualification Registry</h3>
          </div>
          <div className="bg-[#050505] border border-zinc-900 p-2 group hover:bg-black transition-all">
            <QualificationCard
              title={skills}
              category={expertise?.annotationTypes?.[0]?.toUpperCase() || "GENERAL"}
              potentialReward={`Tier: ${tier}`}
              status={labeller?.isOnboarded ? "passed" : "locked"}
              progress={labeller?.isOnboarded ? 100 : 25}
              description={expertise?.description || "Profile synchronized from backend labeller registry."}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Zap size={16} className="text-amber-500" />
            <h3 className="text-lg font-bold text-white tracking-tight italic">Daily Quota</h3>
          </div>
          <div className="bg-[#050505] border border-zinc-900 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {(() => {
              const todayEarned = Number(labeller?.earnings?.currentBalance ?? 0);
              const progress = Math.min(Math.round((todayEarned / DAILY_GOAL) * 100), 100);
              const remaining = Math.max(0, DAILY_GOAL - todayEarned);
              return (
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                      // Goal: ${DAILY_GOAL.toFixed(2)}
                    </span>
                    <span className={`text-lg font-bold tabular-nums ${
                      progress >= 100 ? 'text-emerald-400' : 'text-white'
                    }`}>{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} className="!h-1 !bg-zinc-900" />
                  <p className="text-[10px] text-zinc-500 mt-6 italic leading-relaxed font-light">
                    {progress >= 100
                      ? '"Daily node target reached. Outstanding calibration performance."'
                      : `"${remaining.toFixed(2)} remaining to reach daily node target."`
                    }
                  </p>
                  <button
                    onClick={() => navigate('/labeller/work')}
                    className="w-full mt-8 py-3 bg-zinc-950 border border-zinc-900 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-zinc-700 transition-all"
                  >
                    Find_Work <ChevronRight size={12} className="inline ml-1" />
                  </button>
                </div>
              );
            })()}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
};