import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { labellerAnalyticsStore } from '../../store/analyticsStore';

const LabellerAnalytics = () => {
  const { labellerOverview: overview, labellerPerformance: performance, labellerTiers: tiers, labellerEarnings: earnings, labellerActivity: activity, labellerTaskCompletion: taskCompletion, labellerRatings: ratings, loading, error, fetchLabellerAnalytics } = labellerAnalyticsStore();

  useEffect(() => {
    fetchLabellerAnalytics();
  }, [fetchLabellerAnalytics]);

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse text-[10px] font-mono text-zinc-700">LOADING_ANALYTICS...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/30 border border-rose-900 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <div>
          <p className="font-medium text-rose-200">Error loading analytics</p>
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return <div className="text-center text-zinc-500">No data available</div>;
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
  const statusData = overview?.statusDistribution || [];
  const perfDistribution = performance?.distribution || [];
  const tierData = tiers?.byTier || [];
  const perfMetrics = overview?.performanceMetrics || {};
  const earningsData = earnings?.distribution || [];
  const topEarners = earnings?.topEarners || [];
  const activityMetrics = activity || {
    activeLast7Days: 0,
    activeLast30Days: 0,
    inactive30Plus: 0,
    activityRate7d: '0',
    activityRate30d: '0',
  };
  const taskStats = taskCompletion || {
    totalTasksAssigned: 0,
    totalTasksCompleted: 0,
    totalTasksRejected: 0,
    completionRate: '0',
    rejectionRate: '0',
    avgTasksPerLabeller: 0,
  };
  const ratingsDistribution = ratings?.distribution || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Labellers</p>
          <p className="text-3xl font-bold text-white">{overview?.totalLabellers || 0}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Active_Labellers</p>
          <p className="text-3xl font-bold text-emerald-500">{overview?.activeLabellers || 0}</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Avg_Quality_Score</p>
          <p className="text-3xl font-bold text-indigo-500">{(perfMetrics?.avgQualityScore ?? 0).toFixed(2)}/5</p>
        </div>
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Completion_Rate</p>
          <p className="text-3xl font-bold text-indigo-400">{(perfMetrics?.avgCompletionRate ?? 0).toFixed(0)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Status_Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-zinc-600 text-center py-20">No status data available</p>
          )}
        </div>

        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Quality_Score_Distribution</h3>
          {perfDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={perfDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis dataKey="scoreRange" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-zinc-600 text-center py-20">No distribution data available</p>
          )}
        </div>
      </div>

      <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
        <h3 className="text-white font-bold mb-4 italic tracking-tight">Labellers_By_Tier</h3>
        {tierData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tierData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                  <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
                  <Bar dataKey="count" fill="#6366f1" name="Labeller Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-y-auto max-h-[300px]">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950 border-b border-zinc-900 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Tier</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Count</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Avg_Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {tierData.map((tier: any) => (
                    <tr key={tier.tier} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 text-sm font-medium text-white">{tier.tier}</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">{tier.count}</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">{(tier.avgQualityScore ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-zinc-600 text-center py-10">No tier data available</p>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Earned</p>
            <p className="text-3xl font-bold text-emerald-500">KES {(earnings?.totals?.totalEarned || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Paid</p>
            <p className="text-3xl font-bold text-emerald-400">KES {(earnings?.totals?.totalPaid || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Pending_Payment</p>
            <p className="text-3xl font-bold text-yellow-600">KES {(earnings?.totals?.totalPending || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Avg_Per_Labeller</p>
            <p className="text-3xl font-bold text-indigo-500">KES {((earnings?.totals?.totalEarned || 0) / (earnings?.totals?.totalLabellers || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <h3 className="text-white font-bold mb-4 italic tracking-tight">Earnings_Distribution</h3>
            {earningsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                  <XAxis dataKey="earningsRange" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-zinc-600 text-center py-20">No earnings data available</p>
            )}
          </div>

          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <h3 className="text-white font-bold mb-4 italic tracking-tight">Top_Earners</h3>
            {topEarners.length > 0 ? (
              <div className="space-y-3">
                {topEarners.slice(0, 5).map((earner: any) => (
                  <div key={earner.rank} className="flex items-center justify-between p-3 bg-zinc-900/30 rounded border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-400">#{earner.rank}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{earner.labellerName}</p>
                        <p className="text-xs text-zinc-500">{earner.tier} • {earner.tasksCompleted} tasks</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-emerald-500">KES {(earner.totalEarned || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-center py-10">No earner data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Active_Last_7_Days</p>
            <p className="text-3xl font-bold text-emerald-500">{activityMetrics?.activeLast7Days || 0}</p>
            <p className="text-xs text-zinc-600 mt-2">{activityMetrics?.activityRate7d || '0'}% of total</p>
          </div>
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Active_Last_30_Days</p>
            <p className="text-3xl font-bold text-indigo-500">{activityMetrics?.activeLast30Days || 0}</p>
            <p className="text-xs text-zinc-600 mt-2">{activityMetrics?.activityRate30d || '0'}% of total</p>
          </div>
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Inactive_30_Plus</p>
            <p className="text-3xl font-bold text-rose-500">{activityMetrics?.inactive30Plus || 0}</p>
            <p className="text-xs text-zinc-600 mt-2">Days without activity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
              <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Tasks_Assigned</p>
              <p className="text-3xl font-bold text-white">{(taskStats?.totalTasksAssigned || 0).toLocaleString()}</p>
            </div>
            <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
              <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Tasks_Completed</p>
              <p className="text-3xl font-bold text-emerald-500">{(taskStats?.totalTasksCompleted || 0).toLocaleString()}</p>
            </div>
            <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
              <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Total_Tasks_Rejected</p>
              <p className="text-3xl font-bold text-rose-500">{(taskStats?.totalTasksRejected || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-4">Completion_Metrics</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-zinc-400">Completion Rate</span>
                  <span className="text-sm font-bold text-emerald-500">{taskStats?.completionRate || '0'}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{width: `${parseFloat(taskStats?.completionRate || '0')}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-zinc-400">Rejection Rate</span>
                  <span className="text-sm font-bold text-rose-500">{taskStats?.rejectionRate || '0'}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{width: `${parseFloat(taskStats?.rejectionRate || '0')}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest mb-2">Avg_Tasks_Per_Labeller</p>
            <p className="text-3xl font-bold text-indigo-500">{(taskStats?.avgTasksPerLabeller ?? 0).toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Average_Rating</h3>
          <div className="text-center py-6">
            <p className="text-5xl font-bold text-indigo-500">{(ratings?.averageRating?.avgRating ?? 0).toFixed(2)}</p>
            <p className="text-sm text-zinc-600 mt-2">out of 5.00</p>
            <p className="text-xs text-zinc-500 mt-1">Based on {ratings?.averageRating?.totalRatings || 0} ratings</p>
          </div>
        </div>

        <div className="bg-[#050505] rounded-sm border border-zinc-900 p-6">
          <h3 className="text-white font-bold mb-4 italic tracking-tight">Rating_Distribution</h3>
          {ratingsDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingsDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis dataKey="ratingBucket" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-zinc-600 text-center py-20">No ratings data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabellerAnalytics;
