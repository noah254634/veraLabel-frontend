import { Link } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";

const Hero = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-6 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Top-aligned Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,#1e1b4b,transparent_70%)] opacity-40 -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-10">
            
            {/* Pill Badge - Sharper and higher */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-bold tracking-[0.3em] uppercase text-indigo-400 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The AI Data Infrastructure Platform
            </div>

            {/* Headline - Responsive scaling */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] max-w-5xl">
              Build Better AI With
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-indigo-500">
                Verified Data
              </span>
            </h1>

            {/* Subtext - Light and balanced */}
            <p className="max-w-2xl text-base md:text-xl text-zinc-400 leading-relaxed font-light">
              VeraLabel is the definitive data marketplace for rarely covered regions across Africa and emerging markets. High-fidelity datasets for teams training real-world AI.
            </p>

            {/* CTAs - Sharper Corners, Mobile First */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-6">
              <Link
                to="/signup?role=buyer"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black hover:bg-indigo-50 transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center group"
              >
                Explore Datasets
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-600" />
              </Link>

              <Link
                to="/signup?role=seller"
                className="w-full sm:w-auto px-10 py-4 border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center"
              >
                Publish a Dataset
              </Link>
            </div>

            {/* Social Proof - High-density metadata style */}
            <div className="pt-16">
              <div className="flex flex-col items-center gap-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">
                  Trusted by AI builders & Research teams
                </p>
                <div className="flex gap-8 opacity-30 grayscale contrast-125">
                   <Globe size={20} />
                   <div className="font-mono font-bold text-sm tracking-tighter italic">Linguistic_Nodes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Clean Grid */}
      <section className="py-24 px-6 relative border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <h2 className="text-4xl md:text-6xl font-medium leading-none tracking-tighter text-white">
              AI Should Work <br />
              <span className="text-zinc-700 italic">Everywhere.</span>
            </h2>
            <div className="space-y-8">
              <div className="h-1 w-12 bg-indigo-600" />
              <p className="text-lg md:text-2xl text-zinc-400 font-light leading-snug tracking-tight">
                Models trained exclusively on Western datasets fail in emerging markets. 
                VeraLabel bridges the gap, ensuring global AI reflects real-world diversity through precision-vetted data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;