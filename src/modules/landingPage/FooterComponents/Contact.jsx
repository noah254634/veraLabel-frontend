import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Globe, Terminal, ArrowUpRight, CheckCircle, RefreshCw } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all protocol parameters (Identity, Endpoint, and Payload) before transmitting.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate premium validation & packaging telemetry before launching email client
    setTimeout(() => {
      const subject = `VeraLabel Inquiry: ${name}`;
      const body = `Identity Name: ${name}\nCommunication Endpoint: ${email}\n\nMessage Payload:\n${message}`;
      const mailtoUrl = `mailto:support@veralabel.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.location.href = mailtoUrl;
      
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        
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

        <section className="mb-24">
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
            Initiate <br />
            <span className="text-zinc-600 font-normal italic">Correspondence.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-2xl leading-snug">
            Whether licensing regional data assets or joining our verified contributor network, our <span className="text-white underline decoration-zinc-800 underline-offset-8">technical operations team</span> is available.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-zinc-900 pt-16">
          
          <div className="lg:col-span-7 space-y-12">
            {isSuccess ? (
              <div className="bg-zinc-950/40 border border-emerald-500/20 p-8 rounded-sm animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-3 text-emerald-500 mb-4">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                    Transmission_Packet_Prepared
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-3">Protocol Initialized</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-8">
                  Your message has been packaged. Your local email client should now be open to dispatch this transmission directly to our desk at <strong className="text-white">support@veralabel.dev</strong>. If it didn't open, please click the button below.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`mailto:support@veralabel.dev?subject=VeraLabel%20Inquiry%3A%20${encodeURIComponent(name)}&body=${encodeURIComponent(`Identity Name: ${name}\nCommunication Endpoint: ${email}\n\nMessage Payload:\n${message}`)}`}
                    className="px-6 py-3.5 bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-100 transition-all text-center"
                  >
                    Open Mail Client Manually
                  </a>
                  <button 
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-[10px] font-mono uppercase tracking-widest"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-Transmit Form
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 group-focus-within:text-blue-500 transition-colors italic">
                      // Identity_Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. Dr. Aris" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-900 py-3 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800 text-zinc-200 font-light"
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 group-focus-within:text-blue-500 transition-colors italic">
                      // Email_Address
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="E.g. lead@lab.ai" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    required
                    placeholder="Specify model requirements, data modalities, or partnership details..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-900 py-3 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800 text-zinc-200 font-light resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group relative flex items-center gap-4 px-10 py-4 bg-zinc-100 text-black font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Packaging Transmission..." : "Transmit Message"}
                  <Terminal size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-12">
            
            <div className="space-y-6">
              <h3 className="text-white font-mono text-[10px] uppercase tracking-[0.3em]">Operational Nodes</h3>
              <div className="space-y-px bg-zinc-900 border border-zinc-900">
                <LocationNode city="Bungoma" region="Regional Collection Hub & Field Operations" status="Primary" />
                <LocationNode city="Nairobi" region="East Africa Commercial Core" status="Active" />
                <LocationNode city="Global" region="Distributed Expert Network" status="Distributed" />
              </div>
            </div>

            <div className="p-8 border border-zinc-900 space-y-6 bg-zinc-900/10">
              <h3 className="text-white font-medium text-lg">Direct Inquiries</h3>
              <div className="space-y-4">
                <a href="mailto:support@veralabel.dev" className="flex items-center justify-between group cursor-pointer border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-200 transition-colors">support@veralabel.dev</span>
                  </div>
                  <ArrowUpRight size={12} className="text-zinc-800 group-hover:text-white" />
                </a>
                <div className="flex items-center gap-3">
                  <MessageSquare size={14} className="text-zinc-700" />
                  <span className="text-xs text-zinc-500">Enterprise Relations Concierge</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

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