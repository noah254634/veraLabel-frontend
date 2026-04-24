import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const DatasetAnalytics = () => {
  const datasetStats = {
    total: 1245,
    pending: 89,
    approved: 1023,
    rejected: 133
  };

  const submissionTrend = [
    { date: 'Mon', submissions: 45 },
    { date: 'Tue', submissions: 52 },
    { date: 'Wed', submissions: 48 },
    { date: 'Thu', submissions: 61 },
    { date: 'Fri', submissions: 55 },
    { date: 'Sat', submissions: 42 },
    { date: 'Sun', submissions: 38 },
  ];

  const approvalRate = [
    { date: 'Week 1', rate: 82 },
    { date: 'Week 2', rate: 85 },
    { date: 'Week 3', rate: 88 },
    { date: 'Week 4', rate: 86 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Datasets</p>
          <p className="text-3xl font-bold text-white">{datasetStats.total}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Pending_Review</p>
          <p className="text-3xl font-bold text-yellow-600">{datasetStats.pending}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Approved</p>
          <p className="text-3xl font-bold text-emerald-500">{datasetStats.approved}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Rejected</p>
          <p className="text-3xl font-bold text-rose-600">{datasetStats.rejected}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Weekly_Submissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={submissionTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Approval_Rate_Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={approvalRate}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="rate" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-8 text-center">
        <TrendingUp className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2 italic">More_Dataset_Insights_Coming</h3>
        <p className="text-zinc-500 font-mono text-sm">Category breakdown, file format analysis, and more detailed metrics will be available soon.</p>
      </div>
    </div>
  );
};

export default DatasetAnalytics;
