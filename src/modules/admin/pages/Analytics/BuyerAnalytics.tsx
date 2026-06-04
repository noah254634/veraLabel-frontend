import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useAnalyticsStore } from '../../store/analyticsStore';

const BuyerAnalytics = () => {
  const { buyerData, loading, fetchBuyerAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchBuyerAnalytics();
  }, [fetchBuyerAnalytics]);

  if (loading && !buyerData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading_Buyer_Analytics...</p>
        </div>
      </div>
    );
  }

  const buyerStats = buyerData?.buyerStats || {
    totalBuyers: 0,
    activeBuyers: 0,
    newThisMonth: 0
  };

  const buyerSpending = buyerData?.buyerSpending || [
    { range: '$0-100', count: 0 },
    { range: '$100-500', count: 0 },
    { range: '$500-1000', count: 0 },
    { range: '$1000+', count: 0 },
  ];

  const topCategories = buyerData?.topCategories || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Buyers</p>
          <p className="text-3xl font-bold text-white">{buyerStats.totalBuyers}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Active_Buyers</p>
          <p className="text-3xl font-bold text-emerald-500">{buyerStats.activeBuyers}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">New_This_Month</p>
          <p className="text-3xl font-bold text-indigo-500">{buyerStats.newThisMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Spending_Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buyerSpending}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Top_Dataset_Categories</h3>
          {topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <YAxis dataKey="category" type="category" width={120} axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="purchases" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-zinc-500 font-mono text-xs">
              No categories data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-8 text-center">
        <TrendingUp className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2 italic">More_Buyer_Insights_Coming</h3>
        <p className="text-zinc-500 font-mono text-sm">Retention analysis, subscription details, and purchase patterns will be available soon.</p>
      </div>
    </div>
  );
};

export default BuyerAnalytics;
