/**
 * 3️⃣ FilterSideBar.tsx
 * Sidebar navigation for filtering datasets by category, price, and rating.
 */

import React, { type ChangeEvent } from 'react';

interface FilterSideBarProps {
  categories: string[];
  selectedCategory: string | null;
  minPrice: number;
  maxPrice: number;
  selectedRating: number | null;
  onCategoryChange: (category: string | null) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number | null) => void;
  onReset: () => void;
}

const FilterSideBar: React.FC<FilterSideBarProps> = ({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  selectedRating,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onReset,
}) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPriceChange(Number(e.target.value), maxPrice);
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPriceChange(minPrice, Number(e.target.value));
  };

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-8 p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={onReset}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Categories
        </h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              checked={selectedCategory === null}
              onChange={() => onCategoryChange(null)}
            />
            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">All Datasets</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                {category}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Price Range
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Min</label>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max</label>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Minimum Rating */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className={`flex items-center w-full text-sm py-1 px-2 rounded-md transition-colors ${
                selectedRating === star ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < star ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              & Up
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default FilterSideBar;