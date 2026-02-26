/**
 * 3️⃣ Cart.tsx
 * Management of selected datasets before checkout.
 * Uses CartItemRow and OrderSummaryCard.
 */

import React from 'react';
import CartItemRow from '../components/CartItemRow';
import OrderSummaryCard from '../components/OrderSummaryCard';

const Cart: React.FC = () => {
  const cartItems = [
    { datasetId: 'ds-01', title: 'Autonomous Vehicle LiDAR', price: 1200, sellerName: 'Waymo-Sim', version: '2.0.4' },
    { datasetId: 'ds-03', title: 'Global Retail Trends 2025', price: 450, sellerName: 'RetailData Corp', version: '1.0.0' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
          {cartItems.map((item) => (
            <CartItemRow 
              key={item.datasetId}
              {...item}
              currency="USD"
              onRemove={(id) => console.log('Removing', id)}
            />
          ))}
          {cartItems.length === 0 && (
            <div className="bg-white p-20 text-center">
              <p className="text-gray-500">Your cart is empty.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <OrderSummaryCard 
            items={cartItems}
            currency="USD"
            subtotal={1650}
            tax={132}
            total={1782}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;