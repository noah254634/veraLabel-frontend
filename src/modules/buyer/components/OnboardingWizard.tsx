import React, { useState } from "react";
import { useBuyerStore } from "../store/buyerStore";
import { Terminal, Globe, Linkedin, Building2, Users2, ShieldQuestion, Loader2, Sparkles } from "lucide-react";

interface OnboardingWizardProps {
  onSuccess: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onSuccess }) => {
  const { submitOnboarding } = useBuyerStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [intendedUseCase, setIntendedUseCase] = useState("");

  const [error, setError] = useState<string | null>(null);

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!companyName.trim()) {
        setError("Company Name is required.");
        return false;
      }
      if (!website.trim()) {
        setError("Company Website is required.");
        return false;
      }
      if (!industry.trim()) {
        setError("Industry field is required.");
        return false;
      }
    }
    if (step === 2) {
      if (!linkedin.trim()) {
        setError("LinkedIn URL is required for verification.");
        return false;
      }
      if (!companySize) {
        setError("Please select your company size.");
        return false;
      }
    }
    if (step === 3) {
      if (!intendedUseCase.trim() || intendedUseCase.length < 20) {
        setError("Please provide a detailed use case (minimum 20 characters) so our admins can vet your profile.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError(null);
    try {
      await submitOnboarding({
        companyName,
        website,
        linkedin,
        industry,
        companySize,
        intendedUseCase,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to submit onboarding profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-[#050505] border border-zinc-900 rounded-sm p-8 md:p-12 relative overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative mb-8">
        <div className="flex items-center gap-2 text-indigo-500 mb-3">
          <Terminal size={14} className="animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">
            Security_Vetting_Protocol_v2.0
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tighter">
          Verify Your Buyer Account
        </h2>
        <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
          Provide your enterprise identification. Verified buyer profiles secure access to high-integrity data assets, payment logs, and exclusive transactions.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col gap-1">
            <div
              className={`h-[2px] transition-all duration-300 ${
                s <= step ? "bg-indigo-500" : "bg-zinc-900"
              }`}
            />
            <span
              className={`font-mono text-[9px] uppercase tracking-widest transition-colors ${
                s === step
                  ? "text-indigo-400 font-bold"
                  : s < step
                  ? "text-zinc-400"
                  : "text-zinc-700"
              }`}
            >
              Step_0{s} {s === 1 ? "Company" : s === 2 ? "Vetting" : "Verification"}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono rounded-sm flex items-start gap-2">
            <span className="font-bold">// ERROR:</span> {error}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Building2 size={14} />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-700 font-light outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Company Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Globe size={14} />
                </div>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://acme.com"
                  className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-700 font-light outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Industry Sector
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Healthcare, Finance"
                className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm py-3 px-4 text-sm text-white placeholder-zinc-700 font-light outline-none transition-all"
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Company LinkedIn URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Linkedin size={14} />
                </div>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/acme"
                  className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-700 font-light outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Company Size
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Users2 size={14} />
                </div>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-700 font-light outline-none transition-all appearance-none"
                >
                  <option value="" disabled className="bg-black text-zinc-600">Select company size</option>
                  <option value="1-10" className="bg-black text-white">1 - 10 employees</option>
                  <option value="11-50" className="bg-black text-white">11 - 50 employees</option>
                  <option value="51-200" className="bg-black text-white">51 - 200 employees</option>
                  <option value="201-1000" className="bg-black text-white">201 - 1,000 employees</option>
                  <option value="1000+" className="bg-black text-white">1,000+ employees</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Intended Use Case for Datasets
              </label>
              <div className="relative">
                <textarea
                  value={intendedUseCase}
                  onChange={(e) => setIntendedUseCase(e.target.value)}
                  rows={5}
                  placeholder="Explain why your company needs access to datasets. (e.g. We are training a LLM for customer support automation and require RLHF datasets in English...)"
                  className="w-full bg-zinc-950/80 border border-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm p-4 text-sm text-white placeholder-zinc-700 font-light outline-none transition-all resize-none"
                />
              </div>
              <p className="text-[10px] font-mono text-zinc-600">
                Minimum 20 characters. Let our admins understand your business context.
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center pt-6 border-t border-zinc-900">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={loading}
              className="px-6 py-3 border border-zinc-900 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white transition-all text-xs font-mono uppercase tracking-widest rounded-sm disabled:opacity-50"
            >
              // Previous
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-2"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-mono uppercase tracking-widest rounded-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Sparkles size={12} /> Submit Verification
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
