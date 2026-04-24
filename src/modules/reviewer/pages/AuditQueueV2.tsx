import React, { useState, useCallback, useEffect } from 'react';
import { 
  ChevronRight, CheckCircle, 
  ArrowLeft, Activity, Play, Mic2,
  ThumbsUp, ThumbsDown, Flag, Clock
} from 'lucide-react';
import { LinguisticTaskRenderer, ImageTaskRenderer, AudioTaskRenderer, RLHFFeedbackPanel, type LinguisticTask, type ImageTask, type AudioTask, type RLHFFeedback } from '../components';
import { useSidebar } from '../../../shared/hooks/useSidebar';
import { detectDeviceCapabilities } from '../../../shared/utils/deviceCapabilities';

type TaskType = 'LINGUISTIC' | 'IMAGE' | 'AUDIO' | 'MEDICAL';
type VerdictType = 'APPROVE' | 'REJECT' | 'FLAG' | null;
type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

type Task = LinguisticTask | ImageTask | AudioTask;

interface Project {
  id: string;
  name: string;
  taskType: TaskType;
  description?: string;
  stats?: {
    completed: number;
    flagged: number;
    total: number;
  };
  tasks: Task[];
}

const createProject = (data: Omit<Project, 'stats'>): Project => ({
  ...data,
  stats: {
    completed: 0,
    flagged: 0,
    total: data.tasks.length
  }
});

