import React from "react";

const FAQPage = () => {
  const faqGroups = [
    {
      id: "01",
      category: "Regional Sovereignty",
      items: [
        {
          q: "What is VeraLabel's core mission?",
          a: "VeraLabel exists to bridge the data gap for underrepresented regions, specifically across Africa. Most global datasets are Western-centered; we provide the high-fidelity, culturally-accurate data needed to build AI that understands local dialects, Nilotic/Bantu languages, and regional nuances."
        },
        {
          q: "How do you source your data?",
          a: "Our engineers work on the ground to actively collect original datasets. We don't just wait for buyers to submit data; we curate and annotate original sets—from local language transcriptions to cultural text analysis—to ensure the African context is represented in global AI."
        }
      ]
    },
    {
      id: "02",
      category: "Technical Modalities",
      items: [
        {
          q: "What annotation services are available?",
          a: "We facilitate specialized Human-in-the-Loop (HITL) annotation across Text and Image sets, Audio transcription for local dialects, and RLHF (Reinforcement Learning from Human Feedback) to align models with regional values."
        },
        {
          q: "What is the 'Trust Score'?",
          a: "It is a systemic reputation index (0-10+) reflecting a contributor's accuracy and linguistic expertise. High scores unlock priority access to high-value sovereign datasets and specialized RLHF tasks."
        }
      ]
    },
    {
      id: "03",
      category: "Fiscal Infrastructure",
      items: [
        {
          q: "How are payments and capital secured?",
          a: "We integrate with Paystack for secure, regionalized settlement including bank transfers and mobile money. Capital is held in the VeraLabel Escrow Vault and only released upon verification of data fidelity."
        },
        {
          q: "What is a 'Sovereign' purchase?",
          a: "An Exclusive (Sovereign) purchase grants the buyer total IP transfer. Once finalized, we purge the asset from our public directories, granting the buyer unilateral market dominance over that specific cultural or linguistic data."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-sans selection:bg-blue-500/30">
      {/* 1. Top Border Accent - Matching Mission Component */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-900/20 via-blue-600/40 to-transparent" />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        
        {/* 2. Identification Header - Matching Mission Style */}
        <div className="flex items-center justify-between mb-20 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
              Technical FAQ / Query_Index
            </span>
          </div>
          <span className="font-mono text-[9px] text-zinc-700 uppercase hidden md:block">
            Ver_2.0.26_SECURE
          </span>
        </div>

        {/* 3. Heading Section */}
        <section className="mb-24">
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tighter leading-tight mb-8">
            Knowledge <br />
            <span className="text-zinc-600 italic font-normal">Architecture.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-normal tracking-tight max-w-3xl leading-snug">
            Technical insights and operational support for the 
            <span className="text-white border-b border-blue-600 pb-1 ml-1">VeraLabel Ecosystem.</span>
          </p>
        </section>

        {/* 4. FAQ Content Grid */}
        <div className="space-y-24">
          {faqGroups.map((group) => (
            <div key={group.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-zinc-900 pt-12">
              {/* Category Identifier */}
              <div className="md:col-span-4 group">
                <span className="block font-mono text-zinc-700 group-hover:text-blue-600 text-[10px] mb-2 transition-colors italic">
                  // Group_{group.id}
                </span>
                <h2 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                  {group.category}
                </h2>
              </div>

              {/* Questions/Answers */}
              <div className="md:col-span-8 space-y-16">
                {group.items.map((item, idx) => (
                  <div key={idx} className="max-w-2xl">
                    <h3 className="text-zinc-100 font-bold tracking-tight text-lg mb-4 italic">
                      {item.q}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500 border-l border-zinc-800 pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Footer System Tag - Matching Mission Style */}
        <div className="mt-32 pt-12 border-t border-zinc-900 flex justify-between items-center">
           <div className="px-3 py-1 border border-zinc-800 rounded-full">
            <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest">
              System Authenticated
            </span>
          </div>
          
          <div className="flex items-center gap-6">
             <span className="font-mono text-[9px] text-zinc-800 tracking-widest uppercase italic">
               Inclusive_Intel
             </span>
             {/* Logo matches sidebar/mission branding */}
             <div className="w-8 h-8 bg-[#050505] border border-zinc-800 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <span className="text-white font-black text-xl italic leading-none">V</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;