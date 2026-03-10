export const Mission = () => (
  <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
    {/* Top Border Accent -*/}
    <div className="h-1 w-full bg-gradient-to-r from-blue-900/20 via-blue-600/40 to-transparent" />

    <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      
      {/* Identification Header */}
      <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
            Mission Directive / 001
          </span>
        </div>
        <span className="font-mono text-[9px] text-zinc-700 uppercase hidden md:block">
          Revision 2.6.0
        </span>
      </div>

      {/* Re-Scaled Heading Section */}
      <section className="mb-24">
        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
          Inclusive <br />
          <span className="text-zinc-600">Intelligence.</span>
        </h1>
        
        {/* Adjusted Paragraph: Medium weight, refined tracking */}
        <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-3xl leading-snug">
          VeraLabel.ai is architecting the democratization of the global AI landscape. 
          Our objective is to ensure the next generation of machines understands 
          <span className="text-white border-b border-blue-600 pb-1 ml-1">every human voice.</span>
        </p>
      </section>

      {/* Technical Framework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-zinc-900">
        {[
          {
            id: "01",
            title: "Linguistic Sovereignty",
            desc: "Addressing the vacuum in Nilotic and Bantu training sets to move beyond Western-centric defaults."
          },
          {
            id: "02",
            title: "Ethical Sourcing",
            desc: "Leveraging decentralized payment protocols via Paystack for direct, fair-market capital flow to contributors."
          },
          {
            id: "03",
            title: "Ground Truth Validation",
            desc: "Deploying multi-stage HITL verification to meet the standards of global research institutions."
          }
        ].map((pillar) => (
          <div key={pillar.id} className="p-10 border-r border-b border-zinc-900 hover:bg-zinc-900/10 transition-all duration-500 first:border-l group">
            <span className="block font-mono text-zinc-700 group-hover:text-blue-600 text-[10px] mb-8 transition-colors italic">
              // Core_Objective_{pillar.id}
            </span>
            <h3 className="text-zinc-200 font-semibold text-sm mb-4 uppercase tracking-widest">{pillar.title}</h3>
            <p className="text-xs leading-relaxed text-zinc-500 font-light">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer System Tag */}
      <div className="mt-20 flex justify-end">
        <div className="px-3 py-1 border border-zinc-800 rounded-full">
           <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest">System Authenticated</span>
        </div>
      </div>
    </main>
  </div>
);