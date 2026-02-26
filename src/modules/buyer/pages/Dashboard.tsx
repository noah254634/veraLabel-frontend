/**
 * 2️⃣ Dashboard.tsx
 * Buyer overview showing spending metrics and recent acquisitions.
 */

import React from 'react';
import DatasetCard from '../components/DatasetCard';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Spent', value: '$4,250.00' },
    { label: 'Datasets Owned', value: '12' },
    { label: 'Pending Updates', value: '3' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is what is happening with your data assets.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Datasets */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recently Purchased</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatasetCard 
              id="ds-01"
              title="Autonomous Vehicle LiDAR"
              description="High-resolution point cloud data..."
              price={1200}
              currency="USD"
              rating={4.8}
              totalReviews={124}
              tags={['Automotive']}
              onView={() => {}}
              onAddToCart={() => {}}
            />
          </div>
        </section>

        {/* Notifications Placeholder */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-sm font-semibold text-gray-900">Dataset Update Available</p>
                <p className="text-xs text-gray-500 mt-1">Medical Imaging v2.1 has been released with 500 new labels.</p>
                <span className="text-[10px] text-blue-500 font-bold mt-2 block">2 hours ago</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;