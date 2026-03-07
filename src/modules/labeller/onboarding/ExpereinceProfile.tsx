import React, { useState } from 'react';
import { 
  Briefcase, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Mic, 
  Brain, 
  ChevronDown, 
  CheckCircle2 
} from 'lucide-react';

const EXP_TYPES = [
  { id: "image_annotation", label: "Image", icon: <ImageIcon size={18} /> },
  { id: "video_annotation", label: "Video", icon: <Video size={18} /> },
  { id: "text_classification", label: "Text", icon: <FileText size={18} /> },
  { id: "audio_transcription", label: "Audio", icon: <Mic size={18} /> },
  { id: "nlp_labeling", label: "NLP", icon: <Brain size={18} /> },
];

export const ExperienceProfiling = ({ onUpdate }: { onUpdate: (data: any) => void }) => {
  const [hasExp, setHasExp] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState("");

  const toggleType = (id: string) => {
    const next = selectedTypes.includes(id) 
      ? selectedTypes.filter(t => t !== id) 
      : [...selectedTypes, id];
    setSelectedTypes(next);
    updateParent(hasExp, next, duration);
  };

  const updateParent = (exp: boolean, types: string[], dur: string) => {
    onUpdate({
      hasExperience: exp,
      experienceTypes: exp ? types : [],
      experienceDuration: exp ? dur : undefined
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. THE TOGGLE CARD */}
      <button 
        onClick={() => { setHasExp(!hasExp); updateParent(!hasExp, selectedTypes, duration); }}
        className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${
          hasExp ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-[#0B0E14] border-white/5 hover:border-white/10'
        }`}
      >
        <div className="flex items-center gap-4 text-left">
          <div className={`p-3 rounded-2xl ${hasExp ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}>
            <Briefcase size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold tracking-tight">Prior Annotation Experience</h4>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Protocol: V-XP 01</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${hasExp ? 'border-blue-500 bg-blue-500' : 'border-white/10'}`}>
          {hasExp && <CheckCircle2 size={14} className="text-white" />}
        </div>
      </button>

      {/* 2. THE REVEALED FORM (Conditional) */}
      {hasExp && (
        <div className="space-y-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl animate-in slide-in-from-top-4 duration-500">
          
          {/* Experience Types Grid */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Specialization Vectors</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXP_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedTypes.includes(type.id) 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Temporal Mastery (Duration)</label>
            <div className="relative">
              <select 
                value={duration}
                onChange={(e) => { setDuration(e.target.value); updateParent(hasExp, selectedTypes, e.target.value); }}
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-500 appearance-none transition-all"
              >
                <option value="">Select Tenure</option>
                <option value="less_than_3_months">&lt; 3 Months</option>
                <option value="3_to_12_months">3 - 12 Months</option>
                <option value="1_to_3_years">1 - 3 Years</option>
                <option value="3_plus_years">3+ Years Professional</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};