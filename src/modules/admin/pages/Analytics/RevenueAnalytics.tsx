import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, RefreshCcw, DollarSign, Zap, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';

const RevenueAnalytics = () => {
  const { revenueData, loading, fetchRevenueAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchRevenueAnalytics();
  }, [fetchRevenueAnalytics]);

  if (loading || !revenueData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-zinc-700 animate-pulse bg-black/20 rounded-sm border border-zinc-900/50">
        <RefreshCcw className="animate-spin" size={24} />
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Synchronizing_Market_Revenue...</p>
      </div>
    );
  }

  const { stats, dailyRevenue, monthlyTrend, categoricalRevenue } = revenueData;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard label="This_Month" value={`$ ${(stats.thisMonth || 0).toLocaleString()}`} icon={<DollarSign size={14} />} />
        <StatCard label="Last_Month" value={`$ ${(stats.lastMonth || 0).toLocaleString()}`} color="text-zinc-400" />
        <StatCard 
          label="Growth" 
          value={`${(stats.growth || 0) >= 0 ? "+" : ""}${stats.growth || 0}%`} 
          color={(stats.growth || 0) >= 0 ? "text-emerald-500" : "text-rose-500"} 
        />
        <StatCard label="Total_Gross" value={`$ ${(stats.totalRevenue || 0).toLocaleString()}`} color="text-indigo-500" />
        <StatCard label="Platform_Fees" value={`$ ${(stats.totalFees || 0).toLocaleString()}`} color="text-emerald-400" icon={<Zap size={14} />} />
        <StatCard label="Transactions" value={(stats.transactionCount || 0).toLocaleString()} color="text-amber-500" icon={<BarChart3 size={14} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Daily_Revenue_&_Fees">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRevenue}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} 
                formatter={(value: any, name: string) => [`$ ${value.toLocaleString()}`, name === 'revenue' ? 'Gross Revenue' : 'Platform Fee']} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="platformFee" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFee)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer title="Monthly_Aggregates">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} formatter={(value: any) => `$ ${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <ChartContainer title="Product_Line_Performance">
        <div className="space-y-4">
          {categoricalRevenue.length > 0 ? categoricalRevenue.map((item: any) => {
            const percentage = (item.revenue / (stats.thisMonth || 1)) * 100;
            return (
              <div key={item.product}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-[10px] font-mono uppercase text-white tracking-widest">{item.product.replace(/_/g, ' ')}</p>
                  <p className="font-bold text-emerald-400">$ {item.revenue.toLocaleString()}</p>
                </div>
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[8px] font-mono text-zinc-600 mt-1">{percentage.toFixed(1)}% OF MONTHLY REVENUE</p>
              </div>
            );
          }) : (
            <p className="text-center py-10 text-[10px] font-mono text-zinc-800 uppercase tracking-[0.3em]">No_Category_Data_Available</p>
          )}
        </div>
      </ChartContainer>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-8 text-center">
        <TrendingUp className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2 italic tracking-tighter uppercase font-mono">Real-Time_Revenue_Active</h3>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">System is successfully aggregating data from verified payment intents and platform commission fees.</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white", icon }: { label: string, value: string, color?: string, icon?: React.ReactNode }) => (
  <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
      {icon && <span className="text-zinc-800">{icon}</span>}
      {label}
    </p>
    <p className={`text-2xl font-bold ${color} tracking-tighter`}>{value}</p>
  </div>
);

const ChartContainer = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
    <h3 className="text-white font-bold mb-6 italic tracking-tight uppercase text-[10px] font-mono text-zinc-500 tracking-widest flex items-center gap-2">
      <div className="w-1 h-3 bg-indigo-500" />
      {title}
    </h3>
    {children}
  </div>
);

export default RevenueAnalytics;
