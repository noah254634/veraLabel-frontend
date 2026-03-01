/**
 * CategoryBar.tsx
 * A scrollable horizontal bar for top-level marketplace categories.
 */

import React from 'react';

interface CategoryBarProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ categories, activeCategory, onSelect }) => {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-4">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${isActive 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
};

export default CategoryBar;