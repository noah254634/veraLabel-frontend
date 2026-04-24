import { useAuthStore } from "../../auth/useAuthstore";
import React, { useEffect, useState, useMemo } from "react";
import CustomDataRequestModal from "../components/CustomDataRequestModal";
import useBuyerStore from "../store/buyerStore";
import { api } from "../../../shared/types/api";
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
  X
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
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getDatasets, getDatasetOrders, buyerDatasetOrders } = useBuyerStore();
  const [customDataRequestModal, setCustomDataRequestModal] = useState(false);
  const [loadingOrderIds, setLoadingOrderIds] = useState<Record<string, boolean>>({});

  // Calculate stats dynamically
  const stats = useMemo(() => {
    const totalSpent = buyerDatasetOrders?.reduce((acc, order) => {
      const budget = parseFloat(order.budget.replace(/[^0-9.-]+/g, ""));
      return acc + (isNaN(budget) ? 0 : budget);
    }, 0) || 0;

    const activeAssets = buyerDatasetOrders?.filter(o => o.status === "done").length || 0;
    const pendingSync = buyerDatasetOrders?.filter(o => o.status === "pending" || o.status === "processing").length || 0;

    return {
      totalSpent: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpent),
      activeAssets,
      pendingSync: pendingSync.toString().padStart(2, '0')
    };
  }, [buyerDatasetOrders]);

  const handlePaymentInitiation = async (orderId: string, budget: string) => {
    setLoadingOrderIds(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await api.post("/payments/create", {
        requestId: orderId,
        amount: budget,
      });
      if (response.data?.url) {
        // Refresh orders before redirecting to payment
        await getDatasetOrders();
        window.location.href = response.data.url;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Payment initialization failed";
      toast.error(msg);
    } finally {
      setLoadingOrderIds(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    }
  };

  const calculateDeliveryDate = (timeline: string, createdAt: string): string => {
    const timelineMap: Record<string, number> = {
      "Expedited": 2, "Express": 5, "Premium": 7, "Fast": 10,
      "Standard": 14, "Relaxed": 21, "Budget": 30, "Comprehensive": 45
    };
    const days = timelineMap[timeline] || 14;
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
      await api.put(`/marketplace/cancelPayment/${orderId}`);
      toast.success("Order cancelled successfully");
      await getDatasetOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel");
    }
  };

  const handleReportIssue = async (orderId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    try {
      await api.post(`/marketplace/reportIssue/${orderId}`, { reason });
      toast.success("Issue reported successfully");
      await getDatasetOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report");
    }
  };

  useEffect(() => {
    getDatasets();
    getDatasetOrders();
  }, [getDatasets, getDatasetOrders]);

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
                <div key={order._id} className="bg-[#050505] p-5 hover:bg-zinc-950 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {order.domain} Request
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">{order.format}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-3 py-1 rounded border ${
                      order.status === "pending" ? "bg-zinc-900 border-zinc-700 text-zinc-300" :
                      order.status === "processing" ? "bg-indigo-950 border-indigo-700 text-indigo-300" :
                      order.status === "done" ? "bg-emerald-950 border-emerald-700 text-emerald-300" :
                      "bg-red-950 border-red-700 text-red-300"
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed mb-3">
                    {order.description}
                  </p>
                  <div className="grid grid-cols-4 gap-4 text-[9px] mb-3">
                    <div>
                      <p className="text-zinc-600 font-mono uppercase tracking-wider">Volume</p>
                      <p className="text-white font-bold">{order.volume}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 font-mono uppercase tracking-wider">Budget</p>
                      <p className="text-white font-bold">{order.budget}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 font-mono uppercase tracking-wider">Timeline</p>
                      <p className="text-white font-bold">{order.timeline || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 font-mono uppercase tracking-wider">Submitted</p>
                      <p className="text-white font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Progress and Delivery Info */}
                  {order.status !== "pending" && (
                    <div className="border-t border-zinc-900 pt-3 mt-3 space-y-2">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-wider">Progress</p>
                          <p className="text-[8px] text-zinc-400">{order.itemsCompleted || 0} / {order.volume}</p>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all"
                            style={{ width: `${getProgressPercentage(order.itemsCompleted || 0, order.volume)}%` }}
                          />
                        </div>
                      </div>
                      {/* Delivery Date */}
                      <p className="text-[8px] text-zinc-500">
                        <span className="text-zinc-600 font-mono">Delivery:</span> {calculateDeliveryDate(order.timeline, order.createdAt)}
                      </p>
                    </div>
                  )}

                  {order.qualityMetrics && (
                    <div className="text-[9px] border-t border-zinc-900 pt-2 mt-2">
                      <p className="text-zinc-600 font-mono uppercase tracking-wider mb-1">Quality Criteria</p>
                      <p className="text-zinc-400 italic text-[8px]">{order.qualityMetrics}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-900">
                    {/* Pay Escrow Button */}
                    {order.status === "pending" && !order.isPaid && (
                      <button 
                        onClick={() => handlePaymentInitiation(order._id, order.budget)}
                        disabled={loadingOrderIds[order._id]}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-emerald-700 disabled:to-emerald-600 text-white font-bold text-[7px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-1 border border-emerald-400/20 shadow-lg hover:shadow-emerald-500/20 disabled:opacity-75 rounded-sm"
                      >
                        {loadingOrderIds[order._id] ? (
                          <Loader2 className="animate-spin" size={9} />
                        ) : (
                          <CreditCard size={9} />
                        )}
                        {loadingOrderIds[order._id] ? "Processing" : "Pay"}
                      </button>
                    )}

                    {/* Download Button */}
                    {order.status === "done" && order.downloadUrl && (
                      <a 
                        href={order.downloadUrl}
                        download
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-[7px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-1 border border-blue-400/20 shadow-lg hover:shadow-blue-500/20 rounded-sm"
                      >
                        <Download size={9} />
                        Download
                      </a>
                    )}

                    {/* Cancel Payment Button */}
                    {order.status === "pending" && order.canBeCancelled && (
                      <button 
                        onClick={() => handleCancelPayment(order._id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-600/70 to-red-500/70 hover:from-red-500/70 hover:to-red-400/70 text-white font-bold text-[7px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-1 border border-red-400/20 shadow-lg hover:shadow-red-500/20 rounded-sm"
                      >
                        <X size={9} />
                        Cancel
                      </button>
                    )}

                    {/* Report Issue Button */}
                    {order.status !== "pending" && !order.reportReason && (
                      <button 
                        onClick={() => {
                          const reason = prompt("Please describe the issue:");
                          if (reason) handleReportIssue(order._id, reason);
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-600/70 to-amber-500/70 hover:from-amber-500/70 hover:to-amber-400/70 text-white font-bold text-[7px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-1 border border-amber-400/20 shadow-lg hover:shadow-amber-500/20 rounded-sm"
                      >
                        <AlertCircle size={9} />
                        Report
                      </button>
                    )}
                  </div>
                </div>
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