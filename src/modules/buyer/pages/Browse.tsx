/**
 * Browse.tsx
 * High-end Dark Marketplace with realistic AI Dataset content.
 */

import React, { useState } from 'react';
import { Search, Sparkles, Zap } from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import DatasetCard from '../components/DatasetCard';
import QuickCheckOutModal from '../components/QuickCheckOutModal';
import useBuyerStore from "../store/buyerStore"
import { data } from 'react-router-dom';
import type { Dataset } from "../../../shared/types/dataset";


const CATEGORIES = ['All Assets', 'Computer Vision', 'NLP', 'Healthcare', 'Automotive', 'Satellite'];
const Browse: React.FC = () => {
  const {datasets,getDatasets}=useBuyerStore()
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  React.useEffect(()=>{
    getDatasets()
  },[])
  console.log(datasets)

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Background Decorative Element */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/5 blur-[120px] pointer-events-none" />

      {/* Glass Navigation */}
      <div className="sticky top-0 z-50 bg-[#020617]/70 backdrop-blur-2xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryBar 
            categories={CATEGORIES}
            activeCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
              <Zap size={12} fill="currentColor" />
              Direct Asset Acquisition
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
              VeraLabel <span className="text-indigo-500">Market</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Acquire high-fidelity, verified datasets for mission-critical AI training.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search premium data..." 
                className="bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none w-full md:w-80 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {datasets.map((dataset) => (
            <DatasetCard 
              key={dataset._id}
              id={dataset._id}
              title={dataset.name}
              description={dataset.description}
              price={Number(dataset.price) || 0}
              currency="USD"
              rating={3}
              totalReviews={dataset.reviews?.length || 0}
              tags={dataset.category ? [dataset.category] : ["Automotive"]}
              format={dataset.datasetFormat}
              onView={() => setActiveDataset(dataset)}
            />
          ))}
        </div>

        {/* Footer Accent */}
        <div className="mt-24 text-center border-t border-slate-900 pt-12">
          <div className="flex justify-center items-center gap-2 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Sparkles size={14} />
            Enterprise Data Standard
          </div>
        </div>
      </main>

      {/* Checkout Transition Modal */}
      <QuickCheckOutModal 
        isOpen={!!activeDataset} 
        dataset={activeDataset ? {
          id: activeDataset._id,
          title: activeDataset.name,
          price: Number(activeDataset.price) || 0,
          format:activeDataset.datasetFormat,
          totalReviews:activeDataset.reviews?.length || 7,
          rating: 3
        } : null}
        onClose={() => setActiveDataset(null)}
      />
    </div>
  );
};

export default Browse;