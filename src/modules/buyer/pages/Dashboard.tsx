import { useAuthStore } from "../../auth/useAuthstore";
import React, { useEffect, useState } from "react";
import DatasetCard from "../components/DatasetCard";
import CustomDataRequestModal from "../components/CustomDataRequestModal";
import useBuyerStore from "../store/buyerStore"
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Terminal,
  LayoutGrid,
  Bell,
  CreditCard,
  ChevronRight,
  Activity
} from "lucide-react";

const StatCard = ({ label, value, trend, icon, color }: any) => {
  const accentColors = {
    blue: "text-blue-500 border-blue-500/20 bg-blue-500/5",
    indigo: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
    emerald: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
  };

  return (
    <div className="bg-[#050505] border border-zinc-900 p-6 rounded-sm group hover:border-zinc-700 transition-all relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2 rounded-sm border ${accentColors[color as keyof typeof accentColors]}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 18 })}
        </div>
        <div className="flex items-center gap-1 text-emerald-500 font-mono text-[10px] font-bold tracking-tighter">
          <TrendingUp size={10} /> {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">
          // {label}
        </p>
        <h3 className="text-3xl font-bold text-white tracking-tighter tabular-nums">
          {value}
        </h3>
      </div>
      {/* Decorative scanline effect on hover */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getDatasets } = useBuyerStore();
  const [customDataRequestModal, setCustomDataRequestModal] = useState(false);

  useEffect(() => {
    getDatasets();
  }, [getDatasets]);

  return (
    <div className="w-full animate-in fade-in duration-700">
      {/* 1. Header: Matches Order and Browse alignment */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">
              Operator_Session_Initialized
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 italic font-light">{user?.name || "Lead_Engineer"}</span>
          </h1>
          <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed">
            Infrastructure overview for continental asset acquisition and real-time telemetry updates.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all rounded-sm">
            <CreditCard size={14} /> Billing
          </button>
          <button className="flex items-center gap-2 bg-white px-6 py-3 text-[10px] font-bold text-black uppercase tracking-widest hover:bg-indigo-50 transition-all rounded-sm">
            <LayoutGrid size={14} /> Market_Registry
          </button>
        </div>
      </header>

      {/* 2. High-Density Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-16 shadow-2xl">
        <StatCard label="Net_Investment" value="$4,250.00" trend="+12.5%" color="indigo" icon={<DollarSign />} />
        <StatCard label="Active_Assets" value="12" trend="+2_NEW" color="blue" icon={<CheckCircle2 />} />
        <StatCard label="Pending_Sync" value="03" trend="PRIORITY" color="emerald" icon={<Clock />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 3. Main Inventory Section */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end border-b border-zinc-900 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight italic">
                Recent Acquisitions
              </h2>
              <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mt-1">
                // Latest_Verified_Decryptions
              </p>
            </div>
            <button className="flex items-center text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all group">
              Full_Inventory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
            {/* These would map from your store; keeping your placeholders for layout */}
            <div className="bg-[#050505] p-2"><DatasetCard id="ds-01" title="Autonomous LiDAR" description="Precision cloud data for urban mapping." price={1200} currency="USD" rating={4.8} totalReviews={124} tags={["Automotive"]} onView={() => {}} /></div>
            <div className="bg-[#050505] p-2"><DatasetCard id="ds-02" title="Medical NLP" description="Anonymized clinical notes for diagnostics." price={850} currency="USD" rating={4.9} totalReviews={56} tags={["Healthcare"]} onView={() => {}} /></div>
          </div>
        </section>

        {/* 4. System Feed Sidebar */}
        <aside className="space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Activity size={16} className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white tracking-tight italic">Feed</h2>
          </div>

          <div className="space-y-px bg-zinc-900 border border-zinc-900">
            {[
              { title: "Dataset_Update", desc: "Medical Imaging v2.1 synchronized.", time: "2H_AGO" },
              { title: "Node_Release", desc: "Satellite (Kenya) now operational.", time: "5H_AGO" },
              { title: "Security_Event", desc: "New API key generated: Project_Alpha", time: "1D_AGO" },
            ].map((item, i) => (
              <div key={i} className="bg-[#050505] p-5 hover:bg-zinc-950 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-indigo-400 tracking-widest uppercase">
                    {item.title}
                  </p>
                  <span className="text-[9px] font-mono text-zinc-700 tracking-tighter">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Custom Request CTA */}
          <div className="p-8 bg-zinc-950 border border-indigo-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest italic">Request Custom Curation</h4>
              <p className="text-[11px] text-zinc-500 mt-4 mb-6 leading-relaxed font-light">
                Our engineering nodes can synthesize specific datasets tailored to your unique AI architectural requirements.
              </p>
              <button
                onClick={() => setCustomDataRequestModal(true)}
                className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all"
              >
                Contact Specialist
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-all" />
          </div>
        </aside>
      </div>

      <CustomDataRequestModal
        isOpen={customDataRequestModal}
        onClose={() => setCustomDataRequestModal(false)}
      />
    </div>
  );
};

export default Dashboard;