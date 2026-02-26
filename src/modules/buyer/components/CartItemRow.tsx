/**
 * 1️⃣ CartItemRow.tsx
 * A single dataset row for the shopping cart view.
 */

import React from 'react';

interface CartItemRowProps {
  datasetId: string;
  title: string;
  sellerName: string;
  price: number;
  currency: string;
  version: string;
  onRemove: (datasetId: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  datasetId,
  title,
  sellerName,
  price,
  currency,
  version,
  onRemove,
}) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
          <span className="flex items-center">
            <span className="font-medium mr-1">Seller:</span> {sellerName}
          </span>
          <span className="flex items-center">
            <span className="font-medium mr-1">v:</span> {version}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
        <span className="text-lg font-semibold text-gray-900">
          {formattedPrice}
        </span>
        <button
          onClick={() => onRemove(datasetId)}
          className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded px-2 py-1"
          aria-label={`Remove ${title} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;