import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { ProgressBar } from './ProgressBar';
import { Lock, ShieldCheck, Terminal, ChevronRight, Zap } from 'lucide-react';

interface QualificationProps {
  title: string;
  category: 'Image' | 'NLP' | 'Audio' | string;
  potentialReward: string;
  status: 'locked' | 'in-progress' | 'passed';
  progress?: number;
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
    <div className={`relative bg-[#050505] border transition-all duration-500 rounded-sm p-8 flex flex-col h-full group
      ${isPassed ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-zinc-900 hover:border-zinc-700'} 
      ${isLocked ? 'grayscale' : 'opacity-100'}`}>
      
      {/* 1. TECHNICAL HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-[0.2em]">
            // {category}_Protocol
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight italic">{title}</h3>
          </div>
        </div>
        
        {isPassed && (
          <div className="flex items-center gap-1.5 px-2 py-1 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-black uppercase tracking-tighter">
            <ShieldCheck size={10} />
            Verified_Expert
          </div>
        )}
      </div>

      {/* 2. DESCRIPTION */}
      <p className="text-xs text-zinc-500 leading-relaxed font-light mb-8 line-clamp-2">
        {description}
      </p>

      {/* 3. REWARD TELEMETRY */}
      <div className="bg-black border border-zinc-900 p-4 mb-8 flex items-center justify-between group-hover:border-zinc-800 transition-colors">
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-zinc-700" />
           <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Incentive_Bracket:</span>
        </div>
        <span className="text-sm font-bold text-emerald-500 tabular-nums tracking-tighter">
          {potentialReward} <span className="text-[10px] text-zinc-700 font-mono">/ASSET</span>
        </span>
      </div>

      {/* 4. ACTION INTERFACE */}
      <div className="mt-auto space-y-6">
        {status === 'in-progress' && (
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
               <span>Calibration_Progress</span>
               <span>{progress}%</span>
            </div>
            <ProgressBar progress={progress} className="!h-0.5 !bg-zinc-900" />
          </div>
        )}

        {isLocked ? (
          <div className="flex items-center gap-3 p-3 bg-rose-500/5 border border-rose-500/10 text-rose-500/70 text-[9px] font-mono uppercase tracking-widest">
            <Lock size={12} />
            Access_Restricted: Complete_Onboarding
          </div>
        ) : (
          <PrimaryButton 
            className={`w-full !rounded-sm !py-3 !text-[10px] !font-bold uppercase tracking-[0.2em] transition-all
              ${isPassed ? '!bg-zinc-950 !text-zinc-400 !border-zinc-800 hover:!text-white' : '!bg-white !text-black hover:!bg-indigo-50'}`} 
            variant={isPassed ? 'outline' : 'primary'}
          >
            {isPassed ? 'Review_Certification' : status === 'in-progress' ? 'Resume_Calibration' : 'Initialize_Exam'}
            {!isPassed && <ChevronRight size={14} className="ml-2 inline-block" />}
          </PrimaryButton>
        )}
      </div>

      {/* SYSTEM LOCK OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 bg-[#020203]/60 backdrop-blur-[1px] pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Subtle scanline effect */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
      )}
    </div>
  );
};