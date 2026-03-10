import React from 'react';
import { 
  Search, BookOpen, Terminal, LifeBuoy, 
  FileText, ArrowUpRight, Clock, ShieldCheck, 
  Cpu, Globe, Mail
} from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
              Protocol Support / Resource Center
            </span>
          </div>
          <span className="font-mono text-[9px] text-zinc-700 uppercase hidden md:block">
            Latency: 12ms / Status: Operational
          </span>
        </div>

        {/* --- HERO SECTION --- */}
        <section className="mb-24">
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
            Technical <br />
            <span className="text-zinc-600 font-normal italic">Resolution.</span>
          </h1>
          
          <div className="relative max-w-2xl mt-12 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Query documentation, API specs, or system status..." 
              className="w-full bg-transparent border-b border-zinc-800 py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700 text-zinc-300"
            />
          </div>
        </section>

        {/* --- CORE RESOURCE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-24">
          <ResourceCategory 
            icon={<Terminal size={18} />} 
            title="API Specification" 
            desc="Enterprise endpoints for dataset ingestion and webhook configuration."
          />
          <ResourceCategory 
            icon={<BookOpen size={18} />} 
            title="Annotation Guide" 
            desc="Human-in-the-loop protocols for linguistic and visual verification."
          />
          <ResourceCategory 
            icon={<ShieldCheck size={18} />} 
            title="Quality Consensus" 
            desc="Understanding algorithmic arbitration and dataset audit trails."
          />
        </div>

        {/* --- DOCUMENTATION & TICKETS --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-t border-zinc-900 pt-16">
          
          {/* LEFT: RECENT UPDATES */}
          <div className="md:col-span-7 space-y-12">
            <div>
              <h3 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-8">Technical Briefs</h3>
              <div className="space-y-px bg-zinc-900 border border-zinc-900">
                <ArticleLink title="Configuring R2 Presigned Redirects" category="Dev" />
                <ArticleLink title="Paystack Webhook Security Best Practices" category="Payments" />
                <ArticleLink title="Luo/Nilotic Linguistic Framework 2026" category="Linguistics" />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-white font-mono text-[10px] uppercase tracking-[0.3em]">System Diagnostics</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatusCard label="US-East Gateway" status="Active" />
                <StatusCard label="Africa-South Edge" status="Active" />
              </div>
            </div>
          </div>

          {/* RIGHT: DIRECT RESOLUTION */}
          <div className="md:col-span-5">
            <div className="sticky top-24 space-y-8">
              <div className="p-8 border border-zinc-800 rounded-sm">
                <h3 className="text-white font-medium text-lg mb-2">Direct Resolution</h3>
                <p className="text-zinc-500 text-xs mb-8 leading-relaxed">
                  For critical infrastructure failure or dataset disputes, initiate a technical ticket.
                </p>
                <div className="space-y-4">
                  <button className="w-full py-3 bg-zinc-100 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Initialize Ticket
                  </button>
                  <button className="w-full py-3 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
                    <Mail size={14} /> Contact Engineering
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4">
                <div className="h-8 w-8 rounded-full border border-zinc-800 flex items-center justify-center">
                  <Globe size={14} className="text-zinc-600" />
                </div>
                <div className="text-[10px] uppercase tracking-tighter">
                  <span className="text-zinc-600">Local Presence:</span>
                  <span className="text-zinc-400 ml-2 italic">Bungoma / Nairobi Ops</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// --- PRIVATE COMPONENTS ---

const ResourceCategory = ({ icon, title, desc }) => (
  <div className="bg-[#050505] p-10 hover:bg-zinc-900/40 transition-all group">
    <div className="text-zinc-600 group-hover:text-blue-500 transition-colors mb-6">
      {icon}
    </div>
    <h3 className="text-zinc-200 font-semibold text-sm mb-3 uppercase tracking-widest">{title}</h3>
    <p className="text-xs leading-relaxed text-zinc-500 font-light">{desc}</p>
  </div>
);

const ArticleLink = ({ title, category }) => (
  <div className="bg-[#050505] flex items-center justify-between p-5 hover:bg-blue-900/5 cursor-pointer group transition-all">
    <div className="flex items-center gap-6">
      <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest w-16">{category}</span>
      <h4 className="text-zinc-300 text-sm group-hover:text-white transition-colors">{title}</h4>
    </div>
    <ArrowUpRight size={14} className="text-zinc-800 group-hover:text-zinc-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </div>
);

const StatusCard = ({ label, status }) => (
  <div className="p-4 border border-zinc-900 flex items-center justify-between">
    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">{label}</span>
    <div className="flex items-center gap-2">
      <div className="h-1 w-1 rounded-full bg-green-500" />
      <span className="text-[9px] font-bold text-green-900/80 uppercase">{status}</span>
    </div>
  </div>
);

export default HelpPage;