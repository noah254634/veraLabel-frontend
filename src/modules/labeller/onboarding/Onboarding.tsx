import { useState } from "react";
import { OnboardingSidebar } from "./OnboardingSidebar";
import { OnboardingSlides } from "./OnboardingSlides";
import { TrainingCanvas } from "./TrainingCanvas";
import { OnboardingComplete } from "./OnboardingComplete";
import { LabellerProfileForm } from "./LabellerProfile";
import type { LabellerProfile } from "../types/types";
import { useOnboardStore } from "../store/0nboardingStore";
import { useAuthStore } from "../../auth/useAuthstore";

export const OnboardingEnforcer = () => {
  // Bug #1 fix: use createLabellerProfile from the store (POSTs to backend)
  // Bug #7 fix: flow is INTRO → PROFILING → LEARNING → TRAINING → SUCCESS (INTRO was previously dead)
  const { setLabeller, createLabellerProfile } = useOnboardStore();
  const { user } = useAuthStore();
  const [view, setView] = useState<
    "PROFILING" | "INTRO" | "LEARNING" | "TRAINING" | "SUCCESS"
  >("INTRO");
  const [currentStep, setCurrentStep] = useState(1);

  const handleProfileComplete = async (profileData: LabellerProfile) => {
    try {
      // Bug #1: POST profile to backend → sets isOnboarded: true in MongoDB
      const response = await createLabellerProfile(profileData);

      // Sync response to local store for immediate UI reactivity
      await setLabeller(response ?? profileData);

      // Mark onboarding done in localStorage with user-keyed flag
      // (LabellerLayout uses `labellerOnboardingCompleted:<userId|email>`)
      const onboardingKey = user
        ? `labellerOnboardingCompleted:${user._id ?? user.email}`
        : null;
      if (onboardingKey) {
        localStorage.setItem(onboardingKey, "true");
      }

      // Advance to Learning phase
      setView("LEARNING");
      setCurrentStep(3);
    } catch (_err) {
      // createLabellerProfile in the store already shows a toast error
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020203] md:p-6 overflow-y-auto flex items-start justify-center">
      <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[min(850px,90vh)] bg-[#050505] md:border md:border-zinc-900 md:rounded-[40px] shadow-3xl overflow-hidden flex flex-col md:flex-row">
        <OnboardingSidebar view={view} currentStep={currentStep} />

        <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_0%,#1f1f23,transparent)] p-6 md:p-12 lg:p-16">
          <div className={`w-full mx-auto h-full flex flex-col justify-center ${view === "SUCCESS" ? "max-w-full" : "max-w-2xl"}`}>
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
            {view === "PROFILING" && (
              <LabellerProfileForm onComplete={handleProfileComplete} />
            )}
            {view === "LEARNING" && (
              <OnboardingSlides
                mode="LEARNING"
                onComplete={() => setView("TRAINING")}
              />
            )}
            {view === "TRAINING" && (
              <TrainingCanvas onComplete={() => setView("SUCCESS")} />
            )}
            {view === "SUCCESS" && <OnboardingComplete />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnboardingEnforcer;
