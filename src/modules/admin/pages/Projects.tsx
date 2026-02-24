import React from 'react';
import { 
  Briefcase, MoreHorizontal, Users, BarChart3, 
  Clock, CheckCircle2, AlertTriangle, Layers,
  Filter, Plus, Search, ArrowUpRight
} from 'lucide-react';

const AdminProjectsPage = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Registry</h1>
          <p className="text-slate-500 font-medium">Monitoring {24} active production pipelines</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={20} /> Provision New Project
        </button>
      </div>

      {/* Global Project Health Aggregator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthMetric label="On Track" count={18} color="bg-emerald-500" />
        <HealthMetric label="At Risk" count={4} color="bg-amber-500" />
        <HealthMetric label="Critical/Delayed" count={2} color="bg-rose-500" />
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 px-3 flex-1">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects by buyer, tag, or ID..." 
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><Filter size={18} /></button>
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><BarChart3 size={18} /></button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProjectCard 
          name="Autonomous Navigation Dataset v4" 
          buyer="Tesla Autopilot Team"
          progress={78}
          accuracy={94.2}
          annotators={124}
          status="Active"
          priority="High"
        />
        <ProjectCard 
          name="Medical MRI Segmentation" 
          buyer="Mayo Clinic Research"
          progress={32}
          accuracy={98.9}
          annotators={12}
          status="At Risk"
          priority="Critical"
        />
        <ProjectCard 
          name="E-commerce Sentiment Analysis" 
          buyer="Amazon Retail"
          progress={100}
          accuracy={91.5}
          annotators={45}
          status="Completed"
          priority="Normal"
        />
        <ProjectCard 
          name="Multi-Modal LiDAR Mapping" 
          buyer="Waymo Engineering"
          progress={55}
          accuracy={88.2}
          annotators={89}
          status="Active"
          priority="High"
        />
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

interface ProjectCardProps {
  name: string;
  buyer: string;
  progress: number;
  accuracy: number;
  annotators: number;
  status: string;
  priority: string;
}

const ProjectCard = ({ name, buyer, progress, accuracy, annotators, status, priority }: ProjectCardProps) => (
  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status === 'At Risk' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <h3 className="font-bold text-slate-900 text-lg">{name}</h3>
        </div>
        <p className="text-sm text-slate-400 font-medium">Client: <span className="text-slate-600 font-bold">{buyer}</span></p>
      </div>
      <button className="p-2 text-slate-300 hover:text-slate-600"><MoreHorizontal /></button>
    </div>

    {/* Metrics Strip */}
    <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 p-3 rounded-2xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Completion</p>
            <p className="text-lg font-black text-slate-900">{progress}%</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Accuracy</p>
            <p className={`text-lg font-black ${accuracy < 90 ? 'text-rose-600' : 'text-slate-900'}`}>{accuracy}%</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Annotators</p>
            <p className="text-lg font-black text-slate-900">{annotators}</p>
        </div>
    </div>

    {/* Progress Bar */}
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Project Velocity</span>
            <span className="text-slate-900">{progress}/100%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
                className={`h-full transition-all duration-1000 ${status === 'At Risk' ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                style={{ width: `${progress}%` }} 
            />
        </div>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
            <div className="h-8 w-8 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 text-[10px] flex items-center justify-center font-bold">+{annotators - 4}</div>
        </div>
        <button className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
            Audit Pipeline <ArrowUpRight size={16} />
        </button>
    </div>
  </div>
);

interface HealthMetricProps {
  label: string;
  count: number;
  color: string;
}

const HealthMetric = ({ label, count, color }: HealthMetricProps) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
        <div className={`h-10 w-1 rounded-full ${color}`} />
        <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{count}</p>
            <p className="text-xs font-bold text-slate-400 uppercase mt-1">{label}</p>
        </div>
    </div>
);

export default AdminProjectsPage;