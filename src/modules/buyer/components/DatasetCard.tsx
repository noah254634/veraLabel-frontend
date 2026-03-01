/**
 * 2️⃣ DatasetCard.tsx
 * High-end Dark Theme Card with Portal-fixed Modal.
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Star, ArrowRight, BarChart3, FileJson } from 'lucide-react';
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
  onView: (id: string) => void;
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
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <>
      <div className="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:-translate-y-1">
        
        {/* Top Gloss Accent Line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />

        <div className="p-7 flex-1">
          {/* Header Metadata */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2">
              {tags.slice(0, 1).map((tag) => (
                <span key={tag} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
              <ShieldCheck size={12} />
              Verified
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight">
            {title}
          </h3>

          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase">
              <BarChart3 size={14} className="text-indigo-500" />
              <span>1.2M Rows</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase">
              <FileJson size={14} className="text-indigo-500" />
              <span>JSON/CSV</span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-4 border-t border-slate-800/50">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                  className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-700"}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 tracking-tighter">
              {rating} <span className="text-slate-700 mx-1">/</span> {totalReviews} Reviews
            </span>
          </div>
        </div>

        <div className="p-7 pt-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Investment</span>
              <span className="text-3xl font-black text-white tracking-tighter">{formattedPrice}</span>
            </div>
            
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="relative flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:bg-indigo-600 hover:text-white group/btn overflow-hidden active:scale-95"
            >
              Buy Access
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 THE FIX: Render the modal into a Portal so it isn't clipped by the card */}
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