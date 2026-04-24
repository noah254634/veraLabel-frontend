import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, TrendingUp } from 'lucide-react';

export interface RLHFFeedback {
  taskId: string;
  humanVerdict: 'APPROVE' | 'REJECT' | 'FLAG';
  aiPrediction: {
    match: string;
    confidence: number;
  };
  alignmentScore: number; // 0-100: how well human verdict aligns with AI
  feedback: 'HELPFUL' | 'MISLEADING' | 'INCORRECT' | 'INCOMPLETE';
  notes?: string;
  timestamp: number;
}

interface RLHFFeedbackPanelProps {
  taskId: string;
  aiPrediction: {
    match: string;
    confidence: number;
  };
  humanVerdict: 'APPROVE' | 'REJECT' | 'FLAG';
  onSubmit?: (feedback: RLHFFeedback) => void;
}

const getRLHFScore = (verdict: string, confidence: number): number => {
  // Calculate how much the human verdict aligns with AI confidence
  const baseScore = confidence * 100;
  
  // Modifiers based on verdict type
  if (verdict === 'APPROVE') return Math.min(100, baseScore);
  if (verdict === 'REJECT') return Math.max(0, 100 - baseScore);
  if (verdict === 'FLAG') return 50; // Flagged = uncertainty
  
  return baseScore;
};

const RLHFFeedbackPanel: React.FC<RLHFFeedbackPanelProps> = ({
  taskId,
  aiPrediction,
  humanVerdict,
  onSubmit
}) => {
  const [feedbackType, setFeedbackType] = useState<'HELPFUL' | 'MISLEADING' | 'INCORRECT' | 'INCOMPLETE' | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alignmentScore = getRLHFScore(humanVerdict, aiPrediction.confidence);
  const isAligned = alignmentScore > 70;

  const handleSubmit = async () => {
    if (!feedbackType) return;

    setIsSubmitting(true);
    const feedback: RLHFFeedback = {
      taskId,
      humanVerdict,
      aiPrediction,
      alignmentScore,
      feedback: feedbackType,
      notes: notes || undefined,
      timestamp: Date.now()
    };

    if (onSubmit) {
      await onSubmit(feedback);
    }

    setIsSubmitting(false);
    setFeedbackType(null);
    setNotes('');
  };

  return (
    <div className="mt-8 p-6 bg-black border border-zinc-900 rounded-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-500" />
          <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">RLHF_Feedback</span>
        </div>
        <div className={`text-[8px] font-mono font-bold px-2 py-1 rounded-sm ${
          isAligned 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
        }`}>
          Alignment: {alignmentScore.toFixed(0)}%
        </div>
      </div>

      <div className={`p-3 rounded-sm border text-[9px] flex items-start gap-3 ${
        isAligned
          ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400'
          : 'bg-amber-500/5 border-amber-500/30 text-amber-400'
      }`}>
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          {isAligned ? (
            <span>✓ Your verdict <strong>aligns with AI prediction</strong>. This helps validate the model.</span>
          ) : (
            <span>↻ Your verdict <strong>differs from AI prediction</strong>. This data helps improve the model.</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[9px]">
        <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-sm">
          <p className="text-zinc-600 uppercase tracking-widest font-bold mb-1">AI_Prediction</p>
          <div className="font-mono space-y-1">
            <div><span className="text-zinc-600">Detection:</span> <span className="text-indigo-400">{aiPrediction.match}</span></div>
            <div><span className="text-zinc-600">Confidence:</span> <span className="text-indigo-400">{(aiPrediction.confidence * 100).toFixed(0)}%</span></div>
          </div>
        </div>
        <div className="p-3 bg-zinc-950/60 border border-cyan-500/20 rounded-sm bg-cyan-500/5">
          <p className="text-cyan-600 uppercase tracking-widest font-bold mb-1">Human_Verdict</p>
          <div className="font-mono space-y-1">
            <div><span className="text-zinc-600">Decision:</span> <span className="text-cyan-400 font-bold">{humanVerdict}</span></div>
            <div><span className="text-zinc-600">Confidence:</span> <span className="text-cyan-400">100%</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Quality_Assessment</p>
        <div className="grid grid-cols-2 gap-2">
          {(['HELPFUL', 'MISLEADING', 'INCORRECT', 'INCOMPLETE'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFeedbackType(type)}
              className={`p-2 rounded-sm transition-all text-[8px] font-bold uppercase tracking-widest border ${
                feedbackType === type
                  ? type === 'HELPFUL'
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                    : 'border-rose-500/60 bg-rose-500/10 text-rose-400'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {type === 'HELPFUL' && <ThumbsUp size={12} className="inline mr-1" />}
              {type !== 'HELPFUL' && <ThumbsDown size={12} className="inline mr-1" />}
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Additional_Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Explain why the AI prediction was helpful or problematic..."
          className="w-full p-2 text-[9px] bg-zinc-950 border border-zinc-900 text-zinc-400 rounded-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none h-16"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!feedbackType || isSubmitting}
        className={`w-full py-2 px-4 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all ${
          feedbackType && !isSubmitting
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit_Feedback'}
      </button>

      <p className="text-[8px] text-zinc-600 text-center">
        Your feedback helps improve AI accuracy and trains better models for future reviews
      </p>
    </div>
  );
};

export default RLHFFeedbackPanel;
