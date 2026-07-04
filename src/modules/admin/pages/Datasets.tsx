import { useState, useEffect, useMemo } from "react";
import {
  Database, CheckCircle, XCircle, Star, ShieldAlert, Globe, Lock, Search,
  Download, Trash2, Terminal, ChevronRight, Activity, User, ExternalLink, RotateCcw, RefreshCw
} from "lucide-react";
import { dataStore } from "../store/datasetManagementStore";
import toast from "react-hot-toast";

const DatasetAdminPage = () => {
  const {
    datasets, getDataset, approveDataset, rejectDataset,
    unpublishDatasetById, publishDatasetById, deleteDataset, loading,
    currentStatus, setCurrentStatus, getDatasetsByStatus, updateDatasetPrice,
    updateDatasetStatus, revokeDatasetBatches, compileDataset, evaluateConsensus,
    updateDatasetPriority
  } = dataStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editBatchPrice, setEditBatchPrice] = useState<string>("");
  const [editMaxLabellers, setEditMaxLabellers] = useState<string>("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isSavingBatchPrice, setIsSavingBatchPrice] = useState(false);
  const [isSavingMaxLabellers, setIsSavingMaxLabellers] = useState(false);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const [revokeConfirm, setRevokeConfirm] = useState(false);
  const [revokeResult, setRevokeResult] = useState<{ revoked: number; tasksReset: number } | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEvaluatingConsensus, setIsEvaluatingConsensus] = useState(false);

  useEffect(() => {
    if (currentStatus === "all") {
      getDataset();
    } else {
      getDatasetsByStatus(currentStatus);
    }
  }, [currentStatus, getDataset, getDatasetsByStatus]);

  const filteredDatasets = useMemo(() => {
    return datasets.filter((d) => {
      const val = (d as unknown as Record<string, unknown>)[searchType]?.toString().toLowerCase() || "";
      return val.includes(searchTerm.toLowerCase());
    });
  }, [datasets, searchTerm, searchType]);

  const selectedDataset = useMemo(
    () => datasets.find((d) => (d.datasetId ?? String(d._id)) === selectedId),
    [datasets, selectedId]
  );

  const selectedDatasetId = selectedId;

  const totalTasks = selectedDataset ? ((selectedDataset as any).totalTasksCount ?? 0) : 0;
  const maxLabellers = selectedDataset ? ((selectedDataset as any).maxLabellers ?? 1) : 1;
  const totalWorkUnits = totalTasks * maxLabellers;
  const submittedTasks = selectedDataset ? ((selectedDataset as any).submittedTasksCount ?? 0) : 0;
  const verifiedTasks = selectedDataset ? ((selectedDataset as any).verifiedTasksCount ?? 0) : 0;
  const completedTasks = submittedTasks + verifiedTasks;
  const remainingTasks = Math.max(0, totalWorkUnits - completedTasks);
  const percentCompleted = totalWorkUnits > 0 ? (completedTasks / totalWorkUnits) * 100 : 0;

  const registryStats = useMemo(() => {
    const visibleCount = filteredDatasets.length;
    const liveCount = filteredDatasets.filter((d) => d.isPublished).length;
    const pendingCount = filteredDatasets.filter((d) => (d as any).status === "pending").length;
    const customCount = filteredDatasets.filter((d) => (d as any).type === "custom").length;
    const ratings = filteredDatasets.map((d) => d.rating || 0).filter((r) => r > 0);
    const averageRating = ratings.length ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
    return {
      totalCount: datasets.length,
      visibleCount,
      liveCount,
      pendingCount,
      customCount,
      averageRating,
    };
  }, [datasets.length, filteredDatasets]);

  const ecosystemIoU = useMemo(() => {
    const values = datasets
      .map((d) => (d as any).consensusIoU)
      .filter((v): v is number => v !== undefined && v !== null);
    if (!values.length) return null;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }, [datasets]);

  const formatCurrency = (value: string | number | undefined) => {
    const n = parseFloat(String(value ?? 0));
    return `$${(Number.isNaN(n) ? 0 : n).toFixed(2)}`;
  };

  useEffect(() => {
    setRevokeConfirm(false);
    setRevokeResult(null);
  }, [selectedId]);

  useEffect(() => {
    if (selectedDataset) {
      setEditPrice(selectedDataset.price?.toString() || "0");
      setEditBatchPrice((selectedDataset as any).pricePerBatch?.toString() || "0");
      setEditMaxLabellers((selectedDataset as any).maxLabellers?.toString() || "1");
    }
  }, [selectedDataset]);

  const { updateDatasetBatchPrice, updateDatasetMaxLabellers } = dataStore();

  const handleUpdatePrice = async () => {
    if (!selectedId) return;
    setIsSavingPrice(true);
    try {
      await updateDatasetPrice(selectedId, parseFloat(editPrice));
    } finally {
      setIsSavingPrice(false);
    }
  };

  const handleUpdateBatchPrice = async () => {
    if (!selectedId) return;
    setIsSavingBatchPrice(true);
    try {
      await updateDatasetBatchPrice(selectedId, parseFloat(editBatchPrice));
    } finally {
      setIsSavingBatchPrice(false);
    }
  };

  const handleUpdateMaxLabellers = async () => {
    if (!selectedId) return;
    setIsSavingMaxLabellers(true);
    try {
      await updateDatasetMaxLabellers(selectedId, parseInt(editMaxLabellers, 10));
    } finally {
      setIsSavingMaxLabellers(false);
    }
  };

  const handleStatusOverride = async (newStatus: string) => {
    if (!selectedId) return;
    await updateDatasetStatus(selectedId, newStatus);
  };

  const handleRevokeDatasetBatches = async () => {
    if (!selectedId) return;
    if (!revokeConfirm) {
      setRevokeConfirm(true);
      setTimeout(() => setRevokeConfirm(false), 5000);
      return;
    }
    setIsRevoking(true);
    setRevokeConfirm(false);
    try {
      const result = await revokeDatasetBatches(selectedId);
      setRevokeResult(result);
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCompileDataset = async () => {
    if (!selectedId) return;
    setIsCompiling(true);
    try {
      await compileDataset(selectedId);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleGenerateEmbeddings = async () => {
    if (!selectedId) return;
    setIsGeneratingEmbeddings(true);
    try {
      const { api } = await import("../../../shared/types/api");
      const response = await api.post(`/tasks/generate-missing-embeddings`, { datasetId: selectedId });
      const { triggeredCount, failedCount, skippedCount } = response.data?.data || {};
      
      let msg = "Generation complete!";
      if (triggeredCount !== undefined) {
        msg = `Triggered: ${triggeredCount} | Failed: ${failedCount} | Skipped: ${skippedCount}`;
      }
      
      if (failedCount > 0) {
        toast.error(`Completed with errors: ${msg}`);
      } else {
        toast.success(msg);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to trigger generation");
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  const handleEvaluateConsensus = async () => {
    if (!selectedId) return;
    setIsEvaluatingConsensus(true);
    try {
      await evaluateConsensus(selectedId);
    } finally {
      setIsEvaluatingConsensus(false);
    }
  };

  const handleDownloadCompiledDataset = async (datasetId: string) => {
    setIsDownloading(true);
    try {
      const { api } = await import("../../../shared/types/api");
      const response = await api.get(`/datasets/${datasetId}/download`);
      const downloadUrl = response.data?.data?.downloadUrl || response.data?.downloadUrl;
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        toast.error("Failed to generate download URL");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Download failed";
      toast.error(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  const showCompileButton = useMemo(() => {
    if (!selectedDataset) return false;
    const isCustom = (selectedDataset as any).type === "custom";
    const total = (selectedDataset as any).totalTasksCount ?? 0;
    const verified = (selectedDataset as any).verifiedTasksCount ?? 0;
    const hasDownloadUrl = !!(selectedDataset as any).downloadUrl;
    return isCustom && total > 0 && verified === total && !hasDownloadUrl;
  }, [selectedDataset]);

  return (
    <div className="w-full min-h-0 flex flex-col gap-6 pb-6 text-zinc-100">
      <section className="rounded-3xl border border-zinc-900 bg-[#050505] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="relative p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.14),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.08),_transparent_36%)] pointer-events-none" />
          <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-indigo-400">
                <Terminal size={14} />
                <span className="font-mono text-[10px] uppercase tracking-[0.42em] font-bold">Admin_Registry_Root</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Dataset Inventory</h1>
                <p className="mt-3 text-sm md:text-base text-zinc-500 max-w-2xl leading-6">
                  Browse datasets as a working registry, select a row, and inspect or update its operational state without losing the table.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[680px]">
              <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 backdrop-blur-sm">
                <div className="text-[8px] uppercase tracking-[0.35em] text-zinc-600 font-mono">Total</div>
                <div className="mt-2 text-2xl font-black text-white tabular-nums">{registryStats.totalCount}</div>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 backdrop-blur-sm">
                <div className="text-[8px] uppercase tracking-[0.35em] text-zinc-600 font-mono">Visible</div>
                <div className="mt-2 text-2xl font-black text-indigo-400 tabular-nums">{registryStats.visibleCount}</div>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 backdrop-blur-sm">
                <div className="text-[8px] uppercase tracking-[0.35em] text-zinc-600 font-mono">Live</div>
                <div className="mt-2 text-2xl font-black text-emerald-400 tabular-nums">{registryStats.liveCount}</div>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 backdrop-blur-sm">
                <div className="text-[8px] uppercase tracking-[0.35em] text-zinc-600 font-mono">Avg Rating</div>
                <div className="mt-2 text-2xl font-black text-amber-400 tabular-nums">{registryStats.averageRating.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-900 bg-[#050505] p-4 md:p-5 shadow-[0_16px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All_Datasets" },
              { id: "pending", label: "Pending_Review" },
              { id: "approved", label: "Approved" },
              { id: "rejected", label: "Rejected" },
              { id: "flagged", label: "Flagged" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentStatus(tab.id as any)}
                className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${currentStatus === tab.id
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.18)]"
                    : "border-zinc-800 bg-black/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
            {ecosystemIoU !== null && (
              <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3 text-right">
                <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Ecosystem IoU</div>
                <div className="mt-1 text-lg font-black text-indigo-400 tabular-nums">{(ecosystemIoU * 100).toFixed(2)}%</div>
              </div>
            )}

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-black/60 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white">
              <Download size={14} /> Export_Log
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black px-4 py-3 w-full lg:w-[220px]">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap">Filter_By:</span>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full bg-transparent text-[10px] font-mono font-bold uppercase text-indigo-400 outline-none"
            >
              <option value="name">Name</option>
              <option value="owner">Owner</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
            <input
              type="text"
              placeholder="Search registry..."
              className="w-full rounded-2xl border border-zinc-800 bg-black px-11 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1.35fr)_420px]">
        <section className="min-h-[680px] overflow-hidden rounded-3xl border border-zinc-900 bg-[#050505] shadow-[0_20px_70px_rgba(0,0,0,0.35)] flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-4 md:px-6">
            <div>
              <div className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-600">Registry Table</div>
              <div className="mt-1 text-sm text-zinc-400">{registryStats.visibleCount} assets visible in the current filter</div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              <span>{registryStats.pendingCount} pending</span>
              <span className="text-zinc-800">/</span>
              <span>{registryStats.customCount} custom</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="min-w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-zinc-900">
                <tr>
                  <th className="px-5 py-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic md:px-6">// Dataset_Object</th>
                  <th className="px-5 py-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Status</th>
                  <th className="px-5 py-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic hidden sm:table-cell">// Batch_Yield</th>
                  <th className="px-5 py-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic hidden sm:table-cell">// Quality</th>
                  <th className="px-5 py-4 w-10 md:px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredDatasets.map((item) => {
                  const id = item.datasetId ?? String(item._id);
                  const isActive = selectedId === id;
                  return (
                    <tr
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`group cursor-pointer transition-colors ${isActive ? "bg-indigo-500/10" : "hover:bg-zinc-900/40"}`}
                    >
                      <td className="px-5 py-5 md:px-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-11 w-11 shrink-0 border flex items-center justify-center rounded-2xl transition-colors ${isActive ? "border-indigo-500 bg-indigo-500/15 text-indigo-300" : "border-zinc-800 bg-black text-zinc-700"}`}>
                            <Database size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-bold text-zinc-100 text-sm tracking-tight">{item.name || "UNNAMED"}</div>
                              {(item as any).type === "custom" && (
                                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.25em] text-indigo-300">Custom</span>
                              )}
                            </div>
                            <div className="mt-1 truncate text-[9px] font-mono uppercase text-zinc-600">{id.slice(0, 12)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5"><StatusBadge published={item.isPublished} status={(item as any).status} /></td>
                      <td className="px-5 py-5 hidden sm:table-cell">
                        <span className="text-xs font-mono font-bold text-emerald-400">{formatCurrency((item as any).pricePerBatch || 0)}</span>
                      </td>
                      <td className="px-5 py-5 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Star size={10} className="fill-amber-500 text-amber-500" />
                          <span className="text-xs font-mono font-bold text-zinc-400">{item.rating || "0.0"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5 md:px-6">
                        <ChevronRight size={14} className={isActive ? "text-indigo-400" : "text-zinc-800"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loading && <div className="p-10 text-center animate-pulse text-[10px] font-mono text-zinc-700">SYNCHRONIZING...</div>}
          </div>
        </section>

        <aside className={`min-h-[680px] overflow-hidden rounded-3xl border border-zinc-900 bg-[#070708] shadow-[0_20px_70px_rgba(0,0,0,0.35)] flex flex-col ${selectedDataset ? "opacity-100" : "opacity-90"}`}>
          {selectedDataset ? (
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-900 px-6 py-5">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                    <ShieldAlert size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Selected Asset</div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl break-words">{selectedDataset.name}</h2>
                    <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 break-all">UID: {selectedDatasetId}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="rounded-full border border-zinc-800 bg-black px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white">[Close]</button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-7 space-y-6">
                <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                  <div className="bg-black p-4">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Status</div>
                    <div className="mt-2"><StatusBadge published={selectedDataset.isPublished} status={(selectedDataset as any).status} /></div>
                  </div>
                  <div className="bg-black p-4">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Rating</div>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= (selectedDataset.rating || 0) ? "fill-amber-500 text-amber-500" : "text-zinc-800"} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-black p-4">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Market Price</div>
                    <div className="mt-2 text-lg font-bold text-white tabular-nums">{formatCurrency(selectedDataset.price)}</div>
                  </div>
                  <div className="bg-black p-4">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Batch Price</div>
                    <div className="mt-2 text-lg font-bold text-emerald-400 tabular-nums">{formatCurrency((selectedDataset as any).pricePerBatch || 0)}</div>
                  </div>
                  <div className="bg-black p-4">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Max Labellers</div>
                    <div className="mt-2 text-lg font-bold text-indigo-400 tabular-nums">{(selectedDataset as any).maxLabellers || 1}</div>
                  </div>
                  <div className="bg-black p-4">
                    <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Priority</div>
                    <div className="mt-2 text-sm font-bold uppercase text-white tracking-wider">{(selectedDataset as any).priority || "medium"}</div>
                  </div>
                </div>

                <div className="border border-zinc-900 bg-zinc-950 p-5 space-y-4 rounded-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Operational Controls</div>
                      <div className="mt-1 text-sm text-zinc-400">Adjust the live dataset settings from here</div>
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Editable</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Market_Settlement_Price</label>
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded-sm">Current: {formatCurrency(selectedDataset.price)}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-full rounded-sm border border-zinc-800 bg-black py-3 pl-8 pr-4 text-lg font-bold text-white outline-none transition-colors focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <button
                        onClick={handleUpdatePrice}
                        disabled={isSavingPrice || editPrice === selectedDataset.price?.toString()}
                        className="rounded-sm border border-indigo-500/20 bg-indigo-600 px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700"
                      >
                        {isSavingPrice ? "..." : "Save"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                          {selectedDataset.isCollection ? "Bounty_Per_Recording" : "Labeller_Payout"}
                        </label>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded-sm">Current: {formatCurrency((selectedDataset as any).pricePerBatch || 0)}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editBatchPrice}
                            onChange={(e) => setEditBatchPrice(e.target.value)}
                            className="w-full rounded-sm border border-zinc-800 bg-black py-3 pl-8 pr-4 text-lg font-bold text-white outline-none transition-colors focus:border-emerald-500 font-mono"
                          />
                        </div>
                        <button
                          onClick={handleUpdateBatchPrice}
                          disabled={isSavingBatchPrice || editBatchPrice === (selectedDataset as any).pricePerBatch?.toString()}
                          className="rounded-sm border border-emerald-500/20 bg-emerald-600 px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-500 disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700"
                        >
                          {isSavingBatchPrice ? "..." : "Save"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                          {selectedDataset.isCollection ? "Target_Speakers" : "Max_Labellers"}
                        </label>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded-sm">Current: {(selectedDataset as any).maxLabellers || 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"><User size={12} /></span>
                          <input
                            type="number"
                            min="1"
                            value={editMaxLabellers}
                            onChange={(e) => setEditMaxLabellers(e.target.value)}
                            className="w-full rounded-sm border border-zinc-800 bg-black py-3 pl-8 pr-4 text-lg font-bold text-white outline-none transition-colors focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <button
                          onClick={handleUpdateMaxLabellers}
                          disabled={isSavingMaxLabellers || editMaxLabellers === (selectedDataset as any).maxLabellers?.toString() || !editMaxLabellers}
                          className="rounded-sm border border-indigo-500/20 bg-indigo-600 px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700"
                        >
                          {isSavingMaxLabellers ? "..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border border-zinc-900 bg-black/70 p-4">
                    <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Manual_Status_Override</label>
                    <select
                      value={(selectedDataset as any).status || "pending"}
                      onChange={(e) => handleStatusOverride(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-800 bg-black px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-white outline-none transition-colors focus:border-indigo-500"
                    >
                      <option value="pending">Pending_Review</option>
                      <option value="processing">Processing_Active</option>
                      <option value="in_progress">In_Progress</option>
                      <option value="completed">Completed_Success</option>
                      <option value="rejected">Rejected_Failed</option>
                      <option value="cancelled">Cancelled_System</option>
                    </select>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-zinc-900 bg-black/70 p-4">
                    <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest text-indigo-400">Resource_Priority_Protocol</label>
                    <select
                      value={(selectedDataset as any).priority || "medium"}
                      onChange={(e) => updateDatasetPriority(selectedId!, e.target.value)}
                      className="w-full rounded-2xl border border-zinc-800 bg-black px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-white outline-none transition-colors focus:border-indigo-500"
                    >
                      <option value="low">Low_Yield_Standard</option>
                      <option value="medium">Medium_Yield_Active</option>
                      <option value="high">High_Yield_Critical</option>
                      <option value="urgent">Urgent_Market_Sync</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-900 bg-black/60 p-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Technical Manifest</div>
                      <div className="mt-1 text-sm text-zinc-400">Dataset metadata and compliance snapshot</div>
                    </div>
                    <StatusBadge published={selectedDataset.isPublished} status={(selectedDataset as any).status} />
                  </div>

                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900">
                    <QuickStat label="Blueprint" value={(selectedDataset as any).datasetType || "General"} />
                    <QuickStat label="Format" value={selectedDataset.datasetFormat || "N/A"} />
                    <QuickStat label="Workflow Type" value={selectedDataset.isCollection ? "Crowdsourcing" : "Annotation"} />
                    <QuickStat label="Target_Volume" value={(selectedDataset as any).rows?.toLocaleString() || (selectedDataset as any).metadata?.numRecords?.toLocaleString() || (selectedDataset as any).volume || "---"} />
                    <QuickStat label="Finalized" value={(selectedDataset as any).rowsCompleted?.toLocaleString() || "0"} />
                    <QuickStat label="Domain" value={(selectedDataset as any).domain || selectedDataset.category || "N/A"} />
                    <QuickStat label="Labelling" value={(selectedDataset as any).labellingMethod?.toUpperCase() || "N/A"} />
                    <QuickStat label="Content" value={(selectedDataset as any).contentType?.toUpperCase() || "N/A"} />
                    <QuickStat label="Payment" value={selectedDataset.paidAt ? `Settled (${new Date(selectedDataset.paidAt).toLocaleDateString()})` : "Awaiting_Payment"} />
                    <QuickStat label="Total Tasks" value={String(totalTasks)} />
                    <QuickStat label="Submitted Tasks" value={String(submittedTasks)} />
                    <QuickStat label="Verified Tasks" value={String(verifiedTasks)} />
                    <QuickStat label="Progress %" value={`${percentCompleted.toFixed(1)}%`} />
                    <QuickStat label="Remaining Work" value={remainingTasks.toLocaleString()} />
                    <QuickStat label="Consensus IoU" value={(selectedDataset as any).consensusIoU !== undefined && (selectedDataset as any).consensusIoU !== null ? `${((selectedDataset as any).consensusIoU * 100).toFixed(2)}%` : "N/A"} />
                    <QuickStat label="Consensus Status" value={(selectedDataset as any).consensusIoU !== undefined && (selectedDataset as any).consensusIoU !== null ? "Evaluated" : "Unevaluated"} />
                  </div>

                  {/* Beautiful Sleek Progress Bar */}
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-zinc-500">
                      <span>Overall Progress</span>
                      <span className="text-indigo-400 font-bold">{percentCompleted.toFixed(1)}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentCompleted}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-900 bg-[#050505] p-4 flex items-center justify-between">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-600">Lifecycle_Status</span>
                      <span className="text-[9px] font-mono font-bold uppercase italic text-white">{(selectedDataset as any).status || "Awaiting_Review"}</span>
                    </div>
                    <div className="rounded-2xl border border-zinc-900 bg-[#050505] p-4 flex items-center justify-between">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-600">Owner_Node</span>
                      <span className="text-[9px] font-mono font-bold text-indigo-400 break-all">{selectedDataset.datasetOwner?.slice(0, 16)}...</span>
                    </div>
                  </div>
                </div>

                {((selectedDataset as any).fileUrl || (selectedDataset as any).downloadUrl || (selectedDataset as any).sourceLink) && (
                  <div className="rounded-3xl border border-zinc-900 bg-black/60 p-5 space-y-4">
                    <div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Resource Access</div>
                      <div className="mt-1 text-sm text-zinc-400">Compiled assets and source links for the dataset</div>
                    </div>

                    {(selectedDataset as any).downloadUrl ? (
                      <button
                        onClick={() => handleDownloadCompiledDataset(selectedDatasetId ?? String(selectedDataset._id))}
                        disabled={isDownloading}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 disabled:border-zinc-900 disabled:bg-zinc-950 disabled:text-zinc-700 inline-flex items-center justify-center gap-2"
                      >
                        {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                        {isDownloading ? "Generating Link..." : "Download Compiled Dataset"}
                      </button>
                    ) : null}

                    {((selectedDataset as any).fileUrl || (selectedDataset as any).sourceLink) ? (
                      <a
                        href={(selectedDataset as any).fileUrl || (selectedDataset as any).sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 inline-flex items-center justify-center gap-2 text-center"
                      >
                        <ExternalLink size={14} /> Download_Source_Files
                      </a>
                    ) : null}
                  </div>
                )}

                <div className="rounded-3xl border border-zinc-900 bg-black/60 p-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.35em] text-zinc-600">Action Console</div>
                      <div className="mt-1 text-sm text-zinc-400">Approval, publish, consensus, and batch controls</div>
                    </div>
                    {revokeResult && <span className="text-[8px] font-mono text-emerald-400">âœ“ {revokeResult.revoked}b / {revokeResult.tasksReset}t reset</span>}
                  </div>

                  <button
                    onClick={handleEvaluateConsensus}
                    disabled={isEvaluatingConsensus}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-300 transition-colors hover:border-indigo-500 hover:text-white disabled:border-zinc-900 disabled:bg-zinc-950 disabled:text-zinc-700"
                  >
                    {isEvaluatingConsensus ? <RefreshCw size={14} className="animate-spin text-indigo-400" /> : <Activity size={14} className="text-indigo-400" />}
                    {isEvaluatingConsensus ? "Evaluating Consensus..." : "Perform Consensus"}
                  </button>

                  {(selectedDataset.datasetType === "image" || (selectedDataset as any).contentType === "image") && (
                    <button
                      onClick={handleGenerateEmbeddings}
                      disabled={isGeneratingEmbeddings}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-blue-400 transition-colors hover:border-blue-500 hover:text-white disabled:opacity-50"
                    >
                      {isGeneratingEmbeddings ? <RefreshCw size={14} className="animate-spin text-blue-400" /> : <Terminal size={14} className="text-blue-400" />}
                      {isGeneratingEmbeddings ? "Generating..." : "Generate .npy Embeddings"}
                    </button>
                  )}

                  {showCompileButton && (
                    <button
                      onClick={handleCompileDataset}
                      disabled={isCompiling}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-indigo-600 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700"
                    >
                      {isCompiling ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
                      {isCompiling ? "Compiling Dataset..." : "Compile Dataset"}
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton onClick={() => approveDataset(selectedDatasetId!)} icon={<CheckCircle size={14} />} label="APPROVE" color="bg-emerald-600 hover:bg-emerald-500 text-white" />
                    <ActionButton onClick={() => rejectDataset(selectedDatasetId!, "QUALITY")} icon={<XCircle size={14} />} label="REJECT" color="bg-rose-600 hover:bg-rose-500 text-white" />
                  </div>

                  {selectedDataset.isPublished ? (
                    <button
                      onClick={() => unpublishDatasetById(selectedDatasetId!, "REVOKE")}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                    >
                      <Lock size={14} /> Unpublish_Asset
                    </button>
                  ) : (
                    <button
                      onClick={() => publishDatasetById(selectedDatasetId!)}
                      disabled={
                        !(parseFloat(selectedDataset.price) > 0) ||
                        !((selectedDataset as any).status === "approved" || (selectedDataset as any).status === "completed") ||
                        !((selectedDataset as any).rows > 0 || (selectedDataset as any).volume) ||
                        ((selectedDataset as any).rowsCompleted < (selectedDataset as any).rows) ||
                        ((selectedDataset as any).type === "custom" && !selectedDataset.paidAt)
                      }
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-indigo-600 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700"
                    >
                      <Globe size={14} />
                      {(!(parseFloat(selectedDataset.price) > 0) || !((selectedDataset as any).status === "approved" || (selectedDataset as any).status === "completed"))
                        ? "Market_Injection_Locked"
                        : ((selectedDataset as any).type === "custom" && !selectedDataset.paidAt)
                          ? "Payment_Awaiting"
                          : ((selectedDataset as any).rowsCompleted < (selectedDataset as any).rows)
                            ? "Batch_Incomplete"
                            : "Market_Injection"}
                    </button>
                  )}

                  <div className="space-y-3 rounded-2xl border border-zinc-900 bg-[#050505] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-amber-400/70">Batch_Control_Override</span>
                      {revokeResult && <span className="text-[8px] font-mono text-emerald-400">âœ“ {revokeResult.revoked}b / {revokeResult.tasksReset}t reset</span>}
                    </div>
                    <button
                      id={`revoke-batches-${selectedDatasetId}`}
                      onClick={handleRevokeDatasetBatches}
                      disabled={isRevoking}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${revokeConfirm
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-zinc-800 bg-black text-zinc-400 hover:border-amber-500/50 hover:text-amber-300"
                        }`}
                    >
                      {isRevoking ? (
                        <><RefreshCw size={12} className="animate-spin" /> Revoking...</>
                      ) : revokeConfirm ? (
                        <><RotateCcw size={12} /> Confirm_Revoke? (5s)</>
                      ) : (
                        <><RotateCcw size={12} /> Revoke_&amp;_Renew_Batches</>
                      )}
                    </button>
                    <p className="text-[8px] font-mono leading-tight text-zinc-700">
                      Clears all assigned batches for this dataset. Tasks return to pool with a renewed 1h window.
                    </p>
                  </div>

                  <button
                    onClick={() => deleteDataset(selectedDatasetId!, "PURGE")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-900 bg-black px-4 py-3 text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 transition-colors hover:border-rose-500/50 hover:text-rose-400"
                  >
                    <Trash2 size={12} /> System_Purge
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-900 bg-black text-zinc-700">
                  <Database size={18} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">Select an asset</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Choose a dataset from the table to inspect pricing, status, consensus metrics, and actions.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
const StatusBadge = ({ published, status }: { published: boolean, status?: string }) => {
  const s = published ? "live" : status?.toLowerCase() || "pending";

  const config: Record<string, { bg: string, dot: string, text: string, border: string }> = {
    live: { bg: "bg-green-500/10", dot: "bg-green-500 animate-pulse", text: "text-green-500", border: "border-green-500/20" },
    approved: { bg: "bg-green-500/10", dot: "bg-green-500", text: "text-green-500", border: "border-green-500/20" },
    completed: { bg: "bg-green-500/10", dot: "bg-green-500", text: "text-green-500", border: "border-green-500/20" },
    processing: { bg: "bg-blue-500/10", dot: "bg-blue-500 animate-pulse", text: "text-blue-500", border: "border-blue-500/20" },
    in_progress: { bg: "bg-blue-500/10", dot: "bg-blue-500 animate-pulse", text: "text-blue-500", border: "border-blue-500/20" },
    pending: { bg: "bg-amber-500/10", dot: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/20" },
    awaiting_payment: { bg: "bg-amber-500/10", dot: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/20" },
    rejected: { bg: "bg-red-500/10", dot: "bg-red-500", text: "text-red-500", border: "border-red-500/20" },
    failed: { bg: "bg-red-500/10", dot: "bg-red-500", text: "text-red-500", border: "border-red-500/20" },
    cancelled: { bg: "bg-red-500/10", dot: "bg-red-500", text: "text-red-500", border: "border-red-500/20" },
  };

  const { bg, dot, text, border } = config[s] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-sm text-[8px] font-mono font-bold uppercase ${bg} ${text} ${border}`}>
      <div className={`h-1 w-1 rounded-full ${dot}`} />
      {published ? "Live" : status || "Pending"}
    </div>
  );
};

const QuickStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#050505] p-3">
    <div className="text-[7px] font-mono text-zinc-600 uppercase mb-1">{label}</div>
    <div className="text-base font-bold text-white tabular-nums">{value}</div>
  </div>
);

const ActionButton = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${color} rounded-sm active:scale-95`}>
    {icon} {label}
  </button>
);

export default DatasetAdminPage;
