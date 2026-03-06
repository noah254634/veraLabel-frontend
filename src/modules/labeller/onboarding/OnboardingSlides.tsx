import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

const CONTENT = {
  INTRO: [
    { title: "Digital Refinery", desc: "Process raw data into high-value AI assets." },
    { title: "Quality Moat", desc: "95% accuracy is our baseline for M-Pesa payouts." },
    { title: "The Pioneer Path", desc: "Complete training to unlock the active marketplace." }
  ],
  LEARNING: [
    { title: "Tight Bounding", desc: "Boxes must touch the outer pixels of the object." },
    { title: "No Overlaps", desc: "Keep labels distinct even in crowded scenes." }
  ]
};

export const OnboardingSlides = ({ mode, onComplete, onStepChange }: any) => {
  const [index, setIndex] = useState(0);
  const slides = mode === 'INTRO' ? CONTENT.INTRO : CONTENT.LEARNING;

  const next = () => {
    if (index < slides.length - 1) {
      setIndex(i => i + 1);
      onStepChange?.(index + 2);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <span className="text-blue-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
        Phase: {mode}
      </span>
      <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">
        {slides[index].title}
      </h2>
      <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-12">
        {slides[index].desc}
      </p>
      
      <div className="flex items-center gap-8">
        <PrimaryButton onClick={next} className="px-12 py-5">
          {index === slides.length - 1 ? "Begin Mission" : "Continue"} <ChevronRight className="ml-2" />
        </PrimaryButton>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};