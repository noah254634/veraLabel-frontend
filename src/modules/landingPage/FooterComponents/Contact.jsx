import React from 'react';
import { Mail, MessageSquare, MapPin, Globe, Terminal, ArrowUpRight } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        
        {/* Header / Identification */}
        <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
              Communication Protocol / Direct Interface
            </span>
          </div>
          <span className="font-mono text-[9px] text-zinc-700 uppercase italic">
            Global Response Time: &lt; 6h
          </span>
        </div>

        {/* Hero Section */}
        <section className="mb-24">
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
            Initiate <br />
            <span className="text-zinc-600 font-normal italic">Correspondence.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-2xl leading-snug">
            Whether you are acquiring linguistic assets or joining our decentralized 
            contributor network, our <span className="text-white underline decoration-zinc-800 underline-offset-8">technical leads</span> are standing by.
          </p>
        </section>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-zinc-900 pt-16">
          
          {/* LEFT: THE FORM (Raw & Minimalist) */}
          <div className="lg:col-span-7 space-y-12">
            <form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 group-focus-within:text-blue-500 transition-colors italic">
                    // Identity_Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.g. Dr. Aris" 
                    className="w-full bg-transparent border-b border-zinc-900 py-3 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800 text-zinc-200 font-light"
                  />
                </div>
                <div className="group space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 group-focus-within:text-blue-500 transition-colors italic">
                    // Communication_Endpoint
                  </label>
                  <input 
                    type="email" 
                    placeholder="E.g. lead@lab.ai" 
                    className="w-full bg-transparent border-b border-zinc-900 py-3 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800 text-zinc-200 font-light"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 group-focus-within:text-blue-500 transition-colors italic">
                  // Message_Payload
                </label>
                <textarea 
                  rows="4" 
                  placeholder="Describe your dataset requirements or inquiry..." 
                  className="w-full bg-transparent border-b border-zinc-900 py-3 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800 text-zinc-200 font-light resize-none"
                />
              </div>

              <button className="group relative flex items-center gap-4 px-10 py-4 bg-zinc-100 text-black font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all">
                Transmit Message
                <Terminal size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* RIGHT: SYSTEM ENDPOINTS */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Location Nodes */}
            <div className="space-y-6">
              <h3 className="text-white font-mono text-[10px] uppercase tracking-[0.3em]">Operational Nodes</h3>
              <div className="space-y-px bg-zinc-900 border border-zinc-900">
                <LocationNode city="Bungoma" region="Western Ops" status="Primary" />
                <LocationNode city="Nairobi" region="Commercial Core" status="Active" />
                <LocationNode city="Global" region="Decentralized Network" status="Distributed" />
              </div>
            </div>

            {/* Direct Connect */}
            <div className="p-8 border border-zinc-900 space-y-6 bg-zinc-900/10">
              <h3 className="text-white font-medium text-lg">Direct Inquiries</h3>
              <div className="space-y-4">
                <a href="mailto:ops@veralabel.ai" className="flex items-center justify-between group cursor-pointer border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-200 transition-colors">ops@veralabel.ai</span>
                  </div>
                  <ArrowUpRight size={12} className="text-zinc-800 group-hover:text-white" />
                </a>
                <div className="flex items-center gap-3">
                  <MessageSquare size={14} className="text-zinc-700" />
                  <span className="text-xs text-zinc-500">Live Concierge (Support Center)</span>
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

const LocationNode = ({ city, region, status }) => (
  <div className="bg-[#050505] p-6 flex justify-between items-center group">
    <div>
      <h4 className="text-zinc-200 text-sm font-semibold tracking-tight uppercase">{city}</h4>
      <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-1">{region}</p>
    </div>
    <div className="text-right">
      <span className="text-[8px] font-mono text-blue-600 uppercase border border-blue-900/30 px-2 py-0.5 rounded-sm">
        {status}
      </span>
    </div>
  </div>
);