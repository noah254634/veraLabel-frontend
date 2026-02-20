import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="bg-gray-950 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Start Building Better AI Today
        </h2>

        <p className="mt-4 text-lg text-indigo-100">
          Join developers, startups, and research teams building the future
          with high-quality training data.
        </p>

        <Link
          to="/signup"
          className="inline-block mt-8 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Create Your Account
        </Link>
      </div>
    </section>
  );
};

export default CTA;
