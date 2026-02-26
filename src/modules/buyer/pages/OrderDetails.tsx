/**
 * 6️⃣ OrderDetails.tsx
 * Deep-dive into a specific purchase with download actions.
 */

import React from 'react';
import CartItemRow from '../components/CartItemRow';

const OrderDetails: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #ORD-8821</h1>
          <p className="text-gray-500 mt-1">Placed on February 15, 2026</p>
        </div>
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700 w-fit">
          Payment Successful
        </span>
      </div>

      <div className="space-y-8">
        {/* Products Section */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
            Purchased Assets
          </div>
          <CartItemRow 
            datasetId="ds-01"
            title="Autonomous Vehicle LiDAR"
            sellerName="Waymo-Sim"
            price={1200}
            currency="USD"
            version="2.0.4"
            onRemove={() => {}} // Disabled for order history
          />
          <div className="p-4 bg-blue-50 flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
              Download Full Dataset (.zip, 42GB)
            </button>
          </div>
        </section>

        {/* Payment & Transaction Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <p className="text-sm text-gray-600">Visa ending in •••• 4242</p>
            </div>
            <p className="text-xs text-gray-400 mt-4">Transaction ID: TXN_991028374</p>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Cost Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>$1,200.00</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>$96.00</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-lg">
                <span>Total</span>
                <span>$1,296.00</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;