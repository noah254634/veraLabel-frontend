import { useState } from 'react';
import { OnboardingSidebar } from './OnboardingSidebar';
import { OnboardingSlides } from './OnboardingSlides';
import { TrainingCanvas } from './TrainingCanvas';
import { OnboardingComplete } from './OnboardingComplete';

export const OnboardingEnforcer = () => {
  const [view, setView] = useState('INTRO');
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="fixed inset-0 z-[200] bg-[#07090D] md:p-6 overflow-y-auto flex items-start justify-center">
      <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[min(850px,90vh)] bg-[#161B22] md:border md:border-white/5 md:rounded-[40px] shadow-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Responsive Sidebar/Header */}
        <OnboardingSidebar view={view} currentStep={currentStep} />

        <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_0%,#1e293b,transparent)] p-6 md:p-12 lg:p-16">
          <div className="w-full max-w-2xl mx-auto h-full flex flex-col justify-center">
            {view === 'INTRO' && (
              <OnboardingSlides 
                mode="INTRO" 
                onComplete={() => setView('LEARNING')} 
                onStepChange={setCurrentStep}
              />
            )}
            
            {view === 'LEARNING' && (
              <OnboardingSlides 
                mode="LEARNING" 
                onComplete={() => setView('TRAINING')} 
              />
            )}

            {view === 'TRAINING' && (
              <TrainingCanvas onComplete={() => setView('SUCCESS')} />
            )}

            {view === 'SUCCESS' && (
              <OnboardingComplete />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default OnboardingEnforcer;