const assignedProjects: Project[] = [
  createProject({
    id: "PROJ-NB-001",
    name: "Sheng_Dialect_Audit",
    taskType: 'LINGUISTIC',
    description: "Verify AI dialect classification on urban speech samples",
    tasks: [
      {
        id: "T1", signal: "SIG-001", taskType: 'LINGUISTIC',
        text: "Uyu msee anadai mapeni mingi sana kwa ile risto.",
        highlight: "mapeni",
        aiDiagnostic: { match: "Urban_Slang", confidence: 0.82, category: "Finance", riskLevel: "MEDIUM" },
        note: "Slang for money in urban context.",
        metadata: { priority: 'HIGH', estimatedTime: 45 }
      },
      {
        id: "T2", signal: "SIG-002", taskType: 'LINGUISTIC',
        text: "Mbogi ya mtaa inasonga kuelekea market.",
        highlight: "Mbogi",
        aiDiagnostic: { match: "Sheng_Group", confidence: 0.65, category: "Social", riskLevel: "HIGH" },
        note: "Group or gang reference in Sheng.",
        metadata: { priority: 'MEDIUM', estimatedTime: 60 }
      },
      {
        id: "T3", signal: "SIG-003", taskType: 'LINGUISTIC',
        text: "Huyu jamaa ana pesa lakini sio mwalimu.",
        highlight: "pesa",
        aiDiagnostic: { match: "Standard_Swahili", confidence: 0.95, category: "Finance", riskLevel: "LOW" },
        note: "Standard word for money.",
        metadata: { priority: 'LOW', estimatedTime: 30 }
      },
      {
        id: "T4", signal: "SIG-004", taskType: 'LINGUISTIC',
        text: "Kila siku anakula chakula cha mtaani.",
        highlight: "chakula",
        aiDiagnostic: { match: "Street_Food", confidence: 0.78, category: "Noun", riskLevel: "MEDIUM" },
        note: "Street food reference.",
        metadata: { priority: 'MEDIUM', estimatedTime: 35 }
      },
      {
        id: "T5", signal: "SIG-005", taskType: 'LINGUISTIC',
        text: "Rafiki yangu akasoma architecture lakini hajafaulu.",
        highlight: "akasoma",
        aiDiagnostic: { match: "Code_Switch", confidence: 0.72, category: "Verb", riskLevel: "HIGH" },
        note: "English loanword mixed with Swahili conjugation.",
        metadata: { priority: 'HIGH', estimatedTime: 75 }
      }
    ]
  }),
  createProject({
    id: "PROJ-COAST-04",
    name: "Coastal_Swahili_Validation",
    taskType: 'LINGUISTIC',
    description: "Validate coastal dialect features and maritime terminology",
    tasks: [
      {
        id: "T6", signal: "SIG-006", taskType: 'LINGUISTIC',
        text: "Lulu hii ni ya thamani sana katika mkate wa bahari.",
        highlight: "thamani",
        aiDiagnostic: { match: "Coastal_Swahili", confidence: 0.91, category: "Adjective", riskLevel: "LOW" },
        note: "Standard Coastal Swahili with maritime context.",
        metadata: { priority: 'LOW', estimatedTime: 30 }
      },
      {
        id: "T7", signal: "SIG-007", taskType: 'LINGUISTIC',
        text: "Pweza wa bahari unakula samaki na chumvi.",
        highlight: "Pweza",
        aiDiagnostic: { match: "Marine_Terms", confidence: 0.87, category: "Noun_Animal", riskLevel: "LOW" },
        note: "Octopus - coastal marine term with proper context.",
        metadata: { priority: 'MEDIUM', estimatedTime: 40 }
      }
    ]
  }),
  createProject({
    id: "PROJ-IMG-001",
    name: "Document_Text_Extraction",
    taskType: 'IMAGE',
    description: "Verify OCR segmentation and text boundary detection on document images",
    tasks: [
      {
        id: "IMG-T1", signal: "SIG-IMG-001", taskType: 'IMAGE',
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
        regions: [
          { x: 10, y: 15, width: 80, height: 20, label: "Header_Text" },
          { x: 5, y: 40, width: 90, height: 35, label: "Body_Content" },
          { x: 10, y: 80, width: 70, height: 15, label: "Footer_Signature" }
        ],
        expectedSegments: ["Header", "Body", "Footer", "Metadata"],
        aiDiagnostic: { match: "Multi_Region_Detection", confidence: 0.78, category: "OCR", riskLevel: "MEDIUM" },
        note: "Document has overlapping text regions. Verify boundary accuracy especially in body section.",
        metadata: { priority: 'HIGH', estimatedTime: 90 }
      },
      {
        id: "IMG-T2", signal: "SIG-IMG-002", taskType: 'IMAGE',
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        regions: [
          { x: 15, y: 20, width: 70, height: 60, label: "Main_Content_Area" },
          { x: 5, y: 5, width: 90, height: 12, label: "Title_Section" }
        ],
        expectedSegments: ["Title", "Content"],
        aiDiagnostic: { match: "Clean_Document", confidence: 0.92, category: "OCR", riskLevel: "LOW" },
        note: "Well-formatted document with clear demarcation between sections.",
        metadata: { priority: 'LOW', estimatedTime: 60 }
      }
    ]
  }),
  createProject({
    id: "PROJ-AUDIO-01",
    name: "Swahili_Phone_Call_Audit",
    taskType: 'AUDIO',
    description: "Validate speech-to-text transcriptions from customer service calls",
    tasks: [
      {
        id: "AUDIO-T1", signal: "SIG-AUDIO-001", taskType: 'AUDIO',
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        transcriptSegments: [
          { start: 0, end: 4.2, text: "Habari, unatalii nini leo?", confidence: 0.94, flagged: false },
          { start: 4.5, end: 8.1, text: "Nataka kuona bidhaa za elektroniki.", confidence: 0.87, flagged: false },
          { start: 8.5, end: 12.3, text: "Tunazo models nyingi, karibu kuchagua.", confidence: 0.79, flagged: true },
          { start: 12.8, end: 16.4, text: "Presyo ni nini kwa ile mobile ya soko?", confidence: 0.72, flagged: true }
        ],
        aiDiagnostic: { match: "Customer_Service_Dialog", confidence: 0.83, category: "Speech_Recognition", riskLevel: "MEDIUM" },
        note: "Two segments have low confidence transcripts. Verify accuracy of technical terms.",
        metadata: { priority: 'HIGH', estimatedTime: 120, duration: 16.4 }
      },
      {
        id: "AUDIO-T2", signal: "SIG-AUDIO-002", taskType: 'AUDIO',
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        transcriptSegments: [
          { start: 0, end: 3.2, text: "Leo tunajifunza kuhusu kisimu.", confidence: 0.96, flagged: false },
          { start: 3.5, end: 7.1, text: "Kisimu ni lugha iliyotumiwa sana katika Nairobi.", confidence: 0.91, flagged: false },
          { start: 7.4, end: 11.2, text: "Wanavyozungumza watoto wa mtaa.", confidence: 0.88, flagged: false }
        ],
        aiDiagnostic: { match: "Educational_Content", confidence: 0.92, category: "Linguistics", riskLevel: "LOW" },
        note: "High-confidence transcription of educational content. All segments clear.",
        metadata: { priority: 'MEDIUM', estimatedTime: 90, duration: 11.2 }
      }
    ]
  })
];

