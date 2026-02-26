/**
 * 2️⃣ DatasetCard.tsx
 * A marketplace listing card for browsing datasets.
 */

import React from 'react';

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
  onAddToCart: (id: string) => void;
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
  onView,
  onAddToCart,
}) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5 flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center mb-4">
          <div className="flex items-center text-yellow-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({totalReviews})</span>
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onView(id)}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(id)}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;