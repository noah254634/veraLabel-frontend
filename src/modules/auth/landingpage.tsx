import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Shield, Zap, Cpu } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#0a2540] selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">
          Vera<span className="text-indigo-600">Label</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Products</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Solutions</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Developers</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-semibold hover:text-indigo-600">Sign in</Link>
          <Link to="/signup" className="bg-[#635bff] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#0a2540] transition-all flex items-center gap-2">
            Start now <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 pt-20 pb-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
            VeraLabel AI 2.0
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold mt-6 leading-[1.1] tracking-tight">
            Data labeling for <span className="text-indigo-600">intelligent</span> teams.
          </h1>
          <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-lg">
            VeraLabel provides the infrastructure for high-fidelity data tagging and AI training. Built for researchers, students, and next-gen startups.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/signup" className="bg-[#635bff] text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all active:scale-95">
              Get Started
            </Link>
            <button className="px-8 py-4 rounded-lg font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
        <div className="relative group">
          {/* Decorative Gradient like Stripe */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-[#0a2540] rounded-2xl p-8 shadow-2xl border border-white/10">
             {/* Mock Dashboard UI */}
             <div className="flex gap-2 mb-6">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="space-y-4">
               <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
               <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
               <div className="h-32 bg-indigo-500/20 rounded w-full border border-indigo-500/30 flex items-center justify-center">
                 <Cpu className="text-indigo-400" size={48} />
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-20">
            <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Platform Capabilities</h2>
            <p className="text-4xl font-bold mt-4">Everything you need to ship production-grade AI models.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Database className="text-indigo-600" />}
              title="Scalable Storage"
              desc="Store millions of data points with enterprise-grade encryption and 99.9% uptime."
            />
            <FeatureCard 
              icon={<Zap className="text-indigo-600" />}
              title="Lightning Fast"
              desc="Proprietary labeling tools that reduce manual effort by up to 60% using auto-tagging."
            />
            <FeatureCard 
              icon={<Shield className="text-indigo-600" />}
              title="Secure by Default"
              desc="Role-based access controls and SOC2 compliance ready for your biggest projects."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="space-y-4 group">
    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;