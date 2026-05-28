import React, { useState, useEffect } from 'react';
import { api } from '../../../shared/types/api';
import { toast } from 'react-hot-toast';
import { Terminal, Plus, Trash2, X, Edit3, Globe, ShieldCheck, FileJson } from 'lucide-react';

const DEFAULT_SYSTEM_PROMPT = `You are an expert quality reviewer for Swahili and Sheng RLHF annotation data. You will receive a task containing a prompt, two responses, and a labeller submission.

Evaluate the labeller submission on:
1. Did they correctly identify the register of the prompt?
2. Does their preferred response genuinely match that register?
3. Are their dimensional scores consistent with their rationale?
4. Did they penalize natural code-switching incorrectly?
5. Did they select Tie appropriately or to avoid deciding?

Strictly enforce the following anti-patterns (Explicit "Do Not Do" instructions):
- Do not penalize a response for containing English words — code-switching is natural in Sheng.
- Do not prefer a longer response simply because it feels more thorough.
- Do not select Tie because you are unsure — Tie means genuinely equal quality.
- Do not score Fluency low just because a response uses Sheng you personally don't use — regional variation is valid (e.g. differences between Nairobi Sheng and Coast Sheng).

Return JSON only:
{
  "confidence": 0.0-1.0,
  "winner_agreement": true/false,
  "score_consistency": true/false,
  "language_flags": [],
  "escalate": true/false,
  "reason": "one sentence"
}`;

