export const DataPolicy = () => (
  <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
    <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-900/20 to-transparent" />

    <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      
      {/* Security Header */}
      <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
            System Security & Integrity Protocol / v2.1
          </span>
        </div>
        <span className="font-mono text-[9px] text-zinc-700 uppercase italic">
          Zero-Tolerance Enforcement Active
        </span>
      </div>

      {/* Hero Section */}
      <section className="mb-24">
        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
          Integrity & <br />
          <span className="text-red-600 font-normal italic">Enforcement.</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-4xl leading-snug">
          VeraLabel.ai operates a <span className="text-white">Hardened Ingestion Pipeline.</span> We maintain absolute authority over the quality and safety of data entering our ecosystem.
        </p>
      </section>

      {/* Security & Anti-Gaming Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
        
        {/* Anti-Malware Pillar */}
        <div className="bg-[#050505] p-12">
          <h3 className="text-red-500 font-mono text-[10px] mb-6 tracking-widest uppercase font-bold">
            // 01. Malware & Payload Neutralization
          </h3>
          <p className="text-zinc-200 font-medium mb-4 italic">Zero-Trust Ingestion.</p>
          <div className="text-sm leading-relaxed text-zinc-500 font-light space-y-4">
            <p>
              Every submission undergoes multi-layer heuristic scanning. Obfuscated executable code, steganographic payloads, or unauthorized scripts result in an <strong>immediate and permanent systemic ban</strong>.
            </p>
            <p className="text-zinc-600 border-l border-zinc-800 pl-4 italic">
              VeraLabel.ai reserves the right to submit all malicious telemetry, IP logs, and identity hashes to global law enforcement agencies (DCI/Interpol).
            </p>
          </div>
        </div>

        {/* Anti-Gaming Pillar */}
        <div className="bg-[#050505] p-12">
          <h3 className="text-red-500 font-mono text-[10px] mb-6 tracking-widest uppercase font-bold">
            // 02. Algorithmic Integrity & Anti-Gaming
          </h3>
          <p className="text-zinc-200 font-medium mb-4 italic">Cognitive Labor Verification.</p>
          <div className="text-sm leading-relaxed text-zinc-500 font-light space-y-4">
            <p>
              We utilize <strong>Stochastic Consensus</strong> and "Golden Tasks" to identify low-fidelity annotation. Users attempting to bypass human-in-the-loop requirements via bots or random input will be flagged.
            </p>
            <p className="bg-zinc-900/50 p-3 rounded-sm text-zinc-400">
              Violation results in the immediate <strong>slashing of all pending balances</strong> and account termination.
            </p>
          </div>
        </div>

        {/* Identity & Legal Pillar */}
        <div className="bg-[#050505] p-12 border-t border-zinc-900">
          <h3 className="text-zinc-400 font-mono text-[10px] mb-6 tracking-widest uppercase font-bold">
            // 03. Identity Fingerprinting
          </h3>
          <p className="text-zinc-200 font-medium mb-4 italic">Financial Accountability.</p>
          <p className="text-sm leading-relaxed text-zinc-500 font-light">
            Identity is linked to financial endpoints (Paystack). A permanent ban extends to the individual's legal identity and banking credentials. Submitting malicious data is treated as a <strong>criminal breach of infrastructure</strong>.
          </p>
        </div>

        {/* Data Ownership Pillar */}
        <div className="bg-[#050505] p-12 border-t border-zinc-900">
          <h3 className="text-zinc-400 font-mono text-[10px] mb-6 tracking-widest uppercase font-bold">
            // 04. Forensics & Audit Trails
          </h3>
          <p className="text-zinc-200 font-medium mb-4 italic">Clean Chain of Custody.</p>
          <p className="text-sm leading-relaxed text-zinc-500 font-light">
            Every file on the VeraLabel marketplace is cryptographically signed and audit-trailed. We provide buyers with a <strong>Security Indemnity Guarantee</strong>, confirming all assets have cleared our malware-detonation sandbox.
          </p>
        </div>

      </div>

      {/* Footer Legal Warning */}
      <div className="mt-24 border border-red-900/30 bg-red-950/5 p-8 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-700 mb-2">
          Legal Notice: 18 U.S.C. § 1030 / Computer Misuse Act Compliance
        </p>
        <p className="text-xs text-zinc-600 max-w-2xl mx-auto">
          Attempting to submit malicious code to VeraLabel.ai infrastructure is a criminal offense. We monitor all ingestion points with high-fidelity logging.
        </p>
      </div>
    </main>
  </div>
);