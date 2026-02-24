import React, { useState } from 'react';
import { 
  Search, BookOpen, MessageSquare, LifeBuoy, 
  ExternalLink, PlayCircle, ShieldQuestion, 
  FileText, ArrowRight, Sparkles, Clock, CheckCircle2 
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* --- HERO SEARCH SECTION --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-12 text-center text-white shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-indigo-400/30">
            <Sparkles size={14} className="text-amber-300" />
            VeraLabel Intelligent Support
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">How can we help you today?</h1>
          
          <div className="relative mt-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-300" size={24} />
            <input 
              type="text" 
              placeholder="Search for guides, API docs, or dispute resolution..." 
              className="w-full bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl py-5 pl-16 pr-6 text-lg outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-indigo-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- QUICK NAVIGATION GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HelpCard 
          icon={<BookOpen className="text-blue-500" />} 
          title="Documentation" 
          desc="Deep dive into our labeling tools and API integration."
          link="View Docs"
        />
        <HelpCard 
          icon={<PlayCircle className="text-indigo-500" />} 
          title="Video Tutorials" 
          desc="Master the annotation interface in under 5 minutes."
          link="Watch Now"
        />
        <HelpCard 
          icon={<ShieldQuestion className="text-emerald-500" />} 
          title="Dispute Guide" 
          desc="Learn how our quality consensus and arbitration works."
          link="Read Policy"
        />
      </div>

      {/* --- MAIN CONTENT AREA: TWO COLUMN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: TRENDING TOPICS & FAQ */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Popular Resources</h2>
            <button className="text-indigo-600 font-bold text-sm hover:underline">See all articles</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ArticleItem title="Setting up your Buyer Wallet" time="3 min read" />
            <ArticleItem title="Understanding IoU Accuracy Scores" time="6 min read" />
            <ArticleItem title="Annotator Payout Schedule (2026)" time="4 min read" />
            <ArticleItem title="Optimizing LiDAR Datasets" time="10 min read" />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <LifeBuoy className="text-indigo-600" size={20} /> Common Troubleshooting
            </h3>
            <div className="space-y-4">
              <AccordionItem question="Why is my batch stuck in 'Pending Review'?" />
              <AccordionItem question="How to export datasets in YOLOv8 format?" />
              <AccordionItem question="What happens if a dispute is rejected?" />
            </div>
          </div>
        </div>

        {/* RIGHT: TICKET STATUS & DIRECT CONTACT */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Your Recent Tickets</h3>
            <div className="space-y-4">
              <TicketItem id="#VL-9021" status="In Progress" title="API Webhook Failure" />
              <TicketItem id="#VL-8842" status="Resolved" title="Withdrawal Delay" isClosed />
            </div>
            <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              Create New Ticket
            </button>
          </div>

          <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-slate-900">Live Support</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">Average response time: <b>14 minutes</b></p>
            <button className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all">
                Chat with an Agent
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- MINI COMPONENTS ---

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  link: string;
}

const HelpCard = ({ icon, title, desc, link }: HelpCardProps) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
    <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
      {link} <ArrowRight size={16} />
    </button>
  </div>
);

interface ArticleItemProps {
  title: string;
  time: string;
}

const ArticleItem = ({ title, time }: ArticleItemProps) => (
  <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 cursor-pointer transition-all shadow-sm">
    <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-50 rounded-lg"><FileText size={18} className="text-slate-400" /></div>
        <div>
            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
            <span className="text-[10px] text-slate-400 uppercase font-bold">{time}</span>
        </div>
    </div>
    <ExternalLink size={14} className="text-slate-200" />
  </div>
);

interface TicketItemProps {
  id: string;
  status: string;
  title: string;
  isClosed?: boolean;
}

const TicketItem = ({ id, status, title, isClosed }: TicketItemProps) => (
  <div className="flex flex-col gap-1 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
        <span className="text-slate-400">{id}</span>
        <span className={isClosed ? 'text-emerald-500' : 'text-amber-500'}>{status}</span>
    </div>
    <h4 className="text-xs font-bold text-slate-700 truncate">{title}</h4>
  </div>
);

interface AccordionItemProps {
  question: string;
}

const AccordionItem = ({ question }: AccordionItemProps) => (
    <div className="bg-white px-6 py-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 cursor-pointer transition-all group">
        <span className="text-sm font-bold text-slate-700">{question}</span>
        <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600">+</div>
    </div>
)

export default HelpPage;