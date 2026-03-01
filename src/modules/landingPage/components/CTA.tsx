import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="relative bg-black py-24 px-6 overflow-hidden border-t border-white/5">
      {/* Visual Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Ready to bridge the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-100 italic">
            global data gap?
          </span>
        </h2>

        <p className="mt-8 text-base md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          Join the elite teams building inclusive, real-world AI systems with 
          high-fidelity datasets from emerging markets.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6">
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Your Account
            <svg 
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">
            Get started in under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;