const getPriorityBadge = (priority?: PriorityLevel) => {
  switch (priority) {
    case 'HIGH': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    case 'LOW': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    default: return 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400';
  }
};

const VerdictPanel: React.FC<{ 
  onVerdict: (verdict: VerdictType) => void;
  isLastTask: boolean;
}> = ({ onVerdict, isLastTask }) => {
  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => onVerdict('REJECT')}
        className="flex items-center gap-2 px-6 py-3 border border-rose-500/50 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all"
      >
        <ThumbsDown size={14} /> Reject
      </button>

      <button 
        onClick={() => onVerdict('FLAG')}
        className="flex items-center gap-2 px-6 py-3 border border-amber-500/50 text-amber-400 hover:text-amber-300 hover:bg-amber-500/5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all"
      >
        <Flag size={14} /> Flag
      </button>

      <button 
        onClick={() => onVerdict('APPROVE')}
        className="flex items-center gap-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]"
      >
        <ThumbsUp size={14} /> Approve
        {!isLastTask && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

const AuditReviewV2 = () => {
  const { setSidebarOpen } = useSidebar();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [verdicts, setVerdicts] = useState<Record<string, VerdictType>>({});

  useEffect(() => {
    if (activeProject) {
      setSidebarOpen(false);
    }
  }, [activeProject, setSidebarOpen]);

  useEffect(() => {
    detectDeviceCapabilities();
  }, []);

  const currentTask = activeProject ? activeProject.tasks[taskIndex] : null;
  const isLastTask = activeProject ? taskIndex >= activeProject.tasks.length - 1 : false;
  const isComplete = !activeProject || taskIndex >= activeProject.tasks.length;

  const handleVerdict = useCallback((verdict: VerdictType) => {
    if (currentTask) {
      setVerdicts(prev => ({ ...prev, [currentTask.id]: verdict }));
      if (!isLastTask) {
        setTaskIndex(prev => prev + 1);
      }
    }
  }, [currentTask, isLastTask]);

  const handleRLHFFeedback = useCallback((feedback: RLHFFeedback) => {
    setRlhfFeedback(prev => [...prev, feedback]);
    console.log('RLHF Feedback recorded:', feedback);
  }, []);

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    setTaskIndex(0);
  };

  if (!activeProject) {
    return (
      <div className="w-full animate-in fade-in duration-700 px-12 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-500 mb-4">
              <Mic2 size={14} />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Linguistic_Review_Engine</span>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tighter leading-none italic">
              Assigned Audits
            </h1>
            <p className="text-zinc-500 font-light text-sm mt-4 max-w-2xl">
              Review linguistically challenging annotations. Each task has been flagged by our AI quality model for human verification.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#050505] border border-zinc-900 p-3 shadow-2xl rounded-sm">
            <Activity size={14} className="text-rose-500" />
            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Active_Projects: {assignedProjects.length}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignedProjects.map(project => (
            <div
              key={project.id}
              className="group relative bg-[#050505] border border-zinc-900 p-8 rounded-sm hover:bg-black transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono font-bold text-rose-500 uppercase tracking-[0.2em]">
                    // LINGUISTIC_NODE
                  </span>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-sm text-[8px] font-mono font-bold uppercase tracking-tighter ${getPriorityBadge('MEDIUM')}`}>
                    <div className="h-1 w-1 rounded-full bg-current animate-pulse" />
                    In_Progress
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Tasks</p>
                  <span className="text-2xl font-bold text-indigo-400 tabular-nums">{project.tasks.length}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight italic mb-2 group-hover:text-indigo-300 transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 line-clamp-2">{project.description}</p>

              <div className="bg-zinc-950 border border-zinc-900 p-4 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Clock size={12} />
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Est. Time:</span>
                </div>
                <span className="text-xs font-bold text-zinc-400">~{Math.ceil(project.tasks.reduce((sum, t) => sum + (t.metadata?.estimatedTime || 30), 0) / 60)}m</span>
              </div>

              <button
                onClick={() => handleProjectSelect(project)}
                className="mt-auto w-full flex items-center justify-center gap-3 py-4 px-6 bg-transparent border border-zinc-800 text-zinc-500 hover:text-white hover:border-rose-500/50 hover:bg-rose-500/5 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all group/btn"
              >
                <Play size={14} className="fill-current opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                Open_Audit
                <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-all" />
              </button>

              <div className="absolute bottom-0 left-0 h-[1px] w-full bg-zinc-900 group-hover:bg-rose-500/50 transition-colors" />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-center opacity-20">
          <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Quality_Assurance_Platform</span>
          <span className="text-[8px] font-mono uppercase tracking-[0.4em]">v4.2.1-Linguistic</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#020408] font-mono flex flex-col animate-in fade-in duration-500">
      <nav className="shrink-0 p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/60 backdrop-blur-md">
        <button
          onClick={() => { setActiveProject(null); setTaskIndex(0); }}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 hover:text-white hover:border-b hover:border-indigo-500 transition-all pb-1"
        >
          <ArrowLeft size={14} /> Back_To_Registry
        </button>

        <div className="flex items-center gap-6">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span className="text-indigo-400 font-black">{activeProject.name}</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="text-[10px] font-bold text-zinc-300 tabular-nums">
            {taskIndex + 1} / {activeProject.tasks.length}
          </div>
        </div>

        <div className="w-48 h-1 bg-zinc-900 overflow-hidden rounded-full">
          <div
            className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e] transition-all duration-300"
            style={{ width: `${((taskIndex + 1) / activeProject.tasks.length) * 100}%` }}
          />
        </div>
      </nav>

      <main className="flex-1 flex flex-col p-12 overflow-y-auto">
        {currentTask && !isComplete ? (
          <div key={currentTask.id} className="w-full max-w-5xl space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            {currentTask.taskType === 'LINGUISTIC' && (
              <LinguisticTaskRenderer task={currentTask as LinguisticTask} />
            )}
            {currentTask.taskType === 'IMAGE' && (
              <ImageTaskRenderer task={currentTask as ImageTask} />
            )}
            {currentTask.taskType === 'AUDIO' && (
              <AudioTaskRenderer task={currentTask as AudioTask} />
            )}
            {verdicts[currentTask.id] && (
              <RLHFFeedbackPanel
                taskId={currentTask.id}
                aiPrediction={currentTask.aiDiagnostic}
                humanVerdict={verdicts[currentTask.id] as 'APPROVE' | 'REJECT' | 'FLAG'}
                onSubmit={handleRLHFFeedback}
              />
            )}
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Audit Complete</h2>
              <p className="text-zinc-500 text-sm">All {activeProject.tasks.length} tasks reviewed successfully.</p>
              <button
                onClick={() => { setActiveProject(null); setTaskIndex(0); }}
                className="mt-6 px-8 py-3 border border-zinc-800 text-zinc-600 hover:text-white rounded-sm text-[10px] font-bold uppercase"
              >
                Return_To_Registry
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 p-8 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex justify-between items-center gap-6">
        <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          Verdict: {currentTask?.id && verdicts[currentTask.id] ? verdicts[currentTask.id] : 'PENDING'}
        </div>
        {currentTask && <VerdictPanel onVerdict={handleVerdict} isLastTask={isLastTask} />}
      </footer>
    </div>
  );
};

export default AuditReviewV2;
