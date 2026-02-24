import React from 'react';
import { 
  ShieldAlert, Terminal, LifeBuoy, BookOpen, 
  UserPlus, FileWarning, Cpu, HardDrive, 
  ArrowRight, ClipboardList, Lock, Zap 
} from 'lucide-react';

const AdminHelpPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Internal System Status Banner */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-700 text-sm font-bold">VeraLabel Core Systems: Operational</span>
        </div>
        <span className="text-[10px] font-black text-emerald-600 uppercase">Latency: 42ms</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Operations Manual</h1>
        <p className="text-slate-500 mt-2">Internal protocols for dataset moderation, user disputes, and system governance.</p>
      </div>

      {/* Admin Action Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminQuickAction 
          icon={<ShieldAlert className="text-rose-500" />} 
          title="Dispute Protocol" 
          count="SOP-01"
        />
        <AdminQuickAction 
          icon={<UserPlus className="text-blue-500" />} 
          title="Onboarding" 
          count="SOP-02"
        />
        <AdminQuickAction 
          icon={<Terminal className="text-slate-700" />} 
          title="CLI Guide" 
          count="SOP-03"
        />
        <AdminQuickAction 
          icon={<Cpu className="text-indigo-500" />} 
          title="System Physics" 
          count="SOP-04"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Interactive SOPs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList size={20} className="text-indigo-600" /> Critical Procedures
          </h2>
          
          <div className="space-y-4">
            <SOPItem 
              title="How to Handle High-Conflict Disputes"
              description="Steps to take when consensus between buyer and annotator falls below 40%."
              tag="Moderation"
            />
            <SOPItem 
              title="Manual Override for Payment Batches"
              description="Procedure for releasing funds in case of automated gateway failure."
              tag="Finance"
            />
            <SOPItem 
              title="Blacklisting Malicious Annotators"
              description="Internal criteria for account termination and IP banning."
              tag="Security"
            />
          </div>
        </div>

        {/* Right Column: Admin Tools & Resources */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-6 text-indigo-400">
              <Zap size={18} fill="currentColor" />
              <h3 className="text-xs font-black uppercase tracking-widest">Emergency Tools</h3>
            </div>
            
            <div className="space-y-3">
              <EmergencyButton label="Purge System Cache" isDanger={false} />
              <EmergencyButton label="Revoke All API Keys" isDanger />
              <EmergencyButton label="Toggle Maintenance" isDanger={false} />
            </div>
          </div>

          <div className="p-6 border border-slate-200 rounded-3xl space-y-4">
             <h3 className="font-bold text-slate-800">Support Resources</h3>
             <ResourceLink title="Platform API Reference" />
             <ResourceLink title="Database Schema Docs" />
             <ResourceLink title="Contact Lead Dev" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

interface AdminQuickActionProps {
  icon: React.ReactNode;
  title: string;
  count: string;
}

const AdminQuickAction = ({ icon, title, count }: AdminQuickActionProps) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer group">
    <div className="mb-4">{icon}</div>
    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{title}</h4>
    <span className="text-[10px] font-black text-slate-400 mt-1 block">{count}</span>
  </div>
);

interface SOPItemProps {
  title: string;
  description: string;
  tag: string;
}

const SOPItem = ({ title, description, tag }: SOPItemProps) => (
  <div className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all group cursor-pointer">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider">{tag}</span>
        <h4 className="font-bold text-slate-800 text-md">{title}</h4>
      </div>
      <p className="text-sm text-slate-500 max-w-md">{description}</p>
    </div>
    <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
  </div>
);

interface EmergencyButtonProps {
  label: string;
  isDanger?: boolean;
}

const EmergencyButton = ({ label, isDanger }: EmergencyButtonProps) => (
  <button className={`w-full py-3 rounded-xl text-xs font-bold transition-all border ${
    isDanger 
    ? 'border-rose-900/50 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white' 
    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`}>
    {label}
  </button>
);

interface ResourceLinkProps {
  title: string;
}

const ResourceLink = ({ title }: ResourceLinkProps) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-50 group cursor-pointer">
    <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{title}</span>
    <Lock size={12} className="text-slate-300" />
  </div>
);

export default AdminHelpPage;