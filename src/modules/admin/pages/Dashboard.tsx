import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  ShieldCheck, AlertCircle, Users, Database, 
  TrendingUp, ArrowUpRight, CheckCircle2, Clock 
} from 'lucide-react';
import { useAuthStore } from '../../auth/useAuthstore';

// Mock data for Quality Trends (Intersection over Union scores)
const qualityData = [
  { name: 'Mon', accuracy: 88, disputes: 12 },
  { name: 'Tue', accuracy: 92, disputes: 8 },
  { name: 'Wed', accuracy: 85, disputes: 15 },
  { name: 'Thu', accuracy: 94, disputes: 5 },
  { name: 'Fri', accuracy: 97, disputes: 2 },
  { name: 'Sat', accuracy: 95, disputes: 4 },
  { name: 'Sun', accuracy: 98, disputes: 1 },
];

const AdminDashboard = () => {
    const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-8 font-sans">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-500">Welcome {user?.name || 'Admin'}!</h1>
          <p className="text-slate-500 font-medium">Here is what's happening in your system today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-black cursor-pointer bg-white border border-slate-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all">
            System Settings
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ShieldCheck className="text-emerald-500" />} label="Avg. Accuracy" value="96.2%" trend="+2.4%" />
        <StatCard icon={<Database className="text-blue-500" />} label="Total Labels" value="1.2M" trend="+18k" />
        <StatCard icon={<Users className="text-indigo-500" />} label="Active Annotators" value="4,829" trend="+120" />
        <StatCard icon={<AlertCircle className="text-rose-500" />} label="Pending Disputes" value="24" trend="-5" isNegative />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quality Trend Chart (Large) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Global Quality Score (IoU)</h3>
            <select className="bg-slate-50 border-none text-xs font-bold rounded-md px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qualityData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Quality Alerts / Issues */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            Critical Review Queue
          </h3>
          <div className="space-y-4">
            <AlertItem project="Medical Imagery X" status="Low Consensus" color="bg-rose-100 text-rose-600" />
            <AlertItem project="Self-Driving LiDAR" status="Out of Sync" color="bg-amber-100 text-amber-600" />
            <AlertItem project="Text Sentiment v2" status="High Rejection" color="bg-rose-100 text-rose-600" />
            <AlertItem project="Product Catalog" status="Review Ready" color="bg-blue-100 text-blue-600" />
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm">
            View All Projects
          </button>
        </div>

      </div>
    </div>
  );
};

// Sub-components for cleaner code
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  isNegative?: boolean;
}

const StatCard = ({ icon, label, value, trend, isNegative = false }: StatCardProps) => (
  <div className="bg-gray-950 p-6 rounded-2xl shadow-lg border border-slate-800 hover:shadow-sm hover:shadow-indigo-200  transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-100 text-emerald-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-semibold">{label}</p>
    <h2 className="text-2xl font-bold text-white-900 mt-1">{value}</h2>
  </div>
);

interface AlertItemProps {
  project: string;
  status: string;
  color: string;
}

const AlertItem = ({ project, status, color }: AlertItemProps) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{project}</h4>
      <div className={`mt-1 inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${color}`}>
        {status}
      </div>
    </div>
    <ArrowUpRight size={16} className="text-slate-300" />
  </div>
);

export default AdminDashboard;