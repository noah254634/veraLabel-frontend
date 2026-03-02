import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { ProgressBar } from './ProgressBar';

interface QualificationProps {
  title: string;
  category: 'Image' | 'NLP' | 'Audio';
  potentialReward: string;
  status: 'locked' | 'in-progress' | 'passed';
  progress?: number; // 0-100
  description: string;
}

export const QualificationCard: React.FC<QualificationProps> = ({
  title,
  category,
  potentialReward,
  status,
  progress = 0,
  description,
}) => {
  const isLocked = status === 'locked';
  const isPassed = status === 'passed';

  return (
    <div className={`relative overflow-hidden bg-[#161B22] border-2 rounded-2xl p-6 transition-all duration-300 
      ${isPassed ? 'border-green-500/30' : 'border-white/5'} 
      ${isLocked ? 'opacity-70' : 'opacity-100 shadow-xl'}`}>
      
      {/* 1. STATUS BADGE */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded uppercase tracking-widest">
          {category} Training
        </span>
        {isPassed && (
          <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">
            ✓ QUALIFIED
          </span>
        )}
      </div>

      {/* 2. TITLE & DESCRIPTION */}
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-6">
        {description}
      </p>

      {/* 3. POTENTIAL EARNINGS PREVIEW */}
      <div className="bg-[#0B0E14] rounded-xl p-3 mb-6 flex items-center justify-between border border-white/5">
        <span className="text-xs text-gray-500">Unlocks access to:</span>
        <span className="text-sm font-bold text-green-400">{potentialReward} / task</span>
      </div>

      {/* 4. ACTION AREA */}
      <div className="mt-auto">
        {status === 'in-progress' && (
          <div className="mb-4">
            <ProgressBar progress={progress} label="Training Progress" />
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
            <span className="text-lg">🔒</span>
            <span>Complete Basic Onboarding to unlock this exam</span>
          </div>
        )}

        <PrimaryButton 
          className="w-full" 
          variant={isPassed ? 'outline' : 'primary'}
          disabled={isLocked}
        >
          {isPassed ? 'View Certificate' : status === 'in-progress' ? 'Continue Exam' : 'Start Qualification'}
        </PrimaryButton>
      </div>

      {/* HIGH-END OVERLAY FOR LOCKED STATE */}
      {isLocked && (
        <div className="absolute inset-0 bg-[#0B0E14]/40 backdrop-blur-[1px] pointer-events-none rounded-2xl" />
      )}
    </div>
  );
};