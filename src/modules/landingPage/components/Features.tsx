const features = [
  {
    title: "Verified Data Quality",
    description:
      "Structured annotation workflows and validation pipelines ensure reliable training data for mission-critical models.",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "AI-Assisted Labeling",
    description:
      "Accelerate dataset creation with intelligent pre-labeling tools that reduce manual overhead by up to 70%.",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Secure Dataset Hosting",
    description:
      "Enterprise-grade infrastructure for managing and distributing AI datasets with end-to-end encryption.",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Marketplace Access",
    description:
      "Access an exclusive ecosystem to buy and sell curated datasets specifically for production AI systems.",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <section className="bg-black text-white py-24 px-6 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="mb-20 space-y-4">
          <h2 className="text-sm font-medium tracking-[0.3em] uppercase text-indigo-500">
            Infrastructure
          </h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
            Precision tools for the <span className="text-gray-500">modern AI lifecycle.</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-2xl">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-black p-8 md:p-10 transition-colors duration-500 hover:bg-zinc-900/50 flex flex-col h-full"
            >
              <div className="mb-8 p-3 w-fit rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-500/50 transition-colors duration-500">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">
                {feature.description}
              </p>
              
              <div className="mt-auto pt-8">
                <div className="h-px w-0 group-hover:w-full bg-indigo-500 transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;