import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, Shield, Cpu, 
  Database, Play, Headphones, FileText, Code2, 
  Mail, Calculator, Info
} from "lucide-react";

interface ModalityInfo {
  id: string;
  name: string;
  baserate: number;
  description: string;
  icon: React.ReactNode;
  tier_multipliers: {
    small: number;
    medium: number;
    large: number;
    enterprise: number;
  };
}

const MODALITIES: ModalityInfo[] = [
  {
    id: "text",
    name: "Text / NLP",
    baserate: 0.60,
    description: "Text annotation, categorization, and sequence labeling.",
    icon: <FileText className="w-5 h-5 text-indigo-400" />,
    tier_multipliers: { small: 1.0, medium: 0.95, large: 0.85, enterprise: 0.75 }
  },
  {
    id: "images",
    name: "Image / Vision",
    baserate: 0.50,
    description: "Bounding boxes, segmentation, and semantic masking.",
    icon: <Database className="w-5 h-5 text-indigo-400" />,
    tier_multipliers: { small: 1.0, medium: 0.95, large: 0.85, enterprise: 0.75 }
  },
  {
    id: "audio",
    name: "Audio / Voice",
    baserate: 0.75,
    description: "Audio transcription, tagging, and linguistic curation.",
    icon: <Headphones className="w-5 h-5 text-indigo-400" />,
    tier_multipliers: { small: 1.0, medium: 0.9, large: 0.8, enterprise: 0.7 }
  },
  {
    id: "rlhf",
    name: "RLHF / Alignment",
    baserate: 1.50,
    description: "Reinforcement Learning preference alignment and scoring.",
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
    tier_multipliers: { small: 1.0, medium: 0.9, large: 0.8, enterprise: 0.7 }
  },
  {
    id: "code",
    name: "Code Curation",
    baserate: 1.25,
    description: "Developer code curation, bug-fixing runs, and annotations.",
    icon: <Code2 className="w-5 h-5 text-indigo-400" />,
    tier_multipliers: { small: 1.0, medium: 0.9, large: 0.8, enterprise: 0.7 }
  },
  {
    id: "videos",
    name: "Video / Sequence",
    baserate: 1.50,
    description: "Multi-frame tracking, temporal action segmentation.",
    icon: <Play className="w-5 h-5 text-indigo-400" />,
    tier_multipliers: { small: 1.0, medium: 0.9, large: 0.8, enterprise: 0.7 }
  }
];

const COST_MULTIPLIERS = {
  engineering: 0.20,
  platform: 0.15,
  maintenance: 0.25
};

