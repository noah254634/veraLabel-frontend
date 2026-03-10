export const About = () => (
  <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-blue-500/30 selection:text-blue-200">
    {/* Subtle Glow Effect */}
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

    <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      {/* Breadcrumb / Label */}
      <div className="flex items-center gap-3 mb-12">
        <span className="h-px w-8 bg-blue-600" />
        <span className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
          Platform Genesis
        </span>
      </div>

      {/* Main Heading */}
      <section className="mb-24">
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-10 leading-[0.9]">
          The Ground <br /> 
          <span className="text-zinc-500">Truth.</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-zinc-200 leading-tight max-w-3xl font-light tracking-tight">
          VeraLabel.ai was engineered to rectify a critical failure in the global AI pipeline: 
          <span className="text-white font-medium"> Data Asymmetry.</span> 
        </p>
        <p className="mt-6 text-lg text-zinc-500 max-w-2xl leading-relaxed">
          While the industry scales computation, the underlying datasets remain culturally monolithic, 
          leaving billions of edge cases—and cultures—unmapped in the race for AGI.
        </p>
      </section>

      {/* The Core Thesis Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20 border-y border-zinc-900">
        <div className="md:col-span-5">
          <h2 className="text-white text-xs font-mono uppercase tracking-widest sticky top-32">
            The Hypothesis
          </h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-2xl text-zinc-300 font-light leading-snug mb-8">
            "Will the machines of tomorrow understand the dialect of Kisumu?"
          </p>
          <div className="space-y-6 text-zinc-500 leading-relaxed">
            <p>
              Our founder, <span className="text-zinc-200 font-medium">Noah Khaemba</span>, 
              identified this systemic blind spot while architecting solutions for global AI leaders. 
              VeraLabel serves as the <span className="text-blue-400">Linguistic Bridge</span>.
            </p>
            <p>
              We interface high-fidelity global standards with the nuanced, localized intuition of 
              African linguistic ecosystems. We don’t just label data; we encode cultural context into intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Technical & Economic Columns */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-24">
        <div className="group">
          <div className="h-px w-full bg-zinc-900 group-hover:bg-blue-900/50 transition-colors mb-8" />
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
            Infrastructure Authority
          </h3>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Utilizing a high-concurrency <span className="text-zinc-300">Node.js and Cloudflare R2 </span> 
            stack, we deploy enterprise-grade data buckets that support the training requirements 
            of the world’s most sophisticated Large Language Models (LLMs).
          </p>
        </div>

        <div className="group">
          <div className="h-px w-full bg-zinc-900 group-hover:bg-blue-900/50 transition-colors mb-8" />
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
            Economic Orchestration
          </h3>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Strategically headquartered in <span className="text-zinc-300">Bungoma, Kenya</span>. 
            We have engineered a frictionless cross-border settlement engine via Paystack, 
            converting global USD capital into local liquidity for our decentralized 
            human-in-the-loop (HITL) workforce.
          </p>
        </div>
      </section>
    </main>
  </div>
);