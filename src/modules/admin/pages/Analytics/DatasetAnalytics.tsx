import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';

const DatasetAnalytics = () => {
  const { datasetData, loading, fetchDatasetAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchDatasetAnalytics();
  }, [fetchDatasetAnalytics]);

  if (loading || !datasetData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-zinc-700 animate-pulse bg-black/20 rounded-sm border border-zinc-900/50">
        <RefreshCcw className="animate-spin" size={24} />
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Synchronizing_Dataset_Telemetry...</p>
      </div>
    );
  }

  const { stats, submissionTrend, approvalTrend } = datasetData;

  // Format dates for display
  const formattedSubmissionTrend = submissionTrend.map((item: any) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total_Datasets" value={(stats.total || 0).toLocaleString()} />
        <StatCard label="Pending_Review" value={(stats.pending || 0).toLocaleString()} color="text-amber-500" />
        <StatCard label="Approved_Assets" value={(stats.approved || 0).toLocaleString()} color="text-emerald-500" />
        <StatCard label="Rejected_Assets" value={(stats.rejected || 0).toLocaleString()} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Submission_Trend_(Last_7_Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedSubmissionTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} 
                formatter={(value: any) => [`${value} Datasets`, 'Submissions']}
              />
              <Line type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer title="Approval_Rate_Trend_(Monthly)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={approvalTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} 
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Approval Rate']}
              />
              <Bar dataKey="rate" fill="#10b981" radius={[2, 2, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-8 text-center">
        <TrendingUp className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2 italic tracking-tighter uppercase font-mono">Dataset_Lifecycle_Active</h3>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Tracking assets from submission through verification and marketplace deployment.</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) => (
  <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
    <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-3xl font-bold ${color} tracking-tighter`}>{value}</p>
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

export default DatasetAnalytics;
