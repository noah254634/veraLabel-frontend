import React from "react";
import useBuyerStore from "../store/buyerStore";
import type { OrderType } from "../types/order";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  FileText,
  AlertCircle,
  Terminal,
} from "lucide-react";
import OrderDetailCard from "../components/OrderDetailCar";

const Order: React.FC = () => {
  const { getOrders } = useBuyerStore();
  const [orders, setOrders] = React.useState<OrderType[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderType | null>(null);

  const handleOpenDetails = (order: OrderType) => setSelectedOrder(order);
  const handleCloseDetails = () => setSelectedOrder(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrders();
      if (response) setOrders(response);
    };
    fetchOrders();
  }, [getOrders]);

  return (
    <div className="w-full animate-in fade-in duration-700">
      {/* 1. Aligned Header: Hits the top of the AppLayout p-10 area */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-3">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">
              Secure_Registry_v4.0
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
            Transaction Ledger
          </h1>
          <p className="text-zinc-500 font-light text-sm mt-3 max-w-md">
            Authoritative logs for historical data acquisitions and localized service settlements.
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600 bg-zinc-950 px-4 py-2 border border-zinc-900 rounded-sm">
          Node_Status: <span className="text-emerald-500 ml-2">Operational</span>
        </div>
      </header>

      {/* 2. Desktop Table: Hairline border grid style */}
      <div className="hidden md:block bg-[#050505] border border-zinc-900 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0A0A0A] border-b border-zinc-900">
            <tr>
              <th className="px-6 py-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Reference</th>
              <th className="px-6 py-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Timestamp</th>
              <th className="px-6 py-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Status</th>
              <th className="px-6 py-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic text-right">// Settlement</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-zinc-900/40 transition-all group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-zinc-800 group-hover:text-indigo-500 transition-colors" />
                    <span className="font-mono text-xs text-zinc-300 group-hover:text-white">{order.reference}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[11px] text-zinc-500 font-light tabular-nums">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-5 text-sm font-bold text-white text-right tabular-nums tracking-tighter">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalPrice)}
                </td>
                <td className="px-6 py-5 text-right">
                  <button onClick={() => handleOpenDetails(order)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white flex items-center gap-2 ml-auto group/btn">
                    Details <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Mobile View: High-density cards */}
      <div className="md:hidden space-y-px bg-zinc-900 border border-zinc-900">
        {orders.map((order) => (
          <div key={order._id} className="bg-[#050505] p-6 space-y-4 active:bg-zinc-950 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="block text-[8px] font-mono text-zinc-700 uppercase tracking-[0.2em]">Reference_ID</span>
                <span className="font-mono text-xs text-zinc-200">{order.reference}</span>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-zinc-900/50">
              <div className="space-y-1">
                <span className="block text-[8px] font-mono text-zinc-700 uppercase tracking-[0.2em]">Settlement</span>
                <span className="text-lg font-bold text-white tracking-tighter">${order.totalPrice.toLocaleString()}</span>
              </div>
              <button onClick={() => handleOpenDetails(order)} className="p-3 bg-zinc-900 text-zinc-400 rounded-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Definitive Scroll End */}
      <footer className="mt-20 pb-12 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-20">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">End_Of_Ledger</span>
        <div className="h-px flex-1 mx-8 bg-zinc-900" />
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-indigo-500">Authorized_Access_Only</span>
      </footer>

      {/* Detail Overlay */}
      {selectedOrder && <OrderDetailCard order={selectedOrder} onClose={handleCloseDetails} />}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isApproved = status.toLowerCase() === "approved";
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-sm ${isApproved ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-zinc-500/5 border-zinc-800 text-zinc-500"}`}>
      {isApproved ? <CheckCircle2 size={10} /> : <div className="h-1 w-1 bg-zinc-500 rounded-full" />}
      <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">{status}</span>
    </div>
  );
};

export default Order;