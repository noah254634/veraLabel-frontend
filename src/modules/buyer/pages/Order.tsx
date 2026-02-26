/**
 * 5️⃣ Order.tsx
 * List of historical transactions for the buyer.
 */

import React from 'react';

const MOCK_ORDERS = [
  { id: 'ORD-8821', date: '2026-02-15', status: 'Completed', amount: 1782.00 },
  { id: 'ORD-7710', date: '2025-12-01', status: 'Completed', amount: 850.00 },
  { id: 'ORD-6542', date: '2025-10-20', status: 'Refunded', amount: 45.00 },
];

const Order: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order Reference</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-blue-600 font-medium">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-medium text-gray-400 hover:text-gray-900">Details →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;