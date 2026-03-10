import React from 'react';
import { ShieldCheck, Eye, Lock, Globe, Fingerprint, Zap } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-900/20 to-transparent" />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        
        {/* Protocol Header */}
        <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
              User Privacy & Data Encapsulation / v3.0
            </span>
          </div>
          <span className="font-mono text-[9px] text-zinc-700 uppercase italic">
            GDPR / Kenya Data Protection Act Compliant
          </span>
        </div>

        {/* Hero Section */}
        <section className="mb-24">
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
            Privacy as <br />
            <span className="text-zinc-600 font-normal italic">Infrastructure.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-4xl leading-snug">
            At VeraLabel.ai, privacy is not a feature; it is the <span className="text-white">foundation of our moat.</span> We employ strict data-minimization protocols to ensure your digital identity remains decoupled from your cognitive output.
          </p>
        </section>

        {/* Technical Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
          
          {/* Pillar 01: Identity Isolation */}
          <div className="bg-[#050505] p-12 group hover:bg-zinc-900/20 transition-all">
            <div className="flex items-center gap-3 mb-8">
              <Fingerprint className="text-blue-500" size={18} />
              <h3 className="text-zinc-200 font-semibold text-sm uppercase tracking-widest font-mono">
                // Identity Isolation
              </h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-light mb-6">
              We collect minimal PII (Personally Identifiable Information) required for infrastructure security and verified settlements. Your legal identity is cryptographically hashed and stored separately from your annotation session data.
            </p>
            <ul className="text-[10px] font-mono text-zinc-600 space-y-2 uppercase tracking-tighter">
              <li>• SHA-256 Identity Hashing</li>
              <li>• Decoupled Session Metadata</li>
              <li>• Zero-Linkage to Model Training</li>
            </ul>
          </div>

          {/* Pillar 02: Financial Security */}
          <div className="bg-[#050505] p-12 group hover:bg-zinc-900/20 transition-all border-l border-zinc-900">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="text-blue-500" size={18} />
              <h3 className="text-zinc-200 font-semibold text-sm uppercase tracking-widest font-mono">
                // Financial Encapsulation
              </h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-light mb-6">
              Settlements via M-Pesa and Paystack utilize secure transient tokens. Financial endpoints are encrypted at rest using AES-256 standards, ensuring your wallet details never touch our public-facing application layers.
            </p>
            <ul className="text-[10px] font-mono text-zinc-600 space-y-2 uppercase tracking-tighter">
              <li>• Tokenized Payout Architecture</li>
              <li>• End-to-End Financial Encryption</li>
              <li>• Ephemeral PII Handling</li>
            </ul>
          </div>

          {/* Pillar 03: Data Sovereignty */}
          <div className="bg-[#050505] p-12 group hover:bg-zinc-900/20 transition-all border-t border-zinc-900">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="text-blue-500" size={18} />
              <h3 className="text-zinc-200 font-semibold text-sm uppercase tracking-widest font-mono">
                // Global Compliance
              </h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-light mb-6">
              We operate in full alignment with the Kenya Data Protection Act of 2019 and global GDPR standards. Users maintain the absolute right to data portability and the "Right to be Forgotten" within our ecosystem.
            </p>
            <ul className="text-[10px] font-mono text-zinc-600 space-y-2 uppercase tracking-tighter">
              <li>• DPA 2019 Regulatory Alignment</li>
              <li>• On-Demand Data Deletion</li>
              <li>• Trans-Border Flow Security</li>
            </ul>
          </div>

          {/* Pillar 04: AI Ethics */}
          <div className="bg-[#050505] p-12 group hover:bg-zinc-900/20 transition-all border-t border-l border-zinc-900">
            <div className="flex items-center gap-3 mb-8">
              <Lock className="text-blue-500" size={18} />
              <h3 className="text-zinc-200 font-semibold text-sm uppercase tracking-widest font-mono">
                // Anonymized Training
              </h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-light mb-6">
              Human-in-the-loop contributions are anonymized before delivery to third-party AI buyers. Your cognitive output contributes to the model's intelligence without exposing the contributor's demographic origin.
            </p>
            <ul className="text-[10px] font-mono text-zinc-600 space-y-2 uppercase tracking-tighter">
              <li>• Contribution Anonymization</li>
              <li>• Blind-Review Protocols</li>
              <li>• Secure R2 Ingestion</li>
            </ul>
          </div>

        </div>

        {/* Footer Audit Tag */}
        <div className="mt-20 flex justify-between items-center border-t border-zinc-900 pt-10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
              Audit status: Verified 2026
            </span>
          </div>
          <button className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-widest underline decoration-zinc-800 underline-offset-4">
            Request Data Dossier
          </button>
        </div>
      </main>
    </div>
  );
};