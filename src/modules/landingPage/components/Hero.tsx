import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gray-950 text-white py-2 px-6 mt-1">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm font-medium text-indigo-600 tracking-wide uppercase">
          The AI Data Infrastructure Platform
        </p>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
          Build Better AI With
          <span className="text-indigo-600"> Verified Data</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          VeraLabel is a data marketplace and annotation platform focused on
          rarely covered regions across Africa, parts of Asia, and other
          emerging markets. Built for teams training real-world AI systems that
          need diverse, high-quality datasets.
        </p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/signup?role=buyer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg font-medium"
          >
            Explore Datasets
          </Link>

          <Link
            to="/signup?role=seller"
            className="border border-gray-300 hover:border-gray-500 px-8 py-4 rounded-lg font-medium"
          >
            Publish a Dataset
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Trusted by AI builders, startups, and research teams.
        </p>
      </div>
      <section className="py-24 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            AI Should Work Everywhere.
          </h2>
          <p className="mt-6 text-gray-400 text-lg">
            Models trained only on Western datasets fail in emerging markets.
            VeraLabel ensures AI reflects real-world diversity.
          </p>
        </div>
      </section>
    </section>
  );
};

export default Hero;
