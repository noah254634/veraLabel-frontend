import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Subtle Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium tracking-[0.2em] uppercase text-indigo-400 animate-fade-in">
              The AI Data Infrastructure Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
              Build Better AI With
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-500">
                Verified Data
              </span>
            </h1>

            {/* Subtext */}
            <p className="max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed font-light">
              VeraLabel is the definitive data marketplace for rarely covered regions across Africa and emerging markets. High-fidelity datasets for teams training real-world AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
              <Link
                to="/signup?role=buyer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-indigo-50 transition-all duration-300 rounded-full font-semibold text-sm flex items-center justify-center group"
              >
                Explore Datasets
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/signup?role=seller"
                className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:bg-white/5 transition-all duration-300 rounded-full font-semibold text-sm flex items-center justify-center"
              >
                Publish a Dataset
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">
                Trusted by AI builders & Research teams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 relative border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              AI Should Work <br className="hidden md:block" />
              <span className="text-gray-500">Everywhere.</span>
            </h2>
            <div className="space-y-6">
              <div className="h-px w-12 bg-indigo-500" />
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
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