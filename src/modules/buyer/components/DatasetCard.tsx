import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Star, ArrowRight, BarChart3, FileJson, Terminal } from 'lucide-react';
import QuickCheckoutModal from './QuickCheckOutModal';

interface DatasetCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  totalReviews: number;
  tags: string[];
  format?: string;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
  id,
  title,
  description,
  price,
  currency,
  rating,
  totalReviews,
  tags,
  format,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <>
      <div className="group relative flex flex-col h-full bg-[#050505] border border-zinc-900 transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#080808] overflow-hidden">
        
        {/* Progress Bar Header (Decorative) */}
        <div className="h-[2px] w-full bg-zinc-900">
           <div className="h-full w-0 group-hover:w-full bg-indigo-500 transition-all duration-700 ease-out" />
        </div>

        <div className="p-6 flex-1">
          {/* Metadata Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {tags.slice(0, 1).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-indigo-500/5 text-indigo-500 border border-indigo-500/20">
                  // {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-tighter">
              <ShieldCheck size={10} strokeWidth={3} />
              Verified_Node
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>

          <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed mb-6 font-light">
            {description}
          </p>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 mb-6">
            <div className="bg-[#050505] p-2 flex items-center gap-2">
              <BarChart3 size={12} className="text-zinc-700" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">1.2M_ROWS</span>
            </div>
            <div className="bg-[#050505] p-2 flex items-center gap-2">
              <FileJson size={12} className="text-zinc-700" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">{format || 'JSON_v4'}</span>
            </div>
          </div>

          {/* Rating Block */}
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-900/50">
            <div className="flex items-center text-amber-500/50 group-hover:text-amber-500 transition-colors">
              <Star size={10} fill="currentColor" />
              <span className="ml-1 text-[10px] font-mono font-bold text-zinc-400">{rating}</span>
            </div>
            <div className="h-3 w-px bg-zinc-800" />
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              {totalReviews} Logs
            </span>
          </div>
        </div>

        {/* Footer Settlement Action */}
        <div className="p-6 pt-0 mt-auto">
          <div className="flex items-center justify-between gap-4 border-t border-zinc-900 pt-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Settlement</span>
              <span className="text-xl font-bold text-white tabular-nums tracking-tighter">{formattedPrice}</span>
            </div>
            
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="group/btn relative flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white active:scale-95"
            >
              Get_Access
              <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Portal Portal-fixed Modal */}
      {isCheckoutOpen && createPortal(
        <QuickCheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          dataset={{ id, title, price }} 
        />,
        document.body
      )}
    </>
  );
};

export default DatasetCard;