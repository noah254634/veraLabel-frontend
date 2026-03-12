import React from 'react';
import { 
  ShieldAlert, Terminal, LifeBuoy, BookOpen, 
  UserPlus, FileWarning, Cpu, HardDrive, 
  ArrowRight, ClipboardList, Lock, Zap, Activity
} from 'lucide-react';

const AdminHelpPage = () => {
  return (
    <div className="w-full animate-in fade-in duration-700">
      
      {/* Internal System Status Banner: Hardened UI */}
      <div className="bg-[#050505] border border-emerald-500/20 p-4 mb-10 flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
            VeraLabel_Core_Node: Operational
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600 font-bold uppercase">
            <span>Latency // 42ms</span>
            <div className="h-3 w-px bg-zinc-800" />
            <span>Enc_Level // AES-256</span>
        </div>
      </div>

      {/* Header: Commands */}
      <header className="mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold underline underline-offset-8">Support_Protocols_v1</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Operations Manual</h1>
        <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed max-w-2xl">
          Authorized internal procedures for dataset moderation, personnel dispute resolution, and systemic governance.
        </p>
      </header>

      {/* Admin SOP Categories: Gap-Px Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 mb-16 shadow-2xl">
        <AdminQuickAction icon={<ShieldAlert size={18} className="text-rose-500" />} title="Dispute_Protocol" code="SOP_01" />
        <AdminQuickAction icon={<UserPlus size={18} className="text-blue-500" />} title="Node_Onboarding" code="SOP_02" />
        <AdminQuickAction icon={<Terminal size={18} className="text-zinc-400" />} title="Internal_CLI" code="SOP_03" />
        <AdminQuickAction icon={<Cpu size={18} className="text-indigo-500" />} title="System_Physics" code="SOP_04" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Interactive SOPs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Activity size={16} className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white tracking-tight italic">Critical Procedures</h2>
          </div>
          
          <div className="space-y-px bg-zinc-900 border border-zinc-900">
            <SOPItem 
              title="High-Conflict Resolution Protocol"
              description="Steps to take when consensus between buyer nodes and Bungoma annotators falls below 40%."
              tag="MODERATION"
            />
            <SOPItem 
              title="Manual Financial Override"
              description="Procedure for force-releasing payment batches in the event of automated Paystack gateway latency."
              tag="FINANCE"
            />
            <SOPItem 
              title="Adversarial Node Blacklisting"
              description="Criteria for immediate operator account termination and hardware IP nullification."
              tag="SECURITY"
            />
          </div>
        </div>

        {/* Right Column: Emergency Utilities */}
        <aside className="space-y-10">
          <section className="bg-black border border-zinc-900 p-8 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-8 text-indigo-500 relative z-10">
              <Zap size={16} fill="currentColor" />
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">Emergency_Kit</h3>
            </div>
            
            <div className="space-y-3 relative z-10">
              <EmergencyButton label="Purge_System_Cache" />
              <EmergencyButton label="Revoke_Global_API_Keys" isDanger />
              <EmergencyButton label="Initialize_Maintenance_Lock" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          </section>

          <div className="bg-[#050505] border border-zinc-900 p-8 space-y-6">
             <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600">// Support_Resources</h3>
             <div className="space-y-1">
                <ResourceLink title="Core API Specification" />
                <ResourceLink title="Registry Database Schema" />
                <ResourceLink title="Encrypted Dev_Channel" />
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- TECHNICAL SUBCOMPONENTS ---

const AdminQuickAction = ({ icon, title, code }: any) => (
  <div className="bg-[#050505] p-6 hover:bg-[#080808] transition-all cursor-pointer group">
    <div className="mb-6 p-2 bg-zinc-950 border border-zinc-900 w-fit group-hover:border-zinc-700 transition-colors">{icon}</div>
    <h4 className="font-bold text-white text-xs uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{title}</h4>
    <span className="text-[8px] font-mono font-bold text-zinc-700 mt-2 block uppercase tracking-widest">Index: {code}</span>
  </div>
);

const SOPItem = ({ title, description, tag }: any) => (
  <div className="p-8 bg-[#050505] flex justify-between items-center hover:bg-[#080808] transition-all group cursor-pointer border-l-2 border-transparent hover:border-indigo-500">
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-500 font-mono text-[8px] font-bold uppercase tracking-widest">{tag}</span>
        <h4 className="font-bold text-zinc-200 text-sm tracking-tight">{title}</h4>
      </div>
      <p className="text-xs text-zinc-500 max-w-md font-light leading-relaxed">{description}</p>
    </div>
    <ArrowRight size={16} className="text-zinc-800 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
  </div>
);

const EmergencyButton = ({ label, isDanger }: any) => (
  <button className={`w-full py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest transition-all border ${
    isDanger 
    ? 'border-rose-900/50 bg-rose-500/5 text-rose-500 hover:bg-rose-600 hover:text-white' 
    : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-700'
  }`}>
    {label}
  </button>
);

const ResourceLink = ({ title }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-zinc-900 group cursor-pointer">
    <span className="text-xs text-zinc-500 group-hover:text-indigo-400 transition-colors uppercase font-mono tracking-tight">{title}</span>
    <Lock size={12} className="text-zinc-800 group-hover:text-zinc-400" />
  </div>
);

export default AdminHelpPage;