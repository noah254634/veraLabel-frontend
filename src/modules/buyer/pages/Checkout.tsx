/**
 * 4️⃣ Checkout.tsx
 * Final step for buyer information and order review.
 */

import React from 'react';
import OrderSummaryCard from '../components/OrderSummaryCard';

const Checkout: React.FC = () => {
  const handlePayment = () => {
    alert('Initializing payment gateway...');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Buyer Info Form */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buyer Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" defaultValue="Jane" className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 border" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 border" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Corporate Email</label>
              <input type="email" defaultValue="jane.doe@tech-ai.com" className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 border" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 border" />
            </div>
          </div>

          <div className="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Datasets will be available for instant download in your dashboard immediately after successful payment.
            </p>
          </div>
        </section>

        {/* Order Review */}
        <aside>
          <OrderSummaryCard 
            items={[
              { datasetId: 'ds-01', title: 'Autonomous Vehicle LiDAR', price: 1200 }
            ]}
            currency="USD"
            subtotal={1200}
            tax={96}
            total={1296}
          />
          <button 
            onClick={handlePayment}
            className="w-full mt-4 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Proceed to Payment
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;