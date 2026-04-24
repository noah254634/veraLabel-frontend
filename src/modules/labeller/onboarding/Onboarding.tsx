import React, { useState } from "react";
import { OnboardingSidebar } from "./OnboardingSidebar";
import { OnboardingSlides } from "./OnboardingSlides";
import { TrainingCanvas } from "./TrainingCanvas";
import { OnboardingComplete } from "./OnboardingComplete";
import { LabellerProfileForm } from "./LabellerProfile";
import type { LabellerProfile } from "../types/types";
import { useLabelerStore } from "../store/labelerStore";
import { useOnboardStore } from "../store/0nboardingStore";
export const OnboardingEnforcer = () => {
  // Added 'PROFILING' to the view states
  const {createLabellerProfile}=useOnboardStore()
  const { setLabeller: createProfile } = useLabelerStore();
  const [view, setView] = useState<
    "PROFILING" | "INTRO" | "LEARNING" | "TRAINING" | "SUCCESS"
  >("PROFILING");
  const [currentStep, setCurrentStep] = useState(1);

  const handleProfileComplete = (profileData: LabellerProfile) => {
    // 1. Logic to sync with your Backend/AuthStore goes here
    console.log("Syncing Profile to V-LAB Refinery:", profileData);
    createLabellerProfile(profileData);


    // 2. Advance to the Learning phase
    setView("LEARNING");
    setCurrentStep(3); // Adjusting sidebar progress
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020203] md:p-6 overflow-y-auto flex items-start justify-center">
      <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[min(850px,90vh)] bg-[#050505] md:border md:border-zinc-900 md:rounded-[40px] shadow-3xl overflow-hidden flex flex-col md:flex-row">
        <OnboardingSidebar view={view} currentStep={currentStep} />

        <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_0%,#1f1f23,transparent)] p-6 md:p-12 lg:p-16">
          <div className={`w-full mx-auto h-full flex flex-col justify-center ${view === "SUCCESS" ? "max-w-full" : "max-w-2xl"}`}>
            {/* Phase : Personnel Profiling (NEW) */}
            {view === "PROFILING" && (
              <LabellerProfileForm onComplete={handleProfileComplete} />
            )}
            {/* Phase 2: The Vision */}
            {view === "INTRO" && (
              <OnboardingSlides
                mode="INTRO"
                onComplete={() => {
                  setView("PROFILING");
                  setCurrentStep(2);
                }}
                onStepChange={setCurrentStep}
              />
            )}
            {/* Phase 3: Technical Mastery Slides */}
            {view === "LEARNING" && (
              <OnboardingSlides
                mode="LEARNING"
                onComplete={() => setView("TRAINING")}
              />
            )}

            {/* Phase 4: Skill Verification (The Canvas) */}
            {view === "TRAINING" && (
              <TrainingCanvas onComplete={() => setView("SUCCESS")} />
            )}

            {/* Phase 5: Success & Tier Assignment */}
            {view === "SUCCESS" && <OnboardingComplete />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnboardingEnforcer;
