export const Terms = () => (
  <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30 font-light">
    <div className="h-1 w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

    <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
            Enterprise Governance / Master Service Agreement
          </span>
        </div>
        <span className="font-mono text-[9px] text-zinc-700 uppercase italic">
          v4.0 Build // 2026
        </span>
      </div>

      <section className="mb-24">
        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
          The Enterprise <br />
          <span className="text-zinc-600 font-normal italic">Protocol.</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-4xl leading-snug">
          VeraLabel.ai is an institutional-grade data marketplace. By utilizing
          this infrastructure, you agree to a{" "}
          <span className="text-white">
            secure, quality-contingent engagement model.
          </span>
        </p>
      </section>

      {/* Enterprise Sections */}
      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-zinc-900 pt-12">
          <div className="md:col-span-4 text-white font-mono text-[10px] uppercase tracking-widest">
            01 / Escrow & Quality Assurance
          </div>
          <div className="md:col-span-8 text-sm leading-relaxed">
            All service requests require a 100% upfront deposit into the{" "}
            <strong>VeraLabel Escrow Vault</strong>. Funds are released only
            upon verification of data fidelity. If a dataset fails to meet the
            contracted accuracy threshold, VeraLabel reserves the right to
            withhold payment to contributors and facilitate remediation or
            refund.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-zinc-900 pt-12">
          <div className="md:col-span-4 text-white font-mono text-[10px] uppercase tracking-widest">
            02 / Ownership Tiers
          </div>
          <div className="md:col-span-8 text-sm leading-relaxed">
            <p className="mb-4 font-medium text-zinc-300 italic">
              Data assets are categorized by two licensing tracks:
            </p>
            <ul className="space-y-4">
              <li>
                <span className="text-blue-500 font-bold tracking-tight">
                  Non-Exclusive:
                </span>{" "}
                Perpetual training rights for the buyer; the asset remains
                available for secondary marketplace acquisition.
              </li>
              <li>
                <span className="text-white font-bold tracking-tight">
                  Exclusive (Sovereign):
                </span>{" "}
                Total IP transfer. Upon final settlement, VeraLabel will purge
                the asset from all public directories, granting the buyer{" "}
                <strong>unilateral market dominance</strong> over that specific
                dataset.
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-zinc-900 pt-12">
          <div className="md:col-span-4 text-white font-mono text-[10px] uppercase tracking-widest">
            03 / Platform Integrity
          </div>
          <div className="md:col-span-8 text-sm leading-relaxed">
            VeraLabel is not a broker; it is a quality-managed infrastructure.
            We do not charge listing fees. We retain a fixed{" "}
            <strong>Infrastructure & QA Fee</strong> from the final Escrow
            release to cover secure R2 storage, malware detonation, and
            consensus-based validation labor.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-zinc-900 pt-12">
          <div className="md:col-span-4 text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold">
            04 / Anti-Commercialization & Resale
          </div>
          <div className="md:col-span-8 text-sm leading-relaxed">
            <p className="mb-4 text-zinc-300 font-medium italic underline decoration-red-900/40">
              The acquisition of a dataset license does not constitute a
              transfer of redistributive rights.
            </p>
            <ul className="space-y-4">
              <li>
                <span className="text-white font-bold tracking-tight">
                  Prohibited Resale:
                </span>
                The Buyer is strictly prohibited from reselling, sub-licensing,
                or redistributing the raw dataset, in part or in whole, on any
                third-party marketplace or independent platform.
              </li>
              <li>
                <span className="text-white font-bold tracking-tight">
                  Derivative Works:
                </span>
                While the Buyer may use the data to train proprietary AI models,
                the
                <strong> raw structural assets</strong> remain the intellectual
                property of the original creator and VeraLabel.ai.
              </li>
              <li>
                <span className="text-red-500 font-bold tracking-tight">
                  Enforcement:
                </span>
                Any attempt to commercialize VeraLabel datasets as a standalone
                product will result in the immediate{" "}
                <strong>revocation of the training license</strong>, systemic
                blacklisting, and legal pursuit for intellectual property theft.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-12 border-t border-zinc-900 flex justify-between items-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-700 italic">
          Zero-Tolerance for system gaming or malicious payloads.
        </p>
        <span className="h-6 w-6 bg-blue-600 rounded-sm italic flex items-center justify-center text-white font-bold text-[10px]">
          V
        </span>
      </div>
    </main>
  </div>
);
