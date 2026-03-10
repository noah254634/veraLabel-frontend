export const Careers = () => (
  <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
    <div className="h-1 w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

    <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      
      {/* Header / Identification */}
      <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
            Human Capital / Talent Acquisition
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[9px] text-zinc-700 uppercase">
          <span>Uptime: 99.9%</span>
          <span className="text-green-900/50">● Latency: 24ms</span>
        </div>
      </div>

      <section className="mb-24">
        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
          The Future of <br />
          <span className="text-zinc-600 font-normal italic">Contextual Intelligence.</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-3xl leading-snug">
          VeraLabel.ai is seeking architects, linguists, and engineers to define the 
          <span className="text-white"> parameters of machine understanding.</span>
        </p>
      </section>

      {/* Career Table - Precise & High-Density */}
      <div className="border-t border-zinc-900">
        {[
          { id: "V-01", role: "Data Annotator", type: "Decentralized", domain: "NLP / Linguistics" },
          { id: "V-02", role: "Full-Stack Architect", type: "Hybrid", domain: "Node.js / R2 Pipelines" },
          { id: "V-03", role: "QA Validation Specialist", type: "Remote", domain: "Python / HITL" }
        ].map((job) => (
          <div key={job.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-zinc-900 hover:bg-zinc-900/10 transition-all px-4 cursor-pointer">
            <div className="md:col-span-1 font-mono text-[10px] text-zinc-700 group-hover:text-blue-600 transition-colors">
              [{job.id}]
            </div>
            <div className="md:col-span-6">
              <h3 className="text-zinc-200 font-semibold text-lg tracking-tight group-hover:translate-x-1 transition-transform">
                {job.role}
              </h3>
            </div>
            <div className="md:col-span-3 flex items-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
                {job.domain}
              </span>
            </div>
            <div className="md:col-span-2 text-right">
              <span className="text-[10px] uppercase tracking-widest text-zinc-700 font-mono italic">
                {job.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Section */}
      <div className="mt-32 pt-16 border-t border-zinc-900 text-center">
        <h2 className="text-white font-medium text-xl mb-4 tracking-tight">Unsolicited Inquiries</h2>
        <p className="text-zinc-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          We prioritize specialists from Kibabii and global research networks. 
          If your expertise isn't listed, submit a technical dossier.
        </p>
        <button className="group relative px-8 py-3 bg-transparent border border-zinc-800 text-zinc-400 hover:text-white transition-all overflow-hidden">
          <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em]">Submit Dossier</span>
          <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

    </main>
  </div>
);