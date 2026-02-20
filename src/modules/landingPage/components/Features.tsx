const features = [
  {
    title: "Verified Data Quality",
    description:
      "Structured annotation workflows and validation pipelines ensure reliable training data.",
  },
  {
    title: "AI-Assisted Labeling",
    description:
      "Accelerate dataset creation with intelligent pre-labeling tools.",
  },
  {
    title: "Secure Dataset Hosting",
    description:
      "Enterprise-grade infrastructure for managing and distributing AI datasets.",
  },
  {
    title: "Marketplace Access",
    description:
      "Buy and sell curated datasets for production AI systems.",
  },
];

const Features = () => {
  return (
    <section className="bg-gray-950 text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 ">
          {features.map((feature, index) => (
            <div key={index} className="border-gray-800 border rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
