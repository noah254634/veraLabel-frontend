import React from 'react';
import { ShieldCheck, Eye, Database, Lock, Globe } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 text-blue-500 mb-4">
          <ShieldCheck size={32} />
          <h1 className="text-3xl font-extrabold text-white tracking-tight italic">Privacy Protocol</h1>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          At VeraLabel, your privacy is our moat. We collect only what is necessary to verify your expertise and ensure secure M-Pesa payouts. This policy explains our data handling standards as of March 2026.
        </p>
      </header>

      {/* MODULAR DATA SECTIONS */}
      <div className="grid gap-6">
        {/* Data Collection Card */}
        <div className="bg-[#161B22] border border-white/5 p-6 rounded-[32px] hover:border-blue-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Eye size={20} /></div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">What We Collect</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2 italic">
               <span className="w-1 h-1 bg-blue-500 rounded-full" /> 
               Identity: Name (Noah Khaemba) and University Status (Kibabii Uni).
            </li>
            <li className="flex items-center gap-2 italic">
               <span className="w-1 h-1 bg-blue-500 rounded-full" /> 
               Financials: Safaricom M-Pesa phone numbers for earnings transfer.
            </li>
            <li className="flex items-center gap-2 italic">
               <span className="w-1 h-1 bg-blue-500 rounded-full" /> 
               Telemetry: Work session duration and annotation accuracy metrics.
            </li>
          </ul>
        </div>

        {/* Security Card */}
        <div className="bg-[#161B22] border border-white/5 p-6 rounded-[32px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Lock size={20} /></div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Encryption & Safety</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed italic">
            All personal data is encrypted using AES-256 standards. Financial records are never stored in plain text. We utilize secure Node.js environments to process your payout requests instantly to your M-Pesa wallet.
          </p>
        </div>

        {/* Data Usage Card */}
        <div className="bg-[#161B22] border border-white/5 p-6 rounded-[32px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Database size={20} /></div>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Model Training Data</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed italic">
            Annotations you create are anonymized before being delivered to clients. Your personal identity (Noah) is never linked to the final AI training datasets provided to third parties.
          </p>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          Subject to Kenya Data Protection Act 2019
        </p>
      </footer>
    </div>
  );
};