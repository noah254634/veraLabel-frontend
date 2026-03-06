/**
 * 2️⃣ Dashboard.tsx
 * High-end Buyer Overview with vibrant StatCards and refined layouts.
 */

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
  ArrowUpRight,
  LayoutGrid,
  Bell,
  CreditCard,
  ChevronRight,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: "blue" | "indigo" | "emerald";
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon,
  color,
}) => {
  const colors = {
    blue: "from-blue-500 to-blue-600 shadow-blue-100",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-100",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-100",
  };

  return (
    <div className="relative group bg-gray-900 p-6 rounded-3xl border border-gray-500 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Decorative Background Accent */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-[0.03] rounded-full group-hover:scale-110 transition-transform`}
      />

      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
          <TrendingUp size={12} />
          {trend}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <h3 className="text-3xl font-black text-gray-900 mt-1">{value}</h3>
      </div>

      <div className="mt-4 flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors cursor-pointer">
        View Analytics <ArrowUpRight size={14} className="ml-1" />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user} = useAuthStore();
  const { getDatasets } = useBuyerStore();
  const [customDataRequestModal, setCustomDataRequestModal] = useState(false);
  useEffect(() => {
    getDatasets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white-900 tracking-tight">
              Welcome back,{" "}
              <span className="text-indigo-600">
                {user?.name || "Explorer"}
              </span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manage your enterprise data assets and acquisition metrics.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <CreditCard size={18} />
              Billing
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 px-5 py-3 rounded-2xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <LayoutGrid size={18} />
              Browse Market
            </button>
          </div>
        </header>

        {/* High-End StatCards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard
            label="Investment"
            value="$4,250.00"
            trend="+12.5%"
            color="indigo"
            icon={<DollarSign size={20} />}
          />
          <StatCard
            label="Data Assets"
            value="12"
            trend="+2 New"
            color="blue"
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            label="Pending Updates"
            value="03"
            trend="High Priority"
            color="emerald"
            icon={<Clock size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Inventory Section */}
          <section className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Recent Acquisitions
                </h2>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  Your most recently unlocked datasets.
                </p>
              </div>
              <button className="flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group">
                Full Inventory{" "}
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DatasetCard
                id="ds-01"
                title="Autonomous Vehicle LiDAR"
                description="Precision point cloud data for urban environmental mapping and obstacle detection."
                price={1200}
                currency="USD"
                rating={4.8}
                totalReviews={124}
                tags={["Automotive"]}
                onView={() => {}}
              />
              <DatasetCard
                id="ds-02"
                title="Medical NLP: Patient Records"
                description="Anonymized clinical notes for training diagnostic healthcare models."
                price={850}
                currency="USD"
                rating={4.9}
                totalReviews={56}
                tags={["Healthcare"]}
                onView={() => {}}
              />
            </div>
          </section>

          {/* Activity/Notifications Sidebar */}
          <aside>
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <Bell size={18} className="text-slate-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Feed</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Dataset Update",
                  desc: "Medical Imaging v2.1 released.",
                  time: "2h ago",
                },
                {
                  title: "New Release",
                  desc: "Satellite Imagery (Kenya) is now live.",
                  time: "5h ago",
                },
                {
                  title: "Security",
                  desc: "New API key generated for project Alpha.",
                  time: "1d ago",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-black text-slate-900">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold">Need custom data?</h4>
                <p className="text-xs text-slate-400 mt-2 mb-4">
                  Our engineers can curate specific datasets for your unique AI
                  requirements.
                </p>
                <button
                  onClick={() => setCustomDataRequestModal(true)}
                  className="w-full py-3 cursor-pointer bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors"
                >
                  Contact Specialist
                </button>
              </div>

              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
            </div>
          </aside>
        </div>
      </div>
      <CustomDataRequestModal
        isOpen={customDataRequestModal}
        onClose={() => setCustomDataRequestModal(false)}
      />
    </div>
  );
};

export default Dashboard;
