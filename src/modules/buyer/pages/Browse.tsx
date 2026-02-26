/**
 * 1️⃣ Browse.tsx
 * The main marketplace exploration page.
 * Wires FilterSideBar and DatasetCard into a responsive layout.
 */

import React, { useState } from 'react';
import FilterSideBar from '../components/FilterSideBar';
import DatasetCard from '../components/DatasetCard';

// Realistic Dataset Interface
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

const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-01',
    title: 'Autonomous Vehicle LiDAR - Urban Night',
    description: 'High-resolution point cloud data from 500+ hours of urban night driving. Includes semantic segmentation for pedestrians and cyclists.',
    price: 1200,
    currency: 'USD',
    rating: 4.8,
    totalReviews: 124,
    tags: ['Computer Vision', 'LiDAR', 'Automotive'],
  },
  {
    id: 'ds-02',
    title: 'Medical Imaging: Chest X-Ray 10k',
    description: 'De-identified chest X-rays labeled for pneumonia, pneumothorax, and cardiomegaly by certified radiologists.',
    price: 850,
    currency: 'USD',
    rating: 4.9,
    totalReviews: 89,
    tags: ['Healthcare', 'X-Ray', 'Classification'],
  },
  {
    id: 'ds-03',
    title: 'Global Retail Transaction Trends 2025',
    description: 'Anonymized transaction data across 12 countries, highlighting consumer behavior shifts in the post-AI retail era.',
    price: 450,
    currency: 'USD',
    rating: 4.5,
    totalReviews: 210,
    tags: ['Tabular', 'Finance', 'Market Analysis'],
  }
];

const Browse: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-full bg-white border border-gray-200 py-2 rounded-lg font-medium"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <FilterSideBar 
            categories={['Computer Vision', 'NLP', 'Tabular', 'Audio']}
            selectedCategory={null}
            minPrice={0}
            maxPrice={5000}
            selectedRating={null}
            onCategoryChange={() => {}}
            onPriceChange={() => {}}
            onRatingChange={() => {}}
            onReset={() => {}}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Explore Datasets</h1>
            <p className="text-sm text-gray-500">{MOCK_DATASETS.length} Results Found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_DATASETS.map((dataset) => (
              <DatasetCard 
                key={dataset.id}
                {...dataset}
                onView={(id) => console.log('View', id)}
                onAddToCart={(id) => console.log('Add', id)}
              />
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-12 flex justify-center">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Load More Datasets
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Browse;