import React from 'react';
import { X, Hash, Calendar, DollarSign, Fingerprint, CheckCircle2, Terminal } from 'lucide-react';
import type { OrderType } from '../types/order';

interface OrderDetailProps {
  order:OrderType,
  onClose: () => void;
}

const OrderDetailCard: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-transparent" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-[0.3em] font-bold">Official_Receipt</span>
              <h3 className="text-xl font-bold text-white tracking-tight">Payment Receipt</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-px bg-zinc-900 border border-zinc-900">
            
            <DetailRow 
              icon={<Hash size={14} />} 
              label="Order Number" 
              value={order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`} 
              isMono 
            />
            
            <DetailRow 
              icon={<Fingerprint size={14} />} 
              label="Payment Reference" 
              value={order.reference} 
              isMono 
            />

            <DetailRow 
              icon={<Calendar size={14} />} 
              label="Transaction Date" 
              value={new Date(order.createdAt).toLocaleString()} 
            />

            <DetailRow 
              icon={<Terminal size={14} />} 
              label="Payment Method" 
              value="Paystack (Secured)" 
            />

            <div className="bg-[#050505] p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-zinc-500">
                <div className="p-1.5 bg-zinc-900 rounded-sm"><CheckCircle2 size={14} /></div>
                <span className="text-[10px] uppercase tracking-widest font-mono">Verification_Status</span>
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 border border-emerald-500/20">
                {order.status === 'approved' ? 'Verified' : order.status.toUpperCase()}
              </span>
            </div>

            <div className="bg-[#050505] p-6 flex justify-between items-end border-t border-zinc-800">
              <div className="flex items-center gap-3 text-zinc-500">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-sm"><DollarSign size={14} /></div>
                <span className="text-[10px] uppercase tracking-widest font-mono">Total_Settlement</span>
              </div>
              <span className="text-2xl font-bold text-white tabular-nums tracking-tighter">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalPrice)}
              </span>
            </div>
          </div>
          <div className="mt-8">
            <button className="w-full py-4 bg-zinc-100 hover:bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] transition-all">
              Download PDF Receipt
            </button>
            <p className="text-center mt-4 text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
              Secured & Processed by Paystack Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean rows
const DetailRow = ({ icon, label, value, isMono = false }: any) => (
  <div className="bg-[#050505] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <div className="flex items-center gap-3 text-zinc-500">
      <div className="p-1.5 bg-zinc-900 rounded-sm">{icon}</div>
      <span className="text-[10px] uppercase tracking-widest font-mono">{label}</span>
    </div>
    <span className={`text-xs text-zinc-300 break-all sm:text-right ${isMono ? 'font-mono' : 'font-light'}`}>
      {value}
    </span>
  </div>
);

export default OrderDetailCard;