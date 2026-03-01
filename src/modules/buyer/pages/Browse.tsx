/**
 * Browse.tsx
 * High-end Dark Marketplace with realistic AI Dataset content.
 */

import React, { useState } from 'react';
import { Search, Sparkles, Zap } from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import DatasetCard from '../components/DatasetCard';
import QuickCheckOutModal from '../components/QuickCheckOutModal';

interface Dataset {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  totalReviews: number;
  tags: string[];
}

const CATEGORIES = ['All Assets', 'Computer Vision', 'NLP', 'Healthcare', 'Automotive', 'Satellite'];

// High-End Realistic Mock Data
const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-01',
    title: 'Nairobi Urban Flow v4',
    description: 'Ultra-high resolution drone-captured traffic flow datasets from Nairobi CBD. 4K Video + JSON Metadata.',
    price: 2400,
    currency: 'USD',
    rating: 4.9,
    totalReviews: 82,
    tags: ['Automotive', 'Video'],
  },
  {
    id: 'ds-02',
    title: 'Medical Imaging: Lung CT',
    description: 'Curated 50k CT scan slices for early-stage tumor detection, labeled by top-tier radiologists.',
    price: 3200,
    currency: 'USD',
    rating: 5.0,
    totalReviews: 45,
    tags: ['Healthcare', 'Imaging'],
  },
  {
    id: 'ds-03',
    title: 'Swahili Voice Synthesis HQ',
    description: '1000+ hours of high-fidelity Swahili dialect recordings for natural speech synthesis and STT training.',
    price: 1800,
    currency: 'USD',
    rating: 4.7,
    totalReviews: 120,
    tags: ['NLP', 'Audio'],
  },
  {
    id: 'ds-04',
    title: 'Sub-Saharan Retail Trends',
    description: 'Processed transaction data across 12 African markets highlighting shifting consumer behaviors in 2026.',
    price: 950,
    currency: 'USD',
    rating: 4.6,
    totalReviews: 210,
    tags: ['Tabular', 'Finance'],
  },
  {
    id: 'ds-05',
    title: 'Precision Agriculture Satellite',
    description: 'Multi-spectral satellite imagery of Rift Valley farm clusters for crop yield predictive modeling.',
    price: 5000,
    currency: 'USD',
    rating: 4.8,
    totalReviews: 34,
    tags: ['Satellite', 'AgriTech'],
  }
];

const Browse: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);

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
          {MOCK_DATASETS.map((dataset) => (
            <DatasetCard 
              key={dataset.id}
              {...dataset}
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
        dataset={activeDataset}
        onClose={() => setActiveDataset(null)} 
      />
    </div>
  );
};

export default Browse;