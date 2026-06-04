import React from "react";
import {
  Clock,
  DollarSign,
  Download,
  AlertCircle,
  X,
  Loader2,
  ShieldCheck,
  ChevronRight,
  Database,
  Layers,
  Zap
} from "lucide-react";
import InvoiceBreakdownModal from "./InvoiceBreakdownModal";

interface RequestCardProps {
  order: any; // Ideally this should be a typed Order
  onPay: (orderId: string, budget: string) => void;
  onCancel: (orderId: string) => void;
  onReport: (orderId: string) => void;
  isProcessing: boolean;
  getProgressPercentage: (itemsCompleted: number, volume: string) => number;
  calculateDeliveryDate: (timeline: string, createdAt: string, timelineDays?: number) => string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  order,
  onPay,
  onCancel,
  onReport,
  isProcessing,
  calculateDeliveryDate
}) => {
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);
  const statusColors: Record<string, string> = {
    pending: "border-zinc-500 text-zinc-400 bg-zinc-500/5",
    awaiting_payment: "border-amber-500 text-amber-400 bg-amber-500/5",
    in_progress: "border-indigo-500 text-indigo-400 bg-indigo-500/5",
    completed: "border-emerald-500 text-emerald-400 bg-emerald-500/5",
    registration_failed: "border-red-500 text-red-400 bg-red-500/5",
    cancelled: "border-orange-500 text-orange-400 bg-orange-500/5",
  };

  const statusAccent: Record<string, string> = {
    pending: "bg-zinc-500",
    awaiting_payment: "bg-amber-500",
    in_progress: "bg-indigo-500",
    completed: "bg-emerald-500",
    registration_failed: "bg-red-500",
    cancelled: "bg-orange-500",
  };

  const actualRows = order.actualRows || 0;
  const volume = parseInt(order.volume) || 1;
  const displayTotal = actualRows > 0 ? actualRows : volume;
  
  const isIngesting = order.status === 'pending';
  const isAwaitingPayment = order.status === 'awaiting_payment';
  const isLabeling = order.status === 'in_progress';
  const isComplete = order.status === 'completed';

  return (
    <>
      <div className="bg-[#050505] border-l-2 border-r border-t border-b border-zinc-900 hover:border-zinc-700 transition-all group relative overflow-hidden"
           style={{ borderLeftColor: statusAccent[order.status] || '#27272a' }}>
      {(isIngesting || isLabeling) && (
        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 animate-pulse ${isIngesting ? 'bg-indigo-500/5' : 'bg-emerald-500/5'}`} />
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${(isIngesting || isLabeling) ? 'animate-pulse' : ''} ${statusAccent[order.status] || 'bg-zinc-500'}`} />
              <p className="text-sm font-bold text-white group-hover:text-white transition-colors tracking-tight">
                {order.entryType === 'purchase' ? 'Marketplace Asset' : `${order.domain} Request`}
              </p>
              {order.entryType === 'purchase' && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-[2px] ml-2">
                  <Database size={8} className="text-emerald-400" />
                  <span className="text-[7px] font-mono font-bold text-emerald-400 uppercase tracking-tighter">Owned</span>
                </span>
              )}
              {isIngesting && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-[2px] ml-2">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-ping" />
                  <span className="text-[7px] font-mono font-bold text-indigo-400 uppercase tracking-tighter">Ingesting</span>
                </span>
              )}
              {isLabeling && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-[2px] ml-2">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-[7px] font-mono font-bold text-emerald-400 uppercase tracking-tighter">Labeling</span>
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
              <Database size={10} /> {order.format}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 border rounded-sm tracking-[0.2em] shadow-sm ${statusColors[order.status] || "border-zinc-700 text-zinc-300"}`}>
              {isLabeling ? "ACTIVE" : order.status.toUpperCase()}
            </span>
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
              {order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 font-light leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem]">
          {order.description}
        </p>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatBox label="Target" value={order.volume} icon={<Layers size={10} />} />
          <StatBox label="Detected" value={actualRows > 0 ? `${actualRows} rows` : "---"} icon={<Zap size={10} />} color={actualRows > 0 ? "text-indigo-400" : "text-zinc-600"} />
          <StatBox 
            label="Settlement" 
            value={order.invoice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.invoice.totalCost) : (typeof order.budget === 'number' ? `$${order.budget}` : order.budget)} 
            icon={<DollarSign size={10} />} 
          />
          <StatBox 
            label="Timeline" 
            value={order.timeline ? `${order.timeline} (Est. ${calculateDeliveryDate(order.timeline, order.createdAt, order.timelineDays)})` : "N/A"} 
            icon={<Clock size={10} />} 
          />
        </div>

        {['pending', 'awaiting_payment', 'in_progress', 'completed'].includes(order.status) && (
          <div className="space-y-4 mb-6 bg-zinc-900/20 p-3 border border-zinc-900/50 rounded-sm">
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <p className={`text-[7px] font-mono uppercase tracking-[0.2em] ${isIngesting ? 'text-indigo-400' : 'text-zinc-600'}`}>
                  Phase_01: Infrastructure_Sync
                </p>
                <p className={`text-[8px] font-mono font-bold ${isIngesting ? 'text-white' : 'text-emerald-500/70'}`}>
                  {isIngesting ? `${(order.processingProgress || 0).toFixed(1)}%` : 'COMPLETE'}
                </p>
              </div>
              <div className="relative h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${isIngesting ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-emerald-500/30'}`}
                  style={{ width: `${isIngesting ? (order.processingProgress || 0) : 100}%` }}
                />
                {isIngesting && (
                  <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
                )}
              </div>
            </div>
            <div className={`space-y-1.5 transition-opacity duration-500 ${(isIngesting || isAwaitingPayment) ? 'opacity-20' : 'opacity-100'}`}>
              <div className="flex justify-between items-end">
                <p className={`text-[7px] font-mono uppercase tracking-[0.2em] ${isLabeling ? 'text-emerald-400' : isComplete ? 'text-emerald-500' : 'text-zinc-600'}`}>
                  Phase_02: Human_Labeling_Protocol
                </p>
                <p className={`text-[8px] font-mono font-bold ${isLabeling ? 'text-white' : isComplete ? 'text-emerald-500' : 'text-zinc-700'}`}>
                  {isComplete ? 'FULFILLED' : (isIngesting || isAwaitingPayment) ? 'LOCKED // AWAITING SETTLEMENT' : `${Math.min(((order.itemsCompleted || 0) / displayTotal) * 100, 100).toFixed(1)}%`}
                </p>
              </div>
              <div className="relative h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.2)] ${isComplete ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                  style={{ width: `${(isLabeling || isComplete) ? Math.min(((order.itemsCompleted || 0) / displayTotal) * 100, 100) : 0}%` }}
                />
                {isLabeling && (
                  <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-scan" />
                )}
              </div>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-900/50 mt-2">
              <p className="text-[7px] text-zinc-600 font-mono italic">
                // Log: {isIngesting ? 'Distributing_Shards...' : isAwaitingPayment ? 'Awaiting_Payment_Settlement' : isLabeling ? 'Labeller_Node_Active' : 'Data_Package_Ready'}
              </p>
              <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-tight">
                {order.itemsCompleted || 0} / {displayTotal} UNITS_SYNCHRONIZED
              </p>
            </div>
          </div>
        )}
        {order.qualityMetrics && (
          <div className="bg-zinc-900/30 p-2.5 rounded-sm mb-6 border border-zinc-900/50">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={10} className="text-emerald-500" />
              <p className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest font-bold">Quality_Protocol</p>
            </div>
            <p className="text-[10px] text-zinc-500 italic font-light pl-4 border-l border-zinc-800 ml-1">
              {order.qualityMetrics}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-900/50">
          <div className="flex gap-2">
            {(order.status === "pending" || order.status === "awaiting_payment") && !order.isPaid && (
              <button
                onClick={() => setShowInvoiceModal(true)}
                disabled={isProcessing}
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white font-bold text-[9px] uppercase tracking-widest transition-all inline-flex items-center gap-2 rounded-sm"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={10} /> : <DollarSign size={10} />}
                Pay_Invoice {order.invoice ? `(${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.invoice.totalCost)})` : ''}
              </button>
            )}

            {order.status === "completed" && order.downloadUrl && (
              <a
                href={order.downloadUrl}
                download
                className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-widest transition-all inline-flex items-center gap-2 rounded-sm"
              >
                <Download size={10} />
                Download_Set
              </a>
            )}

            {(order.status === "pending" || order.status === "awaiting_payment") && order.canBeCancelled && (
              <button
                onClick={() => onCancel(order._id)}
                className="h-8 px-4 border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/50 text-zinc-500 hover:text-red-500 font-bold text-[9px] uppercase tracking-widest transition-all inline-flex items-center gap-2 rounded-sm"
              >
                <X size={10} />
                Cancel
              </button>
            )}

            {order.status !== "pending" && !order.reportReason && (
              <button 
                onClick={() => onReport(order._id)}
                className="h-8 px-4 border border-zinc-800 hover:bg-amber-500/10 hover:border-amber-500/50 text-zinc-500 hover:text-amber-500 font-bold text-[9px] uppercase tracking-widest transition-all inline-flex items-center gap-2 rounded-sm"
              >
                <AlertCircle size={10} />
                Report
              </button>
            )}
          </div>
          
          <button className="p-2 text-zinc-600 hover:text-white transition-colors group/more">
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
      <InvoiceBreakdownModal
        isOpen={showInvoiceModal}
        invoice={order.invoice || null}
        onClose={() => setShowInvoiceModal(false)}
        onConfirm={() => {
          setShowInvoiceModal(false);
          const paymentAmount = order.invoice ? order.invoice.totalCost.toString() : order.budget.toString();
          onPay(order._id, paymentAmount);
        }}
        isProcessing={isProcessing}
      />
    </>
  );
};

const StatBox = ({ label, value, icon, color = "text-white" }: any) => (
  <div>
    <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className={`text-[11px] font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

export default RequestCard;
