import { useState } from "react";
import {
  MapPin,
  ChevronRight
} from "lucide-react";
import type { LabellerProfile } from "../types/types";
import { ExperienceProfiling } from "./ExpereinceProfile";

export const LabellerProfileForm = ({
  onComplete,
}: {
  onComplete: (data: LabellerProfile) => void;
}) => {
  const [formStep, setFormStep] = useState(1);
  const [profile, setProfile] = useState<Partial<LabellerProfile>>({
    tier: "Trainee",
    isOnboarded: false,
    annotationExperience: { hasExperience: false },
  });

  const handleNext = () => {
    if (formStep < 3) setFormStep(formStep + 1);
    else onComplete(profile as LabellerProfile);
  };

  const progress = (formStep / 3) * 100;

  return (
    <div className="flex flex-col h-full max-h-full animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-2">
           <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
             Step {formStep} of 3
           </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {
            formStep === 1 ? "Basic Information" :
            formStep === 2 ? "Location Details" :
            "Experience & Skills"
          }
        </h2>
        <p className="text-zinc-400 mt-2 text-sm leading-relaxed max-w-lg">
          {
            formStep === 1 ? "We collect this to ensure diversity and compliance across our global workforce." :
            formStep === 2 ? "Used to route localized datasets and ensure we can process your payouts via your preferred local methods." :
            "Detailing your past annotation experience helps us unlock higher-paying, specialized tasks for you."
          }
        </p>
        
        <div className="mt-6 relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
           <div 
             className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-500 ease-in-out"
             style={{ width: `${progress}%` }}
           />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-thin scrollbar-thumb-indigo-600/20 hover:scrollbar-thumb-indigo-600/40 space-y-6 relative py-2">
        {formStep === 1 && (
          <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="group relative">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block ml-1 group-focus-within:text-indigo-400 transition-colors">
                Gender
              </label>
              <div className="relative">
                <select
                  className="w-full bg-[#0a0a0c] border border-white/5 hover:border-white/10 rounded-2xl p-5 text-white focus:border-indigo-500/50 transition-all outline-none appearance-none cursor-pointer text-sm font-semibold"
                  onChange={(e) =>
                    setProfile(prev => ({ ...prev, gender: e.target.value as any }))
                  }
                  value={profile.gender || ""}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 rotate-90" size={14} />
              </div>
            </div>
            
            <div className="group relative">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block ml-1 group-focus-within:text-indigo-400 transition-colors">
                Date of Birth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Year", key: "year", options: Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 16 - i) },
                  { label: "Month", key: "month", options: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => ({ label: m, value: i })) },
                  { label: "Day", key: "day", options: Array.from({ length: 31 }, (_, i) => i + 1) }
                ].map((col) => (
                  <select
                    key={col.key}
                    className="bg-[#0a0a0c] border border-white/5 hover:border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500/50 transition-all outline-none appearance-none cursor-pointer text-xs font-bold"
                    value={
                      profile.dateOfBirth 
                        ? (col.key === 'year' ? new Date(profile.dateOfBirth).getFullYear() : 
                           col.key === 'month' ? new Date(profile.dateOfBirth).getMonth() : 
                           new Date(profile.dateOfBirth).getDate())
                        : ""
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setProfile(prev => {
                        const current = prev.dateOfBirth ? new Date(prev.dateOfBirth) : new Date(2000, 0, 1);
                        if (col.key === 'year') current.setFullYear(val);
                        if (col.key === 'month') current.setMonth(val);
                        if (col.key === 'day') current.setDate(val);
                        return { ...prev, dateOfBirth: new Date(current) };
                      });
                    }}
                  >
                    <option value="" disabled>{col.label}</option>
                    {col.options.map(opt => (
                      <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                        {typeof opt === 'object' ? opt.label : opt}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          </div>
        )}
        {formStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="group relative">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block ml-1 group-focus-within:text-indigo-400 transition-colors">
                Your Location
              </label>
              <div className="relative">
                <input
                  placeholder="Enter location (Country, City, Region)"
                  defaultValue={profile.location ? [profile.location.country, profile.location.city, profile.location.region].filter(Boolean).join(", ") : ""}
                  className="w-full bg-[#0a0a0c] border border-white/5 hover:border-white/10 rounded-2xl p-5 pl-14 text-white focus:border-indigo-500/50 transition-all outline-none text-sm font-semibold placeholder:text-zinc-800"
                  onChange={(e) => {
                    const parts = e.target.value.split(",").map((p) => p.trim());
                    setProfile(prev => ({
                      ...prev,
                      location: {
                        country: parts[0] || "",
                        city: parts[1] || "",
                        region: parts[2] || parts[1] || "",
                      },
                    }));
                  }}
                />
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500/40" size={20} />
              </div>
            </div>
          </div>
        )}
        {formStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-600/30">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] p-2">
                <ExperienceProfiling
                  onUpdate={(data) =>
                    setProfile((prev) => ({ ...prev, annotationExperience: data }))
                  }
                />
            </div>

            {profile.annotationExperience?.hasExperience && (
              <div className="group relative">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block ml-1 group-focus-within:text-indigo-400 transition-colors">
                  Experience Summary
                </label>
                <textarea
                  placeholder="Detail tools and environments used..."
                  className="w-full bg-[#0a0a0c] border border-white/5 hover:border-white/10 rounded-[28px] p-6 text-white h-40 resize-none focus:border-indigo-500/50 transition-all outline-none text-sm leading-relaxed placeholder:text-zinc-800 font-semibold"
                  onChange={(e) =>
                    setProfile(prev => ({ ...prev, expertise: e.target.value }))
                  }
                  value={typeof profile.expertise === "string" ? profile.expertise : ""}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pt-4 mt-auto border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 w-full max-w-md mx-auto">
            {formStep > 1 && (
              <button 
                  onClick={() => setFormStep(formStep - 1)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-zinc-500 hover:text-white"
              >
                  <ChevronRight size={18} className="rotate-180" />
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={
                (formStep === 1 && (!profile.gender || !profile.dateOfBirth)) ||
                (formStep === 2 && (!profile.location?.country))
              }
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center gap-3"
            >
                <span>
                  {formStep === 3 ? "Complete Profile" : "Next Step"}
                </span>
                <ChevronRight size={20} />
            </button>
          </div>
      </div>
    </div>
  );
};