export const Pricing = () => {
  const [selectedModality, setSelectedModality] = useState<string>("text");
  const [rowsCount, setRowsCount] = useState<number>(500);
  const [maxLabellers, setMaxLabellers] = useState<number>(1);

  const activeModality = MODALITIES.find(m => m.id === selectedModality) || MODALITIES[0];

  // Calculate volume discount tier
  const getPricingTier = (count: number) => {
    if (count <= 100) return "small";
    if (count <= 1000) return "medium";
    if (count <= 10000) return "large";
    return "enterprise";
  };

  const totalAllocations = rowsCount * maxLabellers;
  const tier = getPricingTier(totalAllocations);
  const multiplier = activeModality.tier_multipliers[tier as keyof typeof activeModality.tier_multipliers];
  const effectiveRate = activeModality.baserate * multiplier;
  
  // Calculate detailed costs (exact matching backend logic: base cost = totalAllocations * effectiveRate)
  const baseCost = totalAllocations * effectiveRate;
  const engineeringCost = baseCost * COST_MULTIPLIERS.engineering;
  const platformFee = baseCost * COST_MULTIPLIERS.platform;
  const subtotal = baseCost + engineeringCost + platformFee;
  const maintenanceCost = subtotal * COST_MULTIPLIERS.maintenance;
  const totalCost = subtotal + maintenanceCost;

  // Discount percentage
  const discountPercent = ((activeModality.baserate - effectiveRate) / activeModality.baserate * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top light hairline */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-50" />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Metric Header bar */}
        <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
              Veralabel Pricing Protocol / Transparency Node
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[9px] text-zinc-700 uppercase">
            <span>Dynamic Invoicing</span>
            <span className="text-emerald-900/60">● Escrow Vault: Secure</span>
          </div>
        </div>

        {/* Title & Platform Ethos */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-[0.9]">
              Transparent <br />
              <span className="text-zinc-500">Compensation.</span>
            </h1>
            <p className="text-lg text-zinc-300 font-light tracking-tight max-w-2xl leading-relaxed">
              VeraLabel is a specialized platform building high-fidelity dataset foundations for trustworthy, human-centered AI. We reject hidden fees and generic monthly licenses. Instead, we use transparent, task-based pricing where every cent is traceable back to verified regional annotators, pipeline operations, and decentralized consensus audit trails.
            </p>
          </div>
          <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900 p-6 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Platform Pillars
            </h2>
            <ul className="space-y-3 text-xs font-light text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">01/</span>
                <span><strong>Ethical Localized Sourcing:</strong> Fair living wages paid directly to linguistic and modality specialists in regional centers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">02/</span>
                <span><strong>Consensus Arbitration:</strong> Triple-pass worker validations that shield datasets from bias or malicious inputs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">03/</span>
                <span><strong>Edge Upload Protocol:</strong> Zero data leakage via secure, direct Cloudflare R2 uploads bypassing central memory.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Dynamic Calculator Wrapper */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Selection */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-zinc-950/20 border border-zinc-900 p-6 md:p-8">
              <h2 className="text-sm font-mono uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-500" />
                1. Select Modality
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODALITIES.map((modality) => (
                  <button
                    key={modality.id}
                    onClick={() => setSelectedModality(modality.id)}
                    className={`flex items-start gap-3 p-4 border text-left transition-all duration-300 ${
                      selectedModality === modality.id
                        ? "border-indigo-500/60 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                        : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800"
                    }`}
                  >
                    <div className="p-2 bg-zinc-950 border border-zinc-900 rounded shrink-0">
                      {modality.icon}
                    </div>
                    <div>
                      <h3 className="text-white text-xs font-mono uppercase font-bold tracking-tight">
                        {modality.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-light mt-1">
                        Base: ${modality.baserate.toFixed(2)}/task
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950/20 border border-zinc-900 p-6 md:p-8 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-500" />
                    2. Dataset Scale (Tasks/Rows)
                  </h2>
                  <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded">
                    {rowsCount.toLocaleString()} records
                  </span>
                </div>

                <div className="space-y-4">
                  <input
                    type="range"
                    min="10"
                    max="50000"
                    step="10"
                    value={rowsCount}
                    onChange={(e) => setRowsCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-600 font-mono">Custom Input:</span>
                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      value={rowsCount}
                      onChange={(e) => setRowsCount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="bg-zinc-950 border border-zinc-900 rounded px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none w-32"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900/60">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    3. Overlap (Labellers per Task)
                  </h2>
                  <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded">
                    {maxLabellers} annotator{maxLabellers > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMaxLabellers(num)}
                        className={`px-4 py-2 border text-xs font-mono transition-all duration-200 ${
                          maxLabellers === num
                            ? "border-indigo-500 bg-indigo-500/10 text-white font-bold"
                            : "border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800"
                        }`}
                      >
                        {num === 1 ? "1 (Standard)" : `${num} Labellers`}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-light leading-normal">
                    Specifies consensus redundancy. Multiple annotators label the same task independently, and differences are audited by the consensus board.
                  </p>
                </div>
              </div>

              {/* Volume Discount Tiers Indicators */}
              <div className="border-t border-zinc-900 pt-6">
                <div className="flex justify-between text-[11px] mb-4 font-mono">
                  <span className="text-zinc-500">Total Billable Submissions:</span>
                  <span className="text-white font-bold">{totalAllocations.toLocaleString()} (Rows × Overlap)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-[9px] text-center">
                  <div className={`p-2 border ${tier === "small" ? "border-indigo-500/50 bg-indigo-500/5 text-white" : "border-zinc-900 text-zinc-600"}`}>
                    <div>≤ 100</div>
                    <div className="mt-1">Small (1.0x)</div>
                  </div>
                  <div className={`p-2 border ${tier === "medium" ? "border-indigo-500/50 bg-indigo-500/5 text-white" : "border-zinc-900 text-zinc-600"}`}>
                    <div>101-1k</div>
                    <div className="mt-1">Medium</div>
                  </div>
                  <div className={`p-2 border ${tier === "large" ? "border-indigo-500/50 bg-indigo-500/5 text-white" : "border-zinc-900 text-zinc-600"}`}>
                    <div>1k-10k</div>
                    <div className="mt-1">Large</div>
                  </div>
                  <div className={`p-2 border ${tier === "enterprise" ? "border-indigo-500/50 bg-indigo-500/5 text-white" : "border-zinc-900 text-zinc-600"}`}>
                    <div>&gt; 10k</div>
                    <div className="mt-1">Ent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Breakdown Node */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-950/40 border border-indigo-500/20 p-8 h-full flex flex-col justify-between relative overflow-hidden group shadow-[0_0_30px_rgba(99,102,241,0.02)]">
              {/* Corner accent glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full" />
              
              <div>
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                  <h3 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
                    // Invoice Estimator
                  </h3>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-normal">
                    Currency: USD
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Modality Base Rate</span>
                    <span className="font-mono text-zinc-300">${activeModality.baserate.toFixed(2)} / task</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Volume Discount ({tier})</span>
                    <span className="font-mono text-emerald-400">
                      {parseInt(discountPercent) > 0 ? `-${discountPercent}%` : "0%"} (Multiplier: {multiplier}x)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Effective Unit Rate</span>
                    <span className="font-mono text-white">${effectiveRate.toFixed(4)} / task</span>
                  </div>
                  
                  <div className="h-px bg-zinc-900 my-2" />

                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>Base Annotator Cost</span>
                    <span className="font-mono">${baseCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal font-light">
                    Rewarded directly to annotators completing task batches.
                  </p>

                  <div className="h-px bg-zinc-900 my-2" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        Engineering Surcharge <span className="text-[9px] text-zinc-600 font-mono">(20%)</span>
                      </span>
                      <span className="font-mono text-zinc-300">${engineeringCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        Platform Gateway Fee <span className="text-[9px] text-zinc-600 font-mono">(15%)</span>
                      </span>
                      <span className="font-mono text-zinc-300">${platformFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        Operations Maintenance <span className="text-[9px] text-zinc-600 font-mono">(25% of sub)</span>
                      </span>
                      <span className="font-mono text-zinc-300">${maintenanceCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-t border-zinc-900 pt-6 mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold">Total Estimated Cost</span>
                    <span className="text-3xl font-bold text-white font-mono tracking-tight">
                      ${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 font-mono uppercase">
                    <Info className="w-3 h-3 text-indigo-500" />
                    <span>Calculations mirror live platform coordinator parameters</span>
                  </div>
                </div>

                <a
                  href="mailto:support@veralabel.dev?subject=Enterprise Custom Dataset Request"
                  className="w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest text-center transition-all duration-300 flex items-center justify-center gap-2 hover:bg-zinc-100"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Initiate Custom Pilot
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown Info / Platform Mechanics */}
        <section className="mb-20 border border-zinc-900 bg-zinc-950/20 p-8 md:p-12">
          <div className="mb-10 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-500">// Operation Protocol Breakdown</h2>
            <p className="text-2xl text-white font-semibold tracking-tight">How your payment supports high-fidelity AI curation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Annotator Compensation
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                The **Base Annotator Cost** goes 100% to verified annotators in specialized regional centers. We use algorithmic work-validation metrics to guarantee they receive a fair, sustainable living wage for dialect alignment and data enrichment.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
                Engineering & Platform Gateways
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Our FastAPI dataset splitters partition zip packages, media tracks, and text streams with millisecond latency. The **Engineering Surcharge** and **Platform Fee** fund edge processing pipelines, cryptographic escrow ledgers, and secure CDN integrations.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                Consensus Auditing Boards
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We calculate continuous **Trust Scores** for annotators. The **Operations Maintenance** covers decentralized review queues, consensus arbitration by senior nodes, and monthly compliance audits to safeguard dataset integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Localized / Contact Section */}
        <section className="p-8 md:p-12 border border-zinc-900 bg-zinc-950/20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          <h2 className="text-white font-medium text-xl mb-4 tracking-tight">Need a custom localized pilot?</h2>
          <p className="text-zinc-500 text-sm mb-8 max-w-xl mx-auto leading-relaxed font-light">
            We partner with corporate researchers, NLP developers, and academic institutions to orchestrate tailored dialect collections. Contact our operations desk directly to coordinate custom requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@veralabel.dev"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.2em] hover:border-indigo-500/50"
            >
              <Mail className="w-3.5 h-3.5" />
              support@veralabel.dev
            </a>
            <Link
              to="/contact"
              className="inline-flex px-8 py-3.5 border border-zinc-800 text-zinc-500 hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.2em] hover:border-indigo-500/50 hover:bg-indigo-500/5"
            >
              Contact Operations Desk
            </Link>
          </div>
        </section>

        {/* Footer info line */}
        <div className="mt-20 pt-8 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-700 uppercase">
          <span>SECURE SEC-P256K1 ESCROW</span>
          <span>Bungoma Operations V1.0</span>
        </div>
      </main>
    </div>
  );
};
