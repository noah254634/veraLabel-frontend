import { CheckCircle2, DollarSign, Target, Trophy } from "lucide-react";
import { ProgressBar } from "../components/ProgressBar";
import { QualificationCard } from "../components/QualificationCard";
import { StatCard } from "../components/StatCard";
import { useAuthStore } from "../../auth/useAuthstore";

export const LabellerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Welcome back,<span className="text-blue-500">{user?.name}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Earned" value="$1,240.00" icon={<DollarSign size={20} />} trend="+14%" />
        <StatCard label="Avg. Accuracy" value="98.2%" icon={<Target size={20} />} />
        <StatCard label="Tasks Done" value="14,201" icon={<CheckCircle2 size={20} />} />
        <StatCard label="Current Rank" value="Gold" icon={<Trophy size={20} />} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-[#161B22] rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold mb-4">Qualification Progress</h3>
          <QualificationCard
            title="Medical Imaging Expert"
            category="Image"
            potentialReward="$0.85"
            status="in-progress"
            progress={65}
            description="Learn to identify anomalies in X-ray and MRI scans."
          />
        </div>
        <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold mb-4">Daily Goal</h3>
          <ProgressBar progress={80} label="Goal: $20.00 today" />
          <p className="text-xs text-gray-500 mt-4 italic text-center">
            "Almost there! Just 5 more high-pay tasks."
          </p>
        </div>
      </div>
    </div>
  );
};
