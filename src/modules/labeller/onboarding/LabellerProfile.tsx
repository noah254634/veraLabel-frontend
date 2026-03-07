import React, { useState } from "react";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import type { LabellerProfile, Tier } from "../types/types";
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Personnel Profiling
        </h2>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
          Step {formStep} of 3:{" "}
          {formStep === 1
            ? "Demographics"
            : formStep === 2
              ? "Location"
              : "Experience"}
        </p>
      </div>

      <div className="grid gap-6">
        {/* STEP 1: BASIC INFO */}
        {formStep === 1 && (
          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Gender
              </label>
              <select
                className="w-full bg-[#0B0E14] border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 transition-all outline-none appearance-none"
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value as any })
                }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Age
              </label>
              <input
                type="number"
                placeholder="21"
                className="w-full bg-[#0B0E14] border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 transition-all outline-none"
                onChange={(e) =>
                  setProfile({ ...profile, age: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {/* STEP 2: GEOGRAPHY */}
        {formStep === 2 && (
          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                City / Region
              </label>
              <input
                placeholder="e.g.Kenya, Nairobi, Bungoma"
                defaultValue={profile.location ? [profile.location.country, profile.location.city, profile.location.region].filter((v, i, a) => v && v !== a[i-1]).join(", ") : ""}
                className="w-full bg-[#0B0E14] border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 transition-all outline-none"
                onChange={(e) => {
                  const parts = e.target.value.split(",").map((p) => p.trim());
                  setProfile(prev => ({
                    ...prev,
                    location: {
                      country: parts[0] || "",
                      city: parts[1] || "",
                      region: parts[2] || parts[1] || "", // Fallback to city if region isn't typed
                    },
                  }));
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 3: TECHNICAL STACK */}
        {formStep === 3 && (
          <div
            className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 
    scrollbar-thin 
    scrollbar-thumb-blue-500/30 
    hover:scrollbar-thumb-blue-500/50 
    scrollbar-track-white/5 "
          >
            <ExperienceProfiling
              initialData={profile.annotationExperience}
              onUpdate={(data) =>
                setProfile((prev) => ({ ...prev, annotationExperience: data }))
              }
            />

            {profile.annotationExperience?.hasExperience && (
              <textarea
                placeholder="List tools used (e.g. Labelbox, CVAT, VeraLabel v1)"
                className="w-full bg-[#0B0E14] border border-white/5 rounded-xl p-4 text-white h-32 resize-none focus:border-blue-500 transition-all outline-none animate-in fade-in slide-in-from-top-2"
                onChange={(e) =>
                  setProfile({ ...profile, expertise: e.target.value })
                }
                value={profile.expertise || ""}
              />
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        {formStep === 3 ? "Finalize Profile" : "Next Protocol"}{" "}
        <ChevronRight size={14} />
      </button>
    </div>
  );
};
