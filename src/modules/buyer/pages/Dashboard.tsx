import { useAuthStore } from "../../auth/useAuthstore";
import React, { useEffect, useState, useMemo } from "react";
import CustomDataRequestModal from "../components/CustomDataRequestModal";
import { useBuyerStore } from "../store/buyerStore";
import { useDashboardStore } from "../store/dashboardStore";
import { toast } from "react-hot-toast";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Terminal,
  LayoutGrid,
  CreditCard,
  ChevronRight,
  Activity,
  Loader2,
  Download,
  AlertCircle,
  X,
  ShieldCheck
} from "lucide-react";
import RequestCard from "../components/RequestCard";
import { OnboardingWizard } from "../components/OnboardingWizard";
import { VerificationOverlay } from "../components/VerificationOverlay";

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
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    getDatasets, 
    getDatasetOrders, 
    buyerDatasetOrders, 
    buyerDatasetStats,
    buyerProfile,
    getBuyerProfile 
  } = useBuyerStore();
  const { loadingOrderIds, initiatePayment, cancelPayment, reportIssue } = useDashboardStore();
  const [customDataRequestModal, setCustomDataRequestModal] = useState(false);
  
  const [profileLoading, setProfileLoading] = useState(true);
  const [overrideShowWizard, setOverrideShowWizard] = useState(false);

  // Use backend stats if available, otherwise calculate from local (which might be limited)
  const stats = useMemo(() => {
    if (buyerDatasetStats) {
      return {
        totalSpent: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(buyerDatasetStats.totalSpent),
        activeAssets: buyerDatasetStats.activeAssets,
        pendingSync: buyerDatasetStats.pendingSync.toString().padStart(2, '0')
      };
    }

    return {
      totalSpent: "$0.00",
      activeAssets: 0,
      pendingSync: "00"
    };
  }, [buyerDatasetStats]);

  const handlePaymentInitiation = async (orderId: string, budget: string) => {
    try {
      const response = await initiatePayment(orderId, budget);
      const paymentUrl = typeof response === "string" ? response : response?.url;
      if (paymentUrl) {
        // Refresh orders before redirecting to payment
        await getDatasetOrders();
        window.location.href = paymentUrl;
      }
    } catch (error) {
      // Error already handled in store
    }
  };

  const calculateDeliveryDate = (timeline: string, createdAt: string, timelineDays?: number): string => {
    const timelineMap: Record<string, number> = {
      "Expedited": 2, "Express": 5, "Premium": 7, "Fast": 10,
      "Standard": 14, "Relaxed": 21, "Budget": 30, "Comprehensive": 45
    };
    const days = timelineDays || timelineMap[timeline] || 14;
    const date = new Date(createdAt);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  };

  const getProgressPercentage = (itemsCompleted: number, volume: string): number => {
    const totalItems = parseInt(volume) || 1;
    return Math.min((itemsCompleted / totalItems) * 100, 100);
  };

  const handleCancelPayment = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelPayment(orderId);
      await getDatasetOrders();
    } catch (error) {
      // Error already handled in store
    }
  };

  const handleReportIssue = async (orderId: string, reason: string) => {
    try {
      await reportIssue(orderId, reason);
      await getDatasetOrders();
    } catch (error) {
      // Error already handled in store
    }
  };

  // 1. Load profile state on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await getBuyerProfile();
      } catch (err) {
        console.error("Failed to load buyer profile", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [getBuyerProfile]);

  // 2. Fetch datasets and orders ONLY when approved
  useEffect(() => {
    const isApproved = buyerProfile?.verificationStatus === "approved" && buyerProfile?.isActive;
    if (isApproved) {
      getDatasets();
      getDatasetOrders();
    }
  }, [buyerProfile, getDatasets, getDatasetOrders]);

  // 3. Poll dataset orders if there are any active pending ingestions
  useEffect(() => {
    const isApproved = buyerProfile?.verificationStatus === "approved" && buyerProfile?.isActive;
    if (!isApproved) return;

    const hasPendingOrders = buyerDatasetOrders?.some(order => order.status === "pending");
    if (!hasPendingOrders) return;

    const pollInterval = setInterval(() => {
      getDatasetOrders();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [buyerProfile, buyerDatasetOrders, getDatasetOrders]);

  if (profileLoading && !buyerProfile) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  const isApproved = buyerProfile?.verificationStatus === "approved" && buyerProfile?.isActive;
  const currentStatus = isApproved 
    ? "approved" 
    : (overrideShowWizard ? "unsubmitted" : (buyerProfile?.verificationStatus || "unsubmitted"));

  if (currentStatus === "unsubmitted") {
    return (
      <OnboardingWizard
        onSuccess={() => {
          setOverrideShowWizard(false);
          getBuyerProfile();
        }}
      />
    );
  }

  if (currentStatus === "pending") {
    return (
      <VerificationOverlay
        status="pending"
        onReset={getBuyerProfile}
      />
    );
  }

  if (currentStatus === "rejected") {
    return (
      <VerificationOverlay
        status="rejected"
        adminNotes={buyerProfile?.adminNotes}
        onReset={() => setOverrideShowWizard(true)}
      />
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">
              Operator_Session_Initialized
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none flex flex-wrap items-center gap-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 italic font-light">{user?.name || "Lead_Engineer"}</span>
            {buyerProfile?.verificationStatus === "approved" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)] rounded-sm uppercase">
                <ShieldCheck size={12} className="text-indigo-400 animate-pulse" />
                Verified_Buyer
              </span>
            )}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-16 shadow-2xl">
        <StatCard label="Net_Investment" value={stats.totalSpent} trend="REALTIME" color="indigo" icon={<DollarSign />} />
        <StatCard label="Active_Assets" value={stats.activeAssets} trend="SYNCED" color="blue" icon={<CheckCircle2 />} />
        <StatCard label="Pending_Sync" value={stats.pendingSync} trend="PRIORITY" color="emerald" icon={<Clock />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end border-b border-zinc-900 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight italic">
                Recent Dataset Requests
              </h2>
              <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mt-1">
                // Latest_Requests
              </p>
            </div>
            <button className="flex items-center text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all group">
              Full_Inventory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-px bg-zinc-900 border border-zinc-900">
            {buyerDatasetOrders && buyerDatasetOrders.length > 0 ? (
              buyerDatasetOrders.map((order) => (
                <RequestCard
                  key={order._id}
                  order={order}
                  onPay={handlePaymentInitiation}
                  onCancel={handleCancelPayment}
                  onReport={(id) => {
                    const reason = prompt("Please describe the issue:");
                    if (reason) handleReportIssue(id, reason);
                  }}
                  isProcessing={!!loadingOrderIds[order._id]}
                  getProgressPercentage={getProgressPercentage}
                  calculateDeliveryDate={calculateDeliveryDate}
                />
              ))
            ) : (
              <div className="bg-[#050505] p-8 text-center">
                <p className="text-zinc-500 text-sm font-light">You haven't ordered anything yet</p>
                <button 
                  onClick={() => setCustomDataRequestModal(true)}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  Create Your First Request
                </button>
              </div>
            )}
          </div>
        </section>

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