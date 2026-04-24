import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const RevenueAnalytics = () => {
  const revenueStats = {
    thisMonth: 125450,
    lastMonth: 98300,
    growth: 27.6,
    totalRevenue: 1240500
  };

  const dailyRevenue = [
    { date: 'Apr 1', revenue: 4200, platformFee: 420 },
    { date: 'Apr 2', revenue: 5100, platformFee: 510 },
    { date: 'Apr 3', revenue: 4800, platformFee: 480 },
    { date: 'Apr 4', revenue: 6300, platformFee: 630 },
    { date: 'Apr 5', revenue: 5900, platformFee: 590 },
    { date: 'Apr 6', revenue: 7100, platformFee: 710 },
    { date: 'Apr 7', revenue: 8050, platformFee: 805 },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 65000 },
    { month: 'Feb', revenue: 72500 },
    { month: 'Mar', revenue: 98300 },
    { month: 'Apr', revenue: 125450 },
  ];

  const byProduct = [
    { product: 'Dataset Sales', revenue: 82500 },
    { product: 'Labelling Services', revenue: 31200 },
    { product: 'Subscription Fees', revenue: 11750 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">This_Month</p>
          <p className="text-3xl font-bold text-white">KES {(revenueStats.thisMonth / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Last_Month</p>
          <p className="text-3xl font-bold text-zinc-400">KES {(revenueStats.lastMonth / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Growth</p>
          <p className="text-3xl font-bold text-emerald-500">+{revenueStats.growth}%</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Revenue</p>
          <p className="text-3xl font-bold text-indigo-500">KES {(revenueStats.totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Daily_Revenue_This_Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRevenue}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} formatter={(value) => `KES ${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Monthly_Revenue_Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} formatter={(value) => `KES ${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
        <h3 className="text-white font-bold mb-4 italic tracking-tight">Revenue_By_Product_This_Month</h3>
        <div className="space-y-4">
          {byProduct.map((item) => {
            const percentage = (item.revenue / revenueStats.thisMonth) * 100;
            return (
              <div key={item.product}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-white">{item.product}</p>
                  <p className="font-bold text-emerald-400">$ {item.revenue.toLocaleString()}</p>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{percentage.toFixed(1)}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-8 text-center">
        <TrendingUp className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2 italic">More_Revenue_Insights_Coming</h3>
        <p className="text-zinc-500 font-mono text-sm">Payment method analysis, regional breakdown, and profitability metrics will be available soon.</p>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
