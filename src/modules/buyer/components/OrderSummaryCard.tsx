/**
 * 4️⃣ OrderSummaryCard.tsx
 * Checkout summary display with itemized list and total breakdown.
 */

import type { Order } from '../types/order';

import React from 'react';

interface OrderItem {
  datasetId: string;
  title: string;
  price: number;
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  currency,
  subtotal,
  tax,
  total,
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
      </div>

      <div className="p-6">
        {/* Itemized List */}
        <ul className="space-y-3 mb-6">
          {items.map((item) => (
            <li key={item.datasetId} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate max-w-[70%]" title={item.title}>
                {item.title}
              </span>
              <span className="font-medium text-gray-900">{formatter.format(item.price)}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatter.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated Tax</span>
            <span>{formatter.format(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-blue-600">{formatter.format(total)}</span>
          </div>
        </div>

        <button 
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-100 active:scale-[0.98]"
        >
          Complete Purchase
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-4">
          By completing this purchase, you agree to the Dataset License Agreement.
        </p>
      </div>
    </div>
  );
};

export default OrderSummaryCard;