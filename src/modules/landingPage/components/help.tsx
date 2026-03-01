import React, { useState } from 'react';
import { 
  Search, BookOpen, MessageSquare, LifeBuoy, 
  ExternalLink, PlayCircle, ShieldQuestion, 
  FileText, ArrowRight, Sparkles, Clock, CheckCircle2 
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* --- HERO SEARCH SECTION --- */}
        <section className="relative overflow-hidden rounded-[2rem] bg-indigo-600 px-6 py-16 lg:py-24 text-center">
          {/* Decorative Mesh */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-100">
              <Sparkles size={14} className="text-amber-300" />
              Intelligent Support System
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              How can we <span className="text-indigo-200">help?</span>
            </h1>
            
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search guides, API docs, or resolutions..." 
                className="w-full bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl py-5 pl-14 pr-6 text-base outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-indigo-200 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* --- QUICK NAVIGATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HelpCard 
            icon={<BookOpen className="text-indigo-400" />} 
            title="Documentation" 
            desc="Technical blueprints for labeling tools and deep API integration."
            link="Explore Docs"
          />
          <HelpCard 
            icon={<PlayCircle className="text-indigo-400" />} 
            title="Video Tutorials" 
            desc="Master the neural annotation interface in under 5 minutes."
            link="Watch Series"
          />
          <HelpCard 
            icon={<ShieldQuestion className="text-indigo-400" />} 
            title="Dispute Guide" 
            desc="Understanding our algorithmic consensus and arbitration."
            link="Review Policy"
          />
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: TRENDING TOPICS */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Popular Resources</h2>
              <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">View All</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ArticleItem title="Setting up your Buyer Wallet" time="3 min read" />
              <ArticleItem title="Understanding IoU Accuracy Scores" time="6 min read" />
              <ArticleItem title="Annotator Payout Schedule (2026)" time="4 min read" />
              <ArticleItem title="Optimizing LiDAR Datasets" time="10 min read" />
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 lg:p-10">
              <h3 className="text-lg font-semibold mb-8 flex items-center gap-3">
                <LifeBuoy className="text-indigo-500" size={22} /> Troubleshooting
              </h3>
              <div className="space-y-3">
                <AccordionItem question="Why is my batch stuck in 'Pending Review'?" />
                <AccordionItem question="How to export datasets in YOLOv11 format?" />
                <AccordionItem question="What happens if a quality dispute is rejected?" />
              </div>
            </div>
          </div>

          {/* RIGHT: TICKET STATUS & SUPPORT */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Active Tickets</h3>
              <div className="space-y-2 mb-6">
                <TicketItem id="#VL-9021" status="In Progress" title="API Webhook Failure" />
                <TicketItem id="#VL-8842" status="Resolved" title="Withdrawal Delay" isClosed />
              </div>
              <button className="w-full py-4 bg-white text-black rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                New Ticket <ArrowRight size={16} />
              </button>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-indigo-500 transition-colors">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-white text-lg">Live Concierge</h3>
              <p className="text-indigo-100/70 text-sm mt-2 mb-6 font-light leading-relaxed">
                Connect with our technical engineers. <br />
                <span className="text-white font-medium">Wait time: ~14m</span>
              </p>
              <button className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                Start Chat
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

const HelpCard = ({ icon, title, desc, link }) => (
  <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/50 transition-all group flex flex-col h-full">
    <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-grow">{desc}</p>
    <button className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300 transition-colors">
      {link} <ArrowRight size={14} />
    </button>
  </div>
);

const ArticleItem = ({ title, time }) => (
  <div className="flex items-center justify-between p-5 bg-zinc-900 border border-white/5 rounded-2xl hover:border-indigo-500/30 cursor-pointer transition-all group">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-zinc-800 rounded-lg group-hover:text-indigo-400 transition-colors"><FileText size={18} /></div>
      <div>
        <h4 className="font-medium text-zinc-200 text-sm">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock size={10} className="text-zinc-600" />
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{time}</span>
        </div>
      </div>
    </div>
    <ExternalLink size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
  </div>
);

const TicketItem = ({ id, status, title, isClosed }) => (
  <div className="p-4 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all cursor-pointer">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{id}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-1 h-1 rounded-full ${isClosed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span className={`text-[9px] font-bold uppercase tracking-wider ${isClosed ? 'text-emerald-500' : 'text-amber-500'}`}>
          {status}
        </span>
      </div>
    </div>
    <h4 className="text-sm font-medium text-zinc-300 truncate">{title}</h4>
  </div>
);

const AccordionItem = ({ question }) => (
  <div className="bg-black/40 px-6 py-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-black/60 hover:border-indigo-500/20 cursor-pointer transition-all group">
    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{question}</span>
    <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:border-indigo-500 group-hover:text-indigo-500 transition-all">
      <ArrowRight size={14} className="group-hover:rotate-0 -rotate-45 transition-transform" />
    </div>
  </div>
);

export default HelpPage;