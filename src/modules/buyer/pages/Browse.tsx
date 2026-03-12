import React, { useState } from 'react';
import { Search, Terminal } from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import DatasetCard from '../components/DatasetCard';
import QuickCheckOutModal from '../components/QuickCheckOutModal';
import useBuyerStore from "../store/buyerStore"
import type { Dataset } from "../../../shared/types/dataset";

const CATEGORIES = ['All Assets', 'Computer Vision', 'NLP', 'Healthcare', 'Automotive', 'Satellite'];

const Browse: React.FC = () => {
  const { datasets, getDatasets } = useBuyerStore();
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);

  React.useEffect(() => {
    getDatasets();
  }, [getDatasets]);

  return (
    <div className="w-full">
      {/* 1. REMOVED min-h-screen and bg-[#020203] 
          2. REMOVED duplicate background glow (handled by AppLayout)
      */}

      {/* Market Intelligence Header: Adjusted for Layout Alignment */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 border-l-2 border-indigo-500 pl-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6 text-indigo-500">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Registry_Access_Level_01</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4 leading-tight">
            VeraLabel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-zinc-200 to-indigo-600 italic">
              Asset Registry
            </span>
          </h1>
          
          <p className="text-zinc-500 font-light text-sm md:text-base leading-relaxed max-w-md">
            Querying high-fidelity, precision-vetted datasets across global continental nodes.
          </p>
        </div>

        {/* Search Input: Matches Dashboard Density */}
        <div className="w-full lg:w-80 group">
          <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-600 mb-2 ml-1">
            // Index_Query
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter assets..." 
              className="w-full bg-zinc-950 border border-zinc-900 py-3 pl-11 pr-4 text-xs font-medium text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-800 rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Bar Integration */}
      <div className="mb-10 border-b border-zinc-900/50 pb-4">
        <CategoryBar 
          categories={CATEGORIES}
          activeCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Results Grid: Now perfectly aligned with Layout margins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">
        {datasets.map((dataset) => (
          <div key={dataset._id} className="bg-[#050505] hover:bg-zinc-950 transition-colors duration-300">
            <DatasetCard 
              id={dataset._id}
              title={dataset.name}
              description={dataset.description}
              price={Number(dataset.price) || 0}
              currency="USD"
              rating={3}
              totalReviews={dataset.reviews?.length || 0}
              tags={dataset.category ? [dataset.category] : ["Engineering"]}
              format={dataset.datasetFormat}
              onView={() => setActiveDataset(dataset)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {datasets.length === 0 && (
         <div className="py-24 text-center border border-dashed border-zinc-900">
           <div className="animate-pulse text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">
             System_Scan: Zero_Assets_Found
           </div>
         </div>
      )}

      {/* Secondary Meta Info */}
      <footer className="mt-20 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-30">
        <span className="text-[9px] font-mono uppercase tracking-widest">Protocol: Secure_Market_v1.0</span>
        <div className="h-px flex-1 mx-8 bg-zinc-900" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-500">All Nodes Stable</span>
      </footer>

      {/* Checkout Modal */}
      <QuickCheckOutModal 
        isOpen={!!activeDataset} 
        dataset={activeDataset ? {
          id: activeDataset._id,
          title: activeDataset.name,
          price: Number(activeDataset.price) || 0,
          format: activeDataset.datasetFormat,
          totalReviews: activeDataset.reviews?.length || 7,
          rating: 3
        } : null}
        onClose={() => setActiveDataset(null)}
      />
    </div>
  );
};

export default Browse;