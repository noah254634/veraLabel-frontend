import React from 'react';
import { X, DollarSign, Check } from 'lucide-react';

interface Invoice {
  taskType: string;
  rowsCount: number;
  currency: string;
  tier: string;
  unitRate: number;
  baseRate: number;
  tierMultiplier: number;
  breakdown: {
    items: number;
    unitRate: number;
    basePrice: number;
    discount: number;
    discountPercent: number;
    engineering: number;
    platform: number;
    maintenance: number;
  };
  price: number;
  basePrice: number;
  engineeringCost: number;
  platformFee: number;
  maintenanceCost: number;
  totalCost: number;
  calculatedAt: string;
}

interface InvoiceBreakdownModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

const InvoiceBreakdownModal: React.FC<InvoiceBreakdownModalProps> = ({
  isOpen,
  invoice,
  onClose,
  onConfirm,
  isProcessing = false
}) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-transparent sticky top-0 z-10" />

        <div className="p-4 sm:p-6 md:p-8">
          {/* Top Actions */}
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div className="space-y-1 flex-1 pr-4">
              <span className="text-[9px] sm:text-[10px] font-mono text-indigo-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold block">
                INVOICE_BREAKDOWN
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                Payment Overview
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Metadata Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-zinc-900/30 border border-zinc-900/50 rounded-sm">
            <div>
              <p className="text-[8px] sm:text-[9px] text-zinc-500 font-mono uppercase mb-1">Task Type</p>
              <p className="text-xs sm:text-sm font-bold text-white capitalize truncate">{invoice.taskType}</p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[9px] text-zinc-500 font-mono uppercase mb-1">Volume</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{invoice.rowsCount.toLocaleString()}</p>
            </div>
            <div className="sm:col-span-1 col-span-2 sm:col-span-auto">
              <p className="text-[8px] sm:text-[9px] text-zinc-500 font-mono uppercase mb-1">Tier</p>
              <p className="text-xs sm:text-sm font-bold text-indigo-400 uppercase truncate">{invoice.tier}</p>
            </div>
            <div className="sm:col-span-1 col-span-2 sm:col-span-auto">
              <p className="text-[8px] sm:text-[9px] text-zinc-500 font-mono uppercase mb-1">Unit Rate</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{formatCurrency(invoice.unitRate)}</p>
            </div>
          </div>

          {/* Cost Breakdown - Scrollable on mobile */}
          <div className="space-y-px bg-zinc-900 border border-zinc-900 mb-4 sm:mb-6 overflow-hidden">
            <CostRow
              label="Base Price"
              value={invoice.basePrice}
              description={`${invoice.breakdown.items} items × ${formatCurrency(invoice.unitRate)}`}
            />
            {invoice.breakdown.discountPercent > 0 && (
              <CostRow
                label="Volume Discount"
                value={-invoice.breakdown.discount}
                description={`-${invoice.breakdown.discountPercent.toFixed(1)}% (tier: ${(invoice.tierMultiplier * 100).toFixed(0)}%)`}
                isDiscount
              />
            )}
            <CostRow
              label="Engineering Cost"
              value={invoice.engineeringCost}
              description="20% overhead"
            />
            <CostRow
              label="Platform Fee"
              value={invoice.platformFee}
              description="15% platform charge"
            />
            <CostRow
              label="Subtotal"
              value={invoice.basePrice + invoice.engineeringCost + invoice.platformFee}
              isBold
            />
            <CostRow
              label="Maintenance Cost"
              value={invoice.maintenanceCost}
              description="25% maintenance"
            />
            <CostRow
              label="Total Due"
              value={invoice.totalCost}
              isTotal
            />
          </div>

          {/* Terms - Responsive */}
          <div className="bg-blue-500/5 border border-blue-500/20 p-3 sm:p-4 rounded-sm mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-3">
              <Check size={14} className="text-blue-400 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div className="text-[9px] sm:text-[10px] text-blue-300 space-y-0.5 sm:space-y-1">
                <p>✓ Invoice is binding once payment is initiated</p>
                <p>✓ Payment processing typically takes 2-5 minutes</p>
                <p>✓ You'll receive a confirmation email upon completion</p>
              </div>
            </div>
          </div>

          {/* Actions - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="order-2 sm:order-1 flex-1 py-2.5 sm:py-3 border border-zinc-700 hover:bg-zinc-900 text-white font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="order-1 sm:order-2 flex-1 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CostRow = ({
  label,
  value,
  description,
  isBold = false,
  isDiscount = false,
  isTotal = false,
}: {
  label: string;
  value: number;
  description?: string;
  isBold?: boolean;
  isDiscount?: boolean;
  isTotal?: boolean;
}) => (
  <div className={`p-2.5 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 ${isTotal ? 'bg-emerald-950/40 border-t-2 border-emerald-500/30' : 'bg-[#050505]'}`}>
    <div className="flex-1 min-w-0">
      <p className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider ${isBold ? 'font-bold text-white' : isTotal ? 'font-bold text-emerald-400' : 'text-zinc-500'}`}>
        {label}
      </p>
      {description && (
        <p className="text-[7px] sm:text-[8px] text-zinc-600 mt-0.5 sm:mt-1 break-words">{description}</p>
      )}
    </div>
    <span className={`text-sm sm:text-base font-bold flex-shrink-0 ${isDiscount ? 'text-red-400' : isTotal ? 'text-emerald-400 sm:text-lg' : 'text-white'}`}>
      {isDiscount ? '-' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(value))}
    </span>
  </div>
);

export default InvoiceBreakdownModal;