export const InstructionManager = () => {
  const [templates, setTemplates] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableGuidelines, setEnableGuidelines] = useState(true);
  const [enableAnnotations, setEnableAnnotations] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    version: '1.0.0',
    domains: ['RLHF'],
    languageRegion: 'Swahili — Nairobi/Sheng',
    labellerConfig: {
      labellerTier: 'Verified',
      labellerCount: 3,
      timeframeDays: 14
    },
    buyerVisibleSummary: '',
    baseDirectives: [''],
    antiPatterns: [''],
    buyerQuestions: [] as any[],
    scoringConfig: {
      taskTypes: ['Preference Ranking (A vs B)'],
      scoreDimensions: ['Fluency', 'Cultural Appropriateness', 'Helpfulness', 'Factual Accuracy'],
      dimensionWeights: [1.0, 1.0, 1.0, 1.0],
      scoringAnchors: {} as Record<string, { min: string; max: string }>,
      requireRationale: true,
      minLength: 20,
      allowTie: true,
      tieRequiresJustification: true
    },
    rubrics: [] as any[],
    goldenExamples: [] as any[],
    edgeCases: [] as any[],
    adjudicationPolicy: {
      annotationMode: 'Double',
      conflictThreshold: 'If any single dimension score differs by 2+ points between labellers → flag for adjudication',
      escalateTo: 'Senior Annotator',
      conflictResolution: 'Keep as Unresolved'
    },
    aiReviewConfig: {
      enableAIReview: false,
      modelName: 'gpt-4o',
      temperature: 0.1,
      systemPrompt: DEFAULT_SYSTEM_PROMPT
    },
    status: 'draft'
  });

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/instructions?includeDrafts=true');
      let fetchedTemplates = [];
      if (response.data && response.data.data && Array.isArray(response.data.data.templates)) {
        fetchedTemplates = response.data.data.templates;
      } else if (response.data && Array.isArray(response.data.templates)) {
        fetchedTemplates = response.data.templates;
      } else if (Array.isArray(response.data)) {
        fetchedTemplates = response.data;
      }
      setTemplates(fetchedTemplates);
    } catch (err) {
      toast.error('Failed to load templates');
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleArrayChange = (field: string, index: number, value: any) => {
    setFormData(prev => {
      const arr = [...(prev as any)[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayAdd = (field: string, defaultObj: any) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev as any)[field], defaultObj] }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData(prev => ({ ...prev, [field]: (prev as any)[field].filter((_: any, i: number) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEdit = (formData as any)._id;
      if (isEdit) {
        await api.put(`/instructions/${(formData as any)._id}`, { ...formData, status });
      } else {
        await api.post('/instructions', { ...formData, status });
      }
      toast.success(`Protocol ${status === 'published' ? 'Published' : 'Saved as Draft'}!`);
      setIsCreating(false);
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save protocol');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to disable this template?")) return;
    try {
      await api.delete(`/instructions/${id}`);
      toast.success('Template disabled');
      fetchTemplates();
    } catch (err) {
      toast.error('Failed to disable template');
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-8 mt-12">
      <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
        <span className="w-8 h-[1px] bg-indigo-500/50"></span>
        {title}
        <span className="flex-1 h-[1px] bg-indigo-500/10"></span>
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#020202] text-zinc-300 selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Protocol Templates</h1>
            <p className="text-zinc-500 font-mono text-[10px] mt-2 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} className="text-indigo-500"/> Manage Data Labeling Instruction Sets
            </p>
          </div>
          {!isCreating && (
            <button
              onClick={() => {
                setFormData({
                  name: '',
                  version: '1.0.0',
                  domains: ['RLHF'],
                  languageRegion: 'Swahili — Nairobi/Sheng',
                  labellerConfig: {
                    labellerTier: 'Verified',
                    labellerCount: 3,
                    timeframeDays: 14
                  },
                  buyerVisibleSummary: '',
                  baseDirectives: [''],
                  antiPatterns: [''],
                  buyerQuestions: [] as any[],
                  scoringConfig: {
                    taskTypes: ['Preference Ranking (A vs B)'],
                    scoreDimensions: ['Fluency', 'Cultural Appropriateness', 'Helpfulness', 'Factual Accuracy'],
                    dimensionWeights: [1.0, 1.0, 1.0, 1.0],
                    requireRationale: true,
                    minLength: 20,
                    allowTie: true
                  },
                  rubrics: [] as any[],
                  goldenExamples: [] as any[],
                  edgeCases: [] as any[],
                  adjudicationPolicy: {
                    annotationMode: 'Double',
                    conflictThreshold: 'If any single dimension score differs by 2+ points between labellers → flag for adjudication',
                    escalateTo: 'Senior Annotator',
                    conflictResolution: 'Keep as Unresolved'
                  },
                  aiReviewConfig: {
                    enableAIReview: false,
                    modelName: 'gpt-4o',
                    temperature: 0.1,
                    systemPrompt: DEFAULT_SYSTEM_PROMPT
                  },
                  status: 'draft'
                });
                setEnableGuidelines(true);
                setEnableAnnotations(true);
                setIsCreating(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Plus size={16} /> New Template
            </button>
          )}
        </div>

        {isCreating ? (
          <form className="bg-[#0A0A0A] border border-zinc-800 shadow-2xl p-8 md:p-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs uppercase tracking-widest">
                <ShieldCheck size={16} /> Protocol Designer Active
              </div>
              <button type="button" onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <SectionHeader title="BASIC INFO" />
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocol Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Conversational Sheng RLHF" className="w-full bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Version</label>
                <input type="text" disabled value={formData.version} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-zinc-600 font-mono text-sm outline-none cursor-not-allowed" />
                <p className="text-[9px] font-mono text-zinc-600 mt-1">(auto-increments on edit)</p>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Domain</label>
                <div className="flex flex-wrap gap-4">
                  {['RLHF', 'NLP', 'Audio', 'Image', 'Code', 'Cultural', 'Medical'].map(d => (
                    <label key={d} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white cursor-pointer">
                      <input type="checkbox" checked={formData.domains.includes(d)} onChange={(e) => {
                        const newDomains = e.target.checked ? [...formData.domains, d] : formData.domains.filter(x => x !== d);
                        setFormData({...formData, domains: newDomains});
                      }} className="accent-indigo-500 w-4 h-4" />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Language / Region</label>
                <input
                  type="text"
                  list="language-suggestions"
                  value={formData.languageRegion}
                  onChange={e => setFormData({...formData, languageRegion: e.target.value})}
                  placeholder="e.g. Swahili — Nairobi/Sheng"
                  className="w-full bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-indigo-500"
                />
                <datalist id="language-suggestions">
                  <option value="Swahili — Nairobi/Sheng" />
                  <option value="Swahili — Formal (TZ)" />
                  <option value="Amharic" />
                  <option value="Hausa" />
                  <option value="Zulu" />
                  <option value="Other / Mixed" />
                </datalist>
              </div>
            </div>
            <SectionHeader title="PROTOCOL DESIGN MODE" />
            <div className="bg-[#050505] border border-zinc-800 p-6 space-y-6">
              <p className="text-xs text-zinc-500 font-sans">
                Choose the scope of this protocol template. You can create text-based guidelines instructions, configure interactive annotations required from labellers, or combine both.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 bg-black border border-zinc-900">
                  <label className="flex items-center gap-3 text-sm text-white font-bold cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={enableGuidelines} 
                      onChange={e => {
                        setEnableGuidelines(e.target.checked);
                        if (!e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            buyerVisibleSummary: '',
                            baseDirectives: [''],
                            antiPatterns: [''],
                            rubrics: [],
                            goldenExamples: [],
                            edgeCases: []
                          }));
                        }
                      }}
                      className="accent-indigo-500 w-4 h-4" 
                    />
                    📖 Guidelines & Directives Checklist
                  </label>
                  <p className="text-[10px] text-zinc-500 pl-7 leading-relaxed font-sans">
                    Provide instructions, golden calibration examples, edge cases, and a checklist of final verification steps that labellers must verify.
                  </p>
                </div>
 
                <div className="space-y-3 p-4 bg-black border border-zinc-900">
                  <label className="flex items-center gap-3 text-sm text-white font-bold cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={enableAnnotations} 
                      onChange={e => {
                        setEnableAnnotations(e.target.checked);
                        if (!e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            scoringConfig: {
                              taskTypes: [],
                              scoreDimensions: [],
                              requireRationale: false,
                              minLength: 0,
                              allowTie: false
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            scoringConfig: {
                              taskTypes: ['Preference Ranking (A vs B)'],
                              scoreDimensions: ['Fluency', 'Cultural Appropriateness', 'Helpfulness', 'Factual Accuracy'],
                              requireRationale: true,
                              minLength: 20,
                              allowTie: true
                            }
                          }));
                        }
                      }}
                      className="accent-indigo-500 w-4 h-4" 
                    />
                    ⚙️ Task Output Annotations
                  </label>
                  <p className="text-[10px] text-zinc-500 pl-7 leading-relaxed font-sans">
                    Require labellers to provide A/B preference selections, ties, 1-5 dimensional scoring scales, or a detailed rationale text block.
                  </p>
                </div>
              </div>
 
              {enableGuidelines && templates.length > 0 && (
                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Clone Guidelines & Rubrics From Existing Template</label>
                  <select 
                    onChange={(e) => {
                      const templateId = e.target.value;
                      if (!templateId) return;
                      const selected = templates.find((t: any) => t._id === templateId) as any;
                      if (selected) {
                        setFormData(prev => ({
                          ...prev,
                          buyerVisibleSummary: selected.buyerVisibleSummary || '',
                          baseDirectives: [...(selected.baseDirectives || [''])],
                          antiPatterns: [...(selected.antiPatterns || [''])],
                          buyerQuestions: [...(selected.buyerQuestions || [])],
                          rubrics: [...(selected.rubrics || [])],
                          goldenExamples: [...(selected.goldenExamples || [])],
                          edgeCases: [...(selected.edgeCases || [])]
                        }));
                        toast.success(`Guidelines instructions successfully loaded from "${selected.name}"`);
                      }
                    }}
                    className="w-full bg-black border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Choose an existing template to clone instructions --</option>
                    {templates.filter((t: any) => t._id !== (formData as any)._id).map((t: any) => (
                      <option key={t._id} value={t._id}>{t.name} (v{t.version})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <SectionHeader title="LABELLER CONFIG" />
            <div className="bg-[#050505] border border-zinc-800 p-8 grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Labeller Tier</label>
                <div className="flex flex-col gap-3 mt-2">
                  {['Any', 'Verified', 'Senior Only'].map(t => (
                    <label key={t} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="labellerTier" 
                        checked={formData.labellerConfig?.labellerTier === t} 
                        onChange={() => setFormData({
                          ...formData,
                          labellerConfig: { ...formData.labellerConfig, labellerTier: t }
                        })} 
                        className="accent-indigo-500 w-4 h-4" 
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Labeller Count (per Task)</label>
                <input 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={formData.labellerConfig?.labellerCount || 3} 
                  onChange={e => setFormData({
                    ...formData,
                    labellerConfig: { ...formData.labellerConfig, labellerCount: parseInt(e.target.value) || 1 }
                  })} 
                  className="w-full bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-indigo-500" 
                />
                <span className="text-[9px] font-mono text-zinc-600 block mt-1">(standard: 3 for consensus)</span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Delivery Timeframe (SLA)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min={1} 
                    max={60} 
                    value={formData.labellerConfig?.timeframeDays || 14} 
                    onChange={e => setFormData({
                      ...formData,
                      labellerConfig: { ...formData.labellerConfig, timeframeDays: parseInt(e.target.value) || 14 }
                    })} 
                    className="bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-indigo-500 w-24" 
                  />
                  <span className="text-sm text-zinc-400 font-mono">Days</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-600 block mt-1">(expected turnaround SLA)</span>
              </div>
            </div>
            {enableGuidelines && (
              <>
                <SectionHeader title="DESCRIPTIONS" />
                <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14}/> Buyer-Visible Summary
                </label>
                <div className="border border-zinc-800 p-1 bg-black">
                  <textarea required value={formData.buyerVisibleSummary} onChange={e => setFormData({...formData, buyerVisibleSummary: e.target.value})} rows={3} className="w-full bg-transparent p-4 text-white text-sm outline-none resize-none" placeholder="Plain language. What the buyer sees on their dashboard." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Edit3 size={14}/> Base Directives (Labeller-Visible)
                </label>
                <div className="space-y-3 bg-black border border-zinc-800 p-6">
                  {formData.baseDirectives.map((dir, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-[10px] font-mono text-indigo-500 mt-2">{String(i + 1).padStart(2, '0')}.</span>
                      <input type="text" value={dir} onChange={e => handleArrayChange('baseDirectives', i, e.target.value)} placeholder="Structured instruction step..." className="flex-1 bg-transparent border-b border-zinc-800 py-2 text-zinc-300 text-sm outline-none focus:border-indigo-500 focus:text-white transition-colors" />
                      <button type="button" onClick={() => handleArrayRemove('baseDirectives', i)} className="text-zinc-600 hover:text-red-500 p-2"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('baseDirectives', '')} className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 mt-4">+ Add Directive Step</button>
                </div>
              </div>

              <div className="space-y-2 mt-8">
                <label className="text-[10px] font-mono text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <X size={14} className="text-red-500"/> Anti-Patterns (Labeller-Visible)
                </label>
                <div className="space-y-3 bg-black border border-zinc-800 p-6">
                  {(formData.antiPatterns || []).map((ap, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-[10px] font-mono text-red-500 mt-2">❌</span>
                      <input type="text" value={ap} onChange={e => handleArrayChange('antiPatterns', i, e.target.value)} placeholder="Prohibited action / Anti-pattern..." className="flex-1 bg-transparent border-b border-zinc-800 py-2 text-zinc-350 text-sm outline-none focus:border-red-500 focus:text-white transition-colors" />
                      <button type="button" onClick={() => handleArrayRemove('antiPatterns', i)} className="text-zinc-600 hover:text-red-500 p-2"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('antiPatterns', '')} className="text-[10px] font-mono font-bold text-red-400 hover:text-red-300 mt-4">+ Add Anti-Pattern Step</button>
                </div>
              </div>
            </div>
          </>
        )}
            {enableGuidelines && (
              <>
                <SectionHeader title="BUYER INTAKE QUESTIONS" />
                <div className="space-y-4">
                  <p className="text-xs text-zinc-500 mb-6">These questions are shown to the buyer at dataset submission. Their answers refine which rubrics apply.</p>
                  {formData.buyerQuestions.map((q, i) => (
                    <div key={i} className="bg-black border border-zinc-800 p-6 relative group">
                      <button type="button" onClick={() => handleArrayRemove('buyerQuestions', i)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500"><Trash2 size={16}/></button>
                      <div className="space-y-4 max-w-2xl">
                        <input required={enableGuidelines} type="text" value={q.question} onChange={e => handleArrayChange('buyerQuestions', i, {...q, question: e.target.value})} placeholder="Q: Is your use case formal or conversational?" className="w-full bg-transparent border-b border-zinc-800 pb-2 text-white text-sm outline-none focus:border-indigo-500 font-medium" />
                                   <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-600">Type:</label>
                            <select value={q.type} onChange={e => handleArrayChange('buyerQuestions', i, {...q, type: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none">
                              <option value="text">Short Text</option>
                              <option value="textarea">Long Text</option>
                              <option value="select">Single Select</option>
                              <option value="multiselect">Multi Select</option>
                            </select>
                          </div>
                          {(q.type === 'select' || q.type === 'multiselect') && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-zinc-600">Options (comma separated):</label>
                              <input type="text" value={(q.options || []).join(', ')} onChange={e => handleArrayChange('buyerQuestions', i, {...q, options: e.target.value.split(',').map(s=>s.trim())})} placeholder="Formal, Conversational, Mixed" className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none" />
                            </div>
                          )}
                          <div className="space-y-1 col-span-2">
                            <label className="text-[10px] font-mono text-zinc-600">Conditional Rubric Activation (Optional):</label>
                            <select 
                              value={q.activatesRubric || ''} 
                              onChange={e => handleArrayChange('buyerQuestions', i, {...q, activatesRubric: e.target.value})} 
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none"
                            >
                              <option value="">-- No rubric mapping (always active) --</option>
                              {formData.rubrics.map((r: any) => (
                                <option key={r.tag} value={r.tag}>Activate Rubric: {r.tag} ({r.type})</option>
                              ))}
                            </select>
                            <span className="text-[9px] font-mono text-zinc-600 block mt-1">(if set, this rubric is conditionally enabled based on the buyer's answers)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd('buyerQuestions', { question: '', type: 'select', options: [] })} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">+ Add Question</button>
                </div>
              </>
            )}
            {enableAnnotations && (
              <>
                <SectionHeader title="SCORING CONFIG" />
                <div className="bg-black border border-zinc-800 p-8 flex flex-col gap-6">
              <div className="space-y-2 pb-6 border-b border-zinc-900">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Protocol Task Mode</label>
                <div className="flex flex-wrap gap-8">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="taskMode" 
                      checked={!(formData.scoringConfig.taskTypes?.length > 0 || formData.scoringConfig.requireRationale)} 
                      onChange={() => {
                        setFormData({
                          ...formData,
                          scoringConfig: {
                            taskTypes: [],
                            scoreDimensions: [],
                            requireRationale: false,
                            minLength: 0,
                            allowTie: false
                          }
                        });
                      }}
                      className="accent-indigo-500 w-4 h-4" 
                    /> 
                    📖 Reference & Checklist Only (No Annotations)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="taskMode" 
                      checked={formData.scoringConfig.taskTypes?.length > 0 || formData.scoringConfig.requireRationale} 
                      onChange={() => {
                        setFormData({
                          ...formData,
                          scoringConfig: {
                            taskTypes: ['Preference Ranking (A vs B)'],
                            scoreDimensions: ['Fluency', 'Cultural Appropriateness', 'Helpfulness', 'Factual Accuracy'],
                            requireRationale: true,
                            minLength: 20,
                            allowTie: true
                          }
                        });
                      }}
                      className="accent-indigo-500 w-4 h-4" 
                    /> 
                    ⚙️ Annotation Pipeline (Ranking, Scoring, Rationale)
                  </label>
                </div>
              </div>

              {(formData.scoringConfig.taskTypes?.length > 0 || formData.scoringConfig.requireRationale) && (
                <div className="grid grid-cols-2 gap-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Task Type</label>
                    <div className="space-y-3">
                      {['Preference Ranking (A vs B)', 'Dimensional Scoring (1-5)'].map(t => (
                        <label key={t} className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={formData.scoringConfig.taskTypes.includes(t)} onChange={(e) => {
                            const newT = e.target.checked ? [...formData.scoringConfig.taskTypes, t] : formData.scoringConfig.taskTypes.filter(x => x !== t);
                            setFormData({...formData, scoringConfig: {...formData.scoringConfig, taskTypes: newT}});
                          }} className="accent-indigo-500 w-4 h-4" />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Score Dimensions & Weights</label>
                    <div className="flex flex-col gap-2">
                      {formData.scoringConfig.scoreDimensions.map((dim, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={dim} 
                            onChange={e => {
                              const newD = [...formData.scoringConfig.scoreDimensions]; 
                              newD[i] = e.target.value;
                              setFormData({
                                ...formData, 
                                scoringConfig: { ...formData.scoringConfig, scoreDimensions: newD }
                              });
                            }} 
                            placeholder="Dimension name (e.g. Fluency)"
                            className="bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none flex-1" 
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono text-zinc-600">Weight:</span>
                            <input 
                              type="number" 
                              step="0.1" 
                              min={0} 
                              value={formData.scoringConfig.dimensionWeights?.[i] ?? 1.0} 
                              onChange={e => {
                                const newW = [...(formData.scoringConfig.dimensionWeights || [])];
                                newW[i] = parseFloat(e.target.value) || 1.0;
                                setFormData({
                                  ...formData,
                                  scoringConfig: { ...formData.scoringConfig, dimensionWeights: newW }
                                });
                              }} 
                              className="bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none w-14" 
                            />
                          </div>
                          <button type="button" onClick={() => {
                            const newD = formData.scoringConfig.scoreDimensions.filter((_, idx) => idx !== i);
                            const newW = (formData.scoringConfig.dimensionWeights || []).filter((_, idx) => idx !== i);
                            setFormData({
                              ...formData, 
                              scoringConfig: { ...formData.scoringConfig, scoreDimensions: newD, dimensionWeights: newW }
                            });
                          }} className="text-zinc-600 hover:text-red-500"><X size={14}/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({
                        ...formData, 
                        scoringConfig: { 
                          ...formData.scoringConfig, 
                          scoreDimensions: [...formData.scoringConfig.scoreDimensions, ''],
                          dimensionWeights: [...(formData.scoringConfig.dimensionWeights || []), 1.0]
                        }
                      })} className="text-[10px] text-left text-indigo-400 mt-2">+ Add Custom Dimension</button>
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2 pt-6 border-t border-zinc-900 grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Require Rationale</label>
                      <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                        <input type="checkbox" checked={formData.scoringConfig.requireRationale} onChange={e => setFormData({...formData, scoringConfig: {...formData.scoringConfig, requireRationale: e.target.checked}})} className="accent-indigo-500 w-4 h-4" /> Yes
                      </label>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Min Length</label>
                      <input type="number" value={formData.scoringConfig.minLength} onChange={e => setFormData({...formData, scoringConfig: {...formData.scoringConfig, minLength: parseInt(e.target.value) || 0}})} className="bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-sm outline-none w-24" /> chars
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Allow Tie</label>
                      <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                        <input type="checkbox" checked={formData.scoringConfig.allowTie} onChange={e => setFormData({...formData, scoringConfig: {...formData.scoringConfig, allowTie: e.target.checked}})} className="accent-indigo-500 w-4 h-4" /> Yes
                      </label>
                    </div>
                    <div className="col-span-3 pt-4 border-t border-zinc-900">
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Tie Requires Written Justification</label>
                      <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                        <input type="checkbox" checked={(formData.scoringConfig as any).tieRequiresJustification !== false} onChange={e => setFormData({...formData, scoringConfig: {...formData.scoringConfig, tieRequiresJustification: e.target.checked} as any})} className="accent-indigo-500 w-4 h-4" /> Yes — labellers must explain why both responses are genuinely equal
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
              </>
            )}
            {formData.scoringConfig.taskTypes?.includes('Dimensional Scoring (1-5)') &&
             formData.scoringConfig.scoreDimensions?.filter(d => d).length > 0 && (
              <div className="border border-zinc-800 bg-black p-6 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Scoring Scale Anchors</span>
                  <span className="text-[9px] font-mono text-zinc-700 italic">— Define what 1 and 5 mean per dimension</span>
                </div>
                {formData.scoringConfig.scoreDimensions.filter(d => d).map((dim, i) => {
                  const anchors = ((formData.scoringConfig as any).scoringAnchors || {}) as Record<string, { min: string; max: string }>;
                  const anchor = anchors[dim] || { min: '', max: '' };
                  return (
                    <div key={i} className="grid grid-cols-12 gap-3 items-start bg-zinc-950 border border-zinc-900 p-4">
                      <div className="col-span-2">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold">{dim}</span>
                      </div>
                      <div className="col-span-5 space-y-1">
                        <label className="text-[9px] font-mono text-rose-400 uppercase tracking-wider">Score 1 = (worst)</label>
                        <input
                          type="text"
                          value={anchor.min}
                          onChange={e => {
                            const newAnchors = { ...anchors, [dim]: { ...anchor, min: e.target.value } };
                            setFormData({ ...formData, scoringConfig: { ...formData.scoringConfig, scoringAnchors: newAnchors } as any });
                          }}
                          placeholder="e.g. Completely broken, unnatural"
                          className="w-full bg-black border border-zinc-800 p-2 text-zinc-300 text-xs outline-none focus:border-rose-500/50 transition-colors"
                        />
                      </div>
                      <div className="col-span-5 space-y-1">
                        <label className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">Score 5 = (best)</label>
                        <input
                          type="text"
                          value={anchor.max}
                          onChange={e => {
                            const newAnchors = { ...anchors, [dim]: { ...anchor, max: e.target.value } };
                            setFormData({ ...formData, scoringConfig: { ...formData.scoringConfig, scoringAnchors: newAnchors } as any });
                          }}
                          placeholder="e.g. Native-level, effortless to read"
                          className="w-full bg-black border border-zinc-800 p-2 text-zinc-300 text-xs outline-none focus:border-emerald-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {enableGuidelines && (
              <>
                <SectionHeader title="EVALUATION RUBRICS" />
            <div className="space-y-6">
              {formData.rubrics.map((r, i) => (
                <div key={i} className={`border-l-4 p-6 bg-black border-y border-r border-zinc-800 relative ${r.type === 'reward' ? 'border-l-emerald-500' : r.type === 'penalty' ? 'border-l-red-500' : 'border-l-zinc-500'}`}>
                  <button type="button" onClick={() => handleArrayRemove('rubrics', i)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500"><Trash2 size={16}/></button>
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase">Type / Tag</label>
                      <select value={r.type} onChange={e => handleArrayChange('rubrics', i, {...r, type: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none mb-2">
                        <option value="reward">🟢 Reward</option>
                        <option value="penalty">🔴 Penalty</option>
                        <option value="neutral">⚪ Neutral</option>
                      </select>

                      <label className="text-[9px] font-mono text-zinc-600 uppercase mt-2 block">Severity</label>
                      <select value={r.severity || 'Medium'} onChange={e => handleArrayChange('rubrics', i, {...r, severity: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none mb-2">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>

                      <label className="text-[9px] font-mono text-zinc-600 uppercase mt-2 block">Tag Name</label>
                      <input required type="text" value={r.tag} onChange={e => handleArrayChange('rubrics', i, {...r, tag: e.target.value})} placeholder="e.g. Natural Sheng" className="w-full bg-zinc-950 border border-zinc-800 p-2 text-white text-xs outline-none" />
                    </div>
                    <div className="col-span-9 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-mono text-zinc-600 uppercase">Description</label>
                          <input required type="text" value={r.description} onChange={e => handleArrayChange('rubrics', i, {...r, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none" />
                        </div>
                        <div className="w-24 space-y-1">
                          <label className="text-[9px] font-mono text-zinc-600 uppercase">Weight</label>
                          <input type="number" step="0.1" value={r.weight} onChange={e => handleArrayChange('rubrics', i, {...r, weight: parseFloat(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-emerald-500 uppercase">Positive Example</label>
                          <input type="text" value={r.positiveExample} onChange={e => handleArrayChange('rubrics', i, {...r, positiveExample: e.target.value})} className="w-full bg-emerald-950/20 border border-emerald-900/50 p-2 text-emerald-200 text-xs outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-red-500 uppercase">Negative Example</label>
                          <input type="text" value={r.negativeExample} onChange={e => handleArrayChange('rubrics', i, {...r, negativeExample: e.target.value})} className="w-full bg-red-950/20 border border-red-900/50 p-2 text-red-200 text-xs outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                          <input type="checkbox" checked={r.required} onChange={e => handleArrayChange('rubrics', i, {...r, required: e.target.checked})} className="accent-indigo-500" /> Required
                        </label>
                        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                          <input type="checkbox" checked={r.conditional} onChange={e => handleArrayChange('rubrics', i, {...r, conditional: e.target.checked})} className="accent-indigo-500" /> Conditional (Triggered by Buyer)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <button type="button" onClick={() => handleArrayAdd('rubrics', { tag: '', type: 'reward', weight: 1.0, severity: 'Medium', description: '', required: true, conditional: false })} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-sm">+ Add Reward</button>
                <button type="button" onClick={() => handleArrayAdd('rubrics', { tag: '', type: 'penalty', weight: 1.0, severity: 'Medium', description: '', required: true, conditional: false })} className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-sm">+ Add Penalty</button>
              </div>
            </div>
            <SectionHeader title="GOLDEN EXAMPLES" />
            <div className="space-y-6">
              <p className="text-xs text-zinc-500 mb-6">Shown to labellers as calibration before they begin. Must pass these to unlock the live dataset.</p>
              {formData.goldenExamples.map((ex, i) => (
                <div key={i} className="bg-black border border-zinc-800 p-6 relative">
                  <button type="button" onClick={() => handleArrayRemove('goldenExamples', i)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500"><Trash2 size={16}/></button>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Prompt Context</label>
                      <textarea required value={ex.promptContext} onChange={e => handleArrayChange('goldenExamples', i, {...ex, promptContext: e.target.value})} rows={2} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase">Response A</label>
                        <textarea required value={ex.responseA} onChange={e => handleArrayChange('goldenExamples', i, {...ex, responseA: e.target.value})} rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase">Response B</label>
                        <textarea required value={ex.responseB} onChange={e => handleArrayChange('goldenExamples', i, {...ex, responseB: e.target.value})} rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none" />
                      </div>
                    </div>
                    <div className="flex gap-6 items-end">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase">Correct Preference</label>
                        <select value={ex.correctPreference} onChange={e => handleArrayChange('goldenExamples', i, {...ex, correctPreference: e.target.value})} className="w-32 bg-indigo-950/30 border border-indigo-500/50 p-3 text-indigo-300 font-bold text-sm outline-none">
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="Tie">Tie</option>
                        </select>
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase">Explanation (Why?)</label>
                        <input required type="text" value={ex.explanation} onChange={e => handleArrayChange('goldenExamples', i, {...ex, explanation: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-300 text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('goldenExamples', { promptContext: '', responseA: '', responseB: '', correctPreference: 'A', explanation: '' })} className="text-[10px] font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-sm">+ Add Golden Example</button>
            </div>
            <SectionHeader title="EDGE CASES" />
            <div className="space-y-4">
              {formData.edgeCases.map((ec, i) => (
                <div key={i} className="flex gap-4 items-start bg-black border border-zinc-800 p-4">
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-5 space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Trigger Scenario</label>
                      <input required type="text" value={ec.trigger} onChange={e => handleArrayChange('edgeCases', i, {...ec, trigger: e.target.value})} placeholder="e.g. Prompt contains code-switching" className="w-full bg-zinc-950 border border-zinc-800 p-2 text-white text-xs outline-none" />
                    </div>
                    <div className="col-span-5 space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Guidance</label>
                      <input required type="text" value={ec.guidance} onChange={e => handleArrayChange('edgeCases', i, {...ec, guidance: e.target.value})} placeholder="e.g. Do not penalize if it mirrors prompt register" className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Type</label>
                      <select value={ec.type} onChange={e => handleArrayChange('edgeCases', i, {...ec, type: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 text-xs outline-none">
                        <option value="Warning">Warning</option>
                        <option value="Hard Block">Hard Block</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleArrayRemove('edgeCases', i)} className="p-2 mt-4 text-red-500 hover:bg-red-950"><Trash2 size={16}/></button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('edgeCases', { trigger: '', guidance: '', type: 'Warning' })} className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest bg-purple-500/10 px-4 py-2 rounded-sm">+ Add Edge Case</button>
            </div>
              </>
            )}
            <SectionHeader title="ADJUDICATION POLICY" />
            <div className="bg-black border border-zinc-800 p-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Annotation Mode</label>
                <div className="space-y-3">
                  {['Single', 'Double', 'Double + Adjudication'].map(m => (
                    <label key={m} className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                      <input type="radio" name="annotationMode" checked={formData.adjudicationPolicy.annotationMode === m} onChange={() => setFormData({...formData, adjudicationPolicy: {...formData.adjudicationPolicy, annotationMode: m}})} className="accent-indigo-500 w-4 h-4" />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Conflict Threshold</label>
                  <input type="text" value={formData.adjudicationPolicy.conflictThreshold} onChange={e => setFormData({...formData, adjudicationPolicy: {...formData.adjudicationPolicy, conflictThreshold: e.target.value}})} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Escalate To</label>
                  <div className="flex gap-6">
                    {['Senior Annotator', 'Admin'].map(t => (
                      <label key={t} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                        <input type="radio" name="escalateTo" checked={formData.adjudicationPolicy.escalateTo === t} onChange={() => setFormData({...formData, adjudicationPolicy: {...formData.adjudicationPolicy, escalateTo: t}})} className="accent-indigo-500 w-4 h-4" />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <SectionHeader title="AI REVIEW CONFIG" />
            <div className="bg-[#0A0A0A] border border-zinc-800 p-8 space-y-6">
              <p className="text-xs text-zinc-500 font-sans">
                Configure automated AI reviews (via LLM verification probes) to validate labeller submissions against guidelines before finalizing assets.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Enable AI Review</label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.aiReviewConfig?.enableAIReview || false} 
                      onChange={e => setFormData({
                        ...formData,
                        aiReviewConfig: { ...formData.aiReviewConfig, enableAIReview: e.target.checked }
                      })} 
                      className="accent-indigo-500 w-4 h-4" 
                    /> 
                    Yes, run AI loop
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">AI Review Model</label>
                  <select 
                    value={formData.aiReviewConfig?.modelName || 'gpt-4o'} 
                    onChange={e => setFormData({
                      ...formData,
                      aiReviewConfig: { ...formData.aiReviewConfig, modelName: e.target.value }
                    })} 
                    className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="gpt-4o">gpt-4o (Default)</option>
                    <option value="gpt-4-turbo">gpt-4-turbo</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Model Temperature</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min={0} 
                      max={1} 
                      step={0.1} 
                      value={formData.aiReviewConfig?.temperature ?? 0.1} 
                      onChange={e => setFormData({
                        ...formData,
                        aiReviewConfig: { ...formData.aiReviewConfig, temperature: parseFloat(e.target.value) || 0 }
                      })} 
                      className="w-full accent-indigo-500" 
                    />
                    <span className="text-sm font-mono text-white">{formData.aiReviewConfig?.temperature ?? 0.1}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">System Prompt / Review Criteria</label>
                <textarea 
                  value={formData.aiReviewConfig?.systemPrompt || ''} 
                  onChange={e => setFormData({
                    ...formData,
                    aiReviewConfig: { ...formData.aiReviewConfig, systemPrompt: e.target.value }
                  })} 
                  rows={4} 
                  placeholder="e.g. You are an expert AI quality inspector. Check the labeller's ranking, dimensional scores, and rationale..." 
                  className="w-full bg-black border border-zinc-800 p-4 text-white text-sm outline-none resize-none focus:border-indigo-500" 
                />
              </div>
            </div>

            <div className="mt-12 flex gap-4 pt-8 border-t border-zinc-800">
              <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={loading} className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-[10px] uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                Save as Draft
              </button>
              <button type="button" onClick={(e) => handleSubmit(e, 'published')} disabled={loading} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(99,102,241,0.2)] flex justify-center items-center gap-2">
                Publish Protocol
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {templates.map((t: any) => (
              <div key={t._id} className="bg-[#0A0A0A] border border-zinc-800 p-6 flex flex-col hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all relative group cursor-pointer" onClick={() => {
                setFormData({
                  ...t,
                  antiPatterns: t.antiPatterns || [],
                  labellerConfig: t.labellerConfig || {
                    labellerTier: t.labellerTier || 'Verified',
                    labellerCount: 3,
                    timeframeDays: 14
                  },
                  aiReviewConfig: t.aiReviewConfig || {
                    enableAIReview: false,
                    modelName: 'gpt-4o',
                    temperature: 0.1,
                    systemPrompt: ''
                  },
                  scoringConfig: {
                    ...t.scoringConfig,
                    dimensionWeights: t.scoringConfig?.dimensionWeights || t.scoringConfig?.scoreDimensions?.map(() => 1.0) || []
                  }
                });
                setEnableGuidelines(!!(t.buyerVisibleSummary || t.baseDirectives?.length > 0 || t.rubrics?.length > 0 || t.goldenExamples?.length > 0));
                setEnableAnnotations(!!(t.scoringConfig?.taskTypes?.length > 0 || t.scoringConfig?.requireRationale));
                setIsCreating(true);
              }}>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className={`text-[9px] font-mono px-2 py-1 rounded-sm uppercase ${t.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {t.status}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded-sm uppercase">v{t.version}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }} className="text-zinc-600 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
                <p className="text-zinc-500 text-xs flex-1 mb-6 leading-relaxed line-clamp-3">{t.buyerVisibleSummary}</p>
                
                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                    <span className="flex items-center gap-1"><ShieldCheck size={12}/> {t.labellerConfig?.labellerTier || t.labellerTier || 'Verified'}</span>
                    <span>{t.rubrics?.length || 0} Rubrics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.domains?.map((d: string) => (
                      <span key={d} className="text-[9px] font-mono text-indigo-300 bg-indigo-950/30 border border-indigo-500/20 px-2 py-1 rounded-sm">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {templates.length === 0 && !loading && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800 bg-[#050505]">
                <FileJson size={48} className="text-zinc-800 mb-4" />
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No protocol templates found</p>
                <button onClick={() => setIsCreating(true)} className="mt-6 text-indigo-400 text-xs hover:text-indigo-300 underline underline-offset-4 font-mono">Create your first template</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
