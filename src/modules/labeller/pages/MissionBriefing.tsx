import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Terminal, Zap, Target,
  ChevronRight, Activity, Database,
  ArrowLeft, Clock, ShieldCheck, Lock,
  Layers, Cpu, TrendingUp
} from 'lucide-react';
import { datasetService } from '../../admin/services/datasetService';
import { useTaskStore } from '../store/taskStore';
import toast from 'react-hot-toast';

export const MissionBriefing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await datasetService.fetchDatasetById(id!);
        setDataset(data);
        // Simulate availability scan
        setTimeout(() => setScanComplete(true), 1800);
      } catch (err) {
        toast.error("Failed to retrieve mission directives.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleInitialize = async () => {
    setClaiming(true);
    try {
      toast.loading("Locking session node...", { id: 'claim' });
      await (useTaskStore.getState() as any).claimBatch(id);
      toast.success("Batch reserved. Synchronizing workspace.", { id: 'claim' });
      navigate('/labeller/workbench');
    } catch (err: any) {
      toast.error(err.message || "No available batches detected.", { id: 'claim' });
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#020203] flex flex-col items-center justify-center font-mono gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border border-indigo-500/20 flex items-center justify-center">
            <Activity className="animate-spin text-indigo-500" size={20} />
          </div>
          <div className="absolute inset-0 rounded-full border border-indigo-500/10 animate-ping" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[10px] text-indigo-400 uppercase tracking-[0.4em]">Initializing_Briefing_Stream</p>
          <p className="text-[9px] text-zinc-700 uppercase tracking-widest">Fetching mission directives...</p>
        </div>
      </div>
    );
  }

  const assetCount = dataset?.rows || dataset?.metadata?.numRecords || '—';
  const batchSize = dataset?.batchSize || dataset?.metadata?.batchSize || 10;
  const description = dataset?.description && dataset.description.length > 5
    ? dataset.description
    : 'Standard VeraLabel annotation protocol applies. High-fidelity labeling required for this node.';
  const yield_ = dataset?.pricePerBatch ? `$${dataset.pricePerBatch}` : '$0.00';
  const complexityLabel =
    dataset?.labellingMethod === 'rlhf'
      ? 'High — RLHF'
      : dataset?.labellingMethod === 'transcription'
      ? 'High — Transcription'
      : dataset?.labellingMethod === 'annotation'
      ? 'Medium — Annotation'
      : dataset?.labellingMethod === 'classification'
      ? 'Low — Classification'
      : 'Medium';
  const sessionTimeout = dataset?.timeLimit ? `${dataset.timeLimit} Minutes` : '30 Minutes';

  return (
    <div className="fixed inset-0 z-[100] bg-[#020203] flex flex-col font-mono overflow-hidden animate-in fade-in duration-500">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }}
      />
      <header className="relative z-10 h-14 border-b border-zinc-900 flex items-center justify-between px-8 shrink-0 bg-black/80 backdrop-blur-sm">
        <button
          onClick={() => navigate('/labeller/work')}
          className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          Exit_Registry
        </button>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Node_Secure // {id?.slice(0, 8)}</span>
        </div>
      </header>
      <div className="relative z-10 flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden border-r border-zinc-900">
          <div className="px-12 pt-10 pb-8 border-b border-zinc-900 shrink-0 relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative">
              <div className="flex items-center gap-2 text-indigo-500 mb-5 text-[10px] uppercase tracking-[0.35em] font-bold">
                <Terminal size={13} />
                Mission_Briefing_Protocol_V2
              </div>

              <div className="flex gap-6 items-stretch mb-7">
                <div className="w-[3px] bg-gradient-to-b from-indigo-500 to-indigo-500/0 rounded-full shrink-0" />
                <div>
                  <h1 className="text-5xl font-bold text-white italic leading-tight tracking-tight">
                    {dataset?.name || 'Unidentified_Node'}
                  </h1>
                  {dataset?.domain && (
                    <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-widest font-bold">
                      Domain: {dataset.domain}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Pill icon={<Database size={10} />} text={`${assetCount} Assets`} />
                <Pill icon={<ShieldCheck size={10} />} text="Tier_1_Encryption" color="text-emerald-400 border-emerald-900/60 bg-emerald-950/30" />
                <Pill icon={<Lock size={10} />} text="Encrypted_Stream" color="text-indigo-400 border-indigo-900/60 bg-indigo-950/30" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-12 py-8 space-y-6">
            <div>
              <SectionLabel label="Operational_Directives" />
              <div className="bg-zinc-950 border border-zinc-900 p-8 relative overflow-hidden group hover:border-zinc-700 transition-colors">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-indigo-500/60 to-transparent" />
                <p className="text-xl leading-relaxed text-zinc-300 italic pl-4">
                  "{description}"
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Target size={14} className="text-indigo-500" />}
                title="Target_Accuracy"
                value="95.0% Required"
                desc="Sessions falling below threshold will be flagged for secondary review."
                accent="indigo"
              />
              <StatCard
                icon={<Clock size={14} className="text-amber-500" />}
                title="Session_Timeout"
                value={sessionTimeout}
                desc="Complete the batch within the window to ensure synchronized payout."
                accent="amber"
              />
              <StatCard
                icon={<Layers size={14} className="text-emerald-500" />}
                title="Batch_Size"
                value={`${batchSize} Tasks / Batch`}
                desc="Each batch is atomic — partial submissions are not counted."
                accent="emerald"
              />
              <StatCard
                icon={<Cpu size={14} className="text-purple-500" />}
                title="Protocol_Complexity"
                value={complexityLabel}
                desc="Requires semantic judgment and multi-factor evaluation per task."
                accent="purple"
              />
            </div>

          </div>
        </div>
        <div className="w-[280px] shrink-0 flex flex-col bg-black/40">
          <div className="p-8 border-b border-zinc-900">
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2">Session_Yield</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-emerald-400 tabular-nums tracking-tight">{yield_}</span>
              <TrendingUp size={16} className="text-emerald-500 mb-1.5" />
            </div>
            <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest mt-1">Per_Batch_Finalized</p>
          </div>
          <div className="p-8 space-y-5 border-b border-zinc-900 flex-1">
            <SidebarStat label="Unit Size" value={`${batchSize} Tasks / Batch`} />
            <SidebarStat label="Complexity" value={complexityLabel} valueColor="text-amber-400" />
            <SidebarStat
              label="Batch Availability"
              value={scanComplete ? 'Available ✓' : 'Scanning...'}
              valueColor={scanComplete ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'}
            />
            <SidebarStat label="Timeout" value={sessionTimeout} valueColor="text-indigo-400" />
            <div className="mt-6 border border-zinc-900 bg-zinc-950 p-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-indigo-950/50 border border-indigo-900/50 flex items-center justify-center shrink-0">
                <Zap size={14} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Fast_Sync_Active</p>
                <p className="text-[9px] text-zinc-600">Neural-optimized rendering.</p>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <button
              onClick={handleInitialize}
              disabled={claiming}
              className={`w-full flex items-center justify-between px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all group relative overflow-hidden ${
                claiming
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-indigo-50 shadow-[0_0_30px_rgba(99,102,241,0.15)] active:scale-95'
              }`}
            >
              {claiming ? (
                <>
                  <span>Locking_Node...</span>
                  <Activity size={14} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Initialize_Batch</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[9px] text-zinc-700 text-center leading-relaxed uppercase tracking-widest">
              Reserves this batch for the next 30 minutes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────────── */

const Pill = ({ icon, text, color = 'text-zinc-400 border-zinc-800 bg-zinc-950' }: any) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest ${color}`}>
    {icon} {text}
  </span>
);

const SectionLabel = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">{label}</span>
    <div className="flex-1 h-px bg-zinc-900" />
  </div>
);

const StatCard = ({ icon, title, value, desc, accent }: any) => {
  const accentMap: Record<string, string> = {
    indigo: 'border-t-indigo-500/40',
    amber: 'border-t-amber-500/40',
    emerald: 'border-t-emerald-500/40',
    purple: 'border-t-purple-500/40',
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-900 border-t-2 ${accentMap[accent]} p-6 space-y-3 hover:bg-zinc-900/50 transition-colors`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-[10px] text-zinc-600 leading-relaxed">{desc}</p>
    </div>
  );
};

const SidebarStat = ({ label, value, valueColor = 'text-zinc-300' }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] text-zinc-600">{label}</span>
    <span className={`font-mono text-sm font-bold ${valueColor}`}>{value}</span>
  </div>
);
