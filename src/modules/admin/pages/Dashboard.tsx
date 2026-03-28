import { useEffect } from 'react';
import { analyticsStore } from '../store/analyticsStore';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  ShieldCheck, AlertCircle, Users, Database, 
  TrendingUp, ArrowUpRight, DollarSign, Activity, Terminal
} from 'lucide-react';
import { useAuthStore } from '../../auth/useAuthstore';

const qualityData = [
  { name: 'Mon', accuracy: 88, disputes: 12 },
  { name: 'Tue', accuracy: 92, disputes: 8 },
  { name: 'Wed', accuracy: 85, disputes: 15 },
  { name: 'Thu', accuracy: 94, disputes: 5 },
  { name: 'Fri', accuracy: 97, disputes: 2 },
  { name: 'Sat', accuracy: 95, disputes: 4 },
  { name: 'Sun', accuracy: 98, disputes: 1 },
];

const revenueData = [
  { name: 'Mon', revenue: 4500 },
  { name: 'Tue', revenue: 5200 },
  { name: 'Wed', revenue: 4800 },
  { name: 'Thu', revenue: 6100 },
  { name: 'Fri', revenue: 5500 },
  { name: 'Sat', revenue: 6700 },
  { name: 'Sun', revenue: 7200 },
];

const recentActivity = [
  { user: "Alex D.", action: "submitted dataset", target: "Urban LiDAR v2", time: "2 min ago" },
  { user: "Sarah M.", action: "raised dispute", target: "Medical MRI", time: "15 min ago" },
  { user: "System", action: "auto-banned", target: "Bot_User_99", time: "1 hr ago" },
  { user: "Admin", action: "approved", target: "Retail Sentiment", time: "2 hrs ago" },
];

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const { getAnalytics, overview } = analyticsStore();

    useEffect(() => {
      getAnalytics();
    }, [getAnalytics]);

  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* Header: Commands & Auth Level */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-3">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Root_Access_Level_00</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
            Welcome, Commander <span className="text-indigo-400 font-light not-italic">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-4 font-light">System telemetry synchronized across global worker nodes.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-zinc-950 border border-zinc-900 px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all rounded-sm">
            Export_Registry_Log
          </button>
          <button className="bg-white px-6 py-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all rounded-sm shadow-2xl shadow-indigo-500/20">
            System_Config
          </button>
        </div>
      </header>

      {/* 1. Primary KPIs: Gap-Px Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-zinc-900 border border-zinc-900 mb-12 shadow-2xl">
        <StatCard icon={<ShieldCheck size={16} />} label="Avg_Accuracy" value="96.2%" trend="+2.4%" color="emerald" />
        <StatCard icon={<Database size={16} />} label="Asset_Inventory" value={(overview?.datasets.total ?? 0).toString()} trend={`+${(overview?.datasets.pending ?? 0)}`} color="indigo" />
        <StatCard icon={<Users size={16} />} label="Operator_Count" value={(overview?.users.total ?? 0).toString()} trend={`+${overview?.users.newThisMonth ?? 0}`} color="indigo" />
        <StatCard icon={<AlertCircle size={16} />} label="Active_Disputes" value="24" trend="-12%" color="rose" isNegative />
        <StatCard icon={<TrendingUp size={16} />} label="Inflow_Today" value={(overview?.users.newToday ?? 0).toString()} trend="STABLE" color="indigo" />
      </div>

      {/* 2. Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        
        {/* Quality Trend: Dark Chart */}
        <div className="lg:col-span-2 bg-[#050505] border border-zinc-900 p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-white font-bold text-lg tracking-tight italic">Quality Score Telemetry (IoU)</h3>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">// Neural_Validation_Index</p>
            </div>
            <select className="bg-black border border-zinc-800 text-[10px] font-mono text-indigo-500 px-3 py-1 outline-none">
              <option>LAST_7_DAYS</option>
              <option>LAST_30_DAYS</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qualityData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Queue: Critical Nodes */}
        <div className="bg-[#050505] border border-zinc-900 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="text-rose-500" size={18} />
            <h3 className="text-white font-bold text-lg tracking-tight italic">Review Queue</h3>
          </div>
          <div className="space-y-4">
            <AlertItem project="Medical Imagery X" status="LOW_CONSENSUS" variant="danger" />
            <AlertItem project="Self-Driving LiDAR" status="SYNC_LATENCY" variant="warning" />
            <AlertItem project="Text Sentiment v2" status="REJECTION_SPIKE" variant="danger" />
            <AlertItem project="Product Catalog" status="READY_FOR_ROOT" variant="primary" />
          </div>
          <button className="w-full mt-10 py-3 border border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-zinc-900 transition-all">
            Full_Registry_Audit
          </button>
        </div>
      </div>

      {/* 3. Secondary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-[#050505] border border-zinc-900 p-8">
          <div className="flex items-center gap-3 mb-8">
            <DollarSign className="text-emerald-500" size={18}/>
            <h3 className="text-white font-bold text-lg tracking-tight italic">Financial Settlement (USD)</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} dy={10} />
                <Tooltip cursor={{fill: '#18181b'}} contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #27272a', borderRadius: '2px', fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed: Monospace Style */}
        <div className="bg-[#050505] border border-zinc-900 p-8 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-8 border-b border-zinc-900 pb-4">
                <Activity className="text-indigo-500" size={18}/>
                <h3 className="text-white font-bold text-lg tracking-tight italic">Live Registry Feed</h3>
            </div>
            <div className="space-y-6">
                {recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                        <div className="h-2 w-2 rounded-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors mt-1.5 shrink-0" />
                        <div>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                                <span className="font-mono text-zinc-500 uppercase text-[10px] mr-1">{item.user}</span> 
                                <span className="font-light">{item.action}</span> 
                                <span className="text-indigo-400 font-mono text-[10px] ml-1">[{item.target}]</span>
                            </p>
                            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- TECHNICAL HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, trend, isNegative, color }: any) => {
  const accentColors = {
    emerald: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
    indigo: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
    rose: "text-rose-500 border-rose-500/20 bg-rose-500/5",
  };
  return (
    <div className="bg-[#050505] p-6 hover:bg-[#080808] transition-colors group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2 border rounded-sm ${accentColors[color as keyof typeof accentColors]}`}>{icon}</div>
        <span className={`text-[10px] font-mono font-bold tracking-tighter ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1">// {label}</p>
      <h2 className="text-2xl font-bold text-white tabular-nums tracking-tighter">{value}</h2>
    </div>
  );
};

const AlertItem = ({ project, status, variant }: any) => {
  const themes = {
    danger: "text-rose-500 bg-rose-500/5 border-rose-500/20",
    warning: "text-amber-500 bg-amber-500/5 border-amber-500/20",
    primary: "text-indigo-500 bg-indigo-500/5 border-indigo-500/20",
  };
  return (
    <div className="flex items-center justify-between p-4 bg-black border border-zinc-900 group cursor-pointer hover:border-zinc-700 transition-all">
      <div className="min-w-0">
        <h4 className="font-bold text-zinc-200 text-sm truncate tracking-tight">{project}</h4>
        <div className={`mt-2 inline-block px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-widest ${themes[variant as keyof typeof themes]}`}>
          {status}
        </div>
      </div>
      <ArrowUpRight size={14} className="text-zinc-800 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
    </div>
  );
};

export default AdminDashboard;