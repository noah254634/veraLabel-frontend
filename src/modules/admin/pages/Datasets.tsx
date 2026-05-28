import { useState, useEffect, useMemo } from "react";
import {
  Database, CheckCircle, XCircle, Star, ShieldAlert, Globe, Lock, Search, 
  Download, Trash2, Terminal, ChevronRight, Layers, FileText, Activity, User, ExternalLink, RotateCcw, RefreshCw
} from "lucide-react";
import { dataStore } from "../store/datasetManagementStore";

const DatasetAdminPage = () => {
  const {
    datasets, getDataset, approveDataset, rejectDataset, 
    unpublishDatasetById, publishDatasetById, deleteDataset, loading,
    currentStatus, setCurrentStatus, getDatasetsByStatus, updateDatasetPrice,
    updateDatasetStatus, revokeDatasetBatches
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
  const [revokeConfirm, setRevokeConfirm] = useState(false);
  const [revokeResult, setRevokeResult] = useState<{ revoked: number; tasksReset: number } | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    if (currentStatus === "all") {
      getDataset();
    } else {
      getDatasetsByStatus(currentStatus);
    }
  }, [currentStatus, getDataset, getDatasetsByStatus]);

  // Optimization: Memoize filtered list to prevent unnecessary re-renders
  const filteredDatasets = useMemo(() => {
    return datasets.filter((d) => {
      const val = (d as unknown as Record<string, unknown>)[searchType]?.toString().toLowerCase() || "";
      return val.includes(searchTerm.toLowerCase());
    });
  }, [datasets, searchTerm, searchType]);

  const selectedDataset = useMemo(() => 
    datasets.find((d) => (d.datasetId ?? String(d._id)) === selectedId),
    [datasets, selectedId]
  );

  useEffect(() => {
    // Reset revoke state when a different dataset is selected
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
      setTimeout(() => setRevokeConfirm(false), 5000); // auto-disarm after 5s
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

  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden gap-6 bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Admin_Registry_Root</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">Dataset Inventory</h1>
        </div>
        
        <button className="bg-zinc-900 border border-zinc-800 px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all rounded-sm flex items-center gap-2 self-start md:self-auto">
          <Download size={14} /> Export_Log
        </button>
      </div>
      <div className="flex gap-2 flex-wrap shrink-0">
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
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${
              currentStatus === tab.id
                ? "bg-indigo-600 text-white border border-indigo-500"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-zinc-950 border border-zinc-900 p-2 flex flex-col md:flex-row items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1.5 w-full md:w-auto">
          <span className="text-[9px] font-mono text-zinc-600 uppercase font-bold whitespace-nowrap">Filter_By:</span>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-transparent text-[10px] font-mono font-bold text-indigo-500 uppercase outline-none cursor-pointer w-full"
          >
            <option value="name">Name</option>
            <option value="owner">Owner</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
          <input
            type="text"
            placeholder={`Search registry...`}
            className="w-full bg-black border border-zinc-800 py-2 pl-10 pr-4 text-xs font-medium text-white outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-800 rounded-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-px bg-zinc-900 border border-zinc-900 overflow-hidden shadow-2xl">
        <div className="flex-1 bg-[#050505] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-zinc-900">
              <tr>
                <th className="p-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Dataset_Object</th>
                <th className="p-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Status</th>
                <th className="p-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic hidden sm:table-cell">// Batch_Yield</th>
                <th className="p-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic hidden sm:table-cell">// Quality</th>
                <th className="p-4 w-10"></th>
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
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 border flex items-center justify-center ${isActive ? "border-indigo-500 text-indigo-400 bg-indigo-500/20" : "border-zinc-800 text-zinc-700 bg-black"}`}>
                          <Database size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-200 text-sm tracking-tight flex items-center gap-2">
                            {item.name || "UNNAMED"}
                            {(item as any).type === 'custom' && (
                              <span className="text-[7px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 rounded-sm">CUSTOM</span>
                            )}
                          </div>
                          <div className="text-[9px] text-zinc-600 font-mono uppercase truncate w-32">{id.slice(0, 12)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge published={item.isPublished} status={(item as any).status} /></td>
                    <td className="p-4 hidden sm:table-cell">
                       <span className="text-xs font-mono font-bold text-emerald-500">${(item as any).pricePerBatch || "0.00"}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Star size={10} className="fill-amber-500 text-amber-500" />
                        <span className="text-xs font-mono font-bold text-zinc-400">{item.rating || "0.0"}</span>
                      </div>
                    </td>
                    <td className="p-4"><ChevronRight size={14} className={isActive ? "text-indigo-500" : "text-zinc-800"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <div className="p-10 text-center animate-pulse text-[10px] font-mono text-zinc-700">SYNCHRONIZING...</div>}
        </div>
        <aside className={`w-full lg:w-[400px] bg-[#0A0A0A] border-l border-zinc-900 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto ${selectedDataset ? "block" : "hidden lg:block lg:opacity-30 lg:pointer-events-none"}`}>
          {selectedDataset ? (
            <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="flex justify-between items-center">
                <ShieldAlert size={20} className="text-indigo-500" />
                <button onClick={() => setSelectedId(null)} className="text-zinc-600 hover:text-white text-[10px] font-mono uppercase">[Close]</button>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white tracking-tighter">{selectedDataset.name}</h2>
                <p className="text-zinc-600 text-[9px] font-mono uppercase">UID: {selectedDataset.datasetId ?? String(selectedDataset._id)}</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Market_Settlement_Price</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full bg-black border border-zinc-800 py-2 pl-7 pr-3 text-lg font-bold text-white outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <button 
                      onClick={handleUpdatePrice}
                      disabled={isSavingPrice || editPrice === selectedDataset.price?.toString()}
                      className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-[10px] font-bold uppercase transition-all rounded-sm"
                    >
                      {isSavingPrice ? "..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest text-emerald-500">Labeller_Payout_Per_Batch (10 Tasks)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editBatchPrice}
                        onChange={(e) => setEditBatchPrice(e.target.value)}
                        className="w-full bg-black border border-zinc-800 py-2 pl-7 pr-3 text-lg font-bold text-emerald-500 outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <button 
                      onClick={handleUpdateBatchPrice}
                      disabled={isSavingBatchPrice || editBatchPrice === (selectedDataset as any).pricePerBatch?.toString()}
                      className="px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-[10px] font-bold uppercase transition-all rounded-sm"
                    >
                      {isSavingBatchPrice ? "..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest text-indigo-400">Max_Labellers_Per_Batch</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs"><User size={12} /></span>
                      <input
                        type="number"
                        min="1"
                        value={editMaxLabellers}
                        onChange={(e) => setEditMaxLabellers(e.target.value)}
                        className="w-full bg-black border border-zinc-800 py-2 pl-8 pr-3 text-lg font-bold text-indigo-400 outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <button 
                      onClick={handleUpdateMaxLabellers}
                      disabled={isSavingMaxLabellers || editMaxLabellers === (selectedDataset as any).maxLabellers?.toString() || !editMaxLabellers}
                      className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-[10px] font-bold uppercase transition-all rounded-sm"
                    >
                      {isSavingMaxLabellers ? "..." : "Save"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-zinc-900/50">
                  <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Manual_Status_Override</label>
                  <select 
                    value={(selectedDataset as any).status || "pending"}
                    onChange={(e) => handleStatusOverride(e.target.value)}
                    className="w-full bg-black border border-zinc-800 py-2 px-3 text-[10px] font-bold text-white outline-none focus:border-indigo-500 font-mono uppercase"
                  >
                    <option value="pending">Pending_Review</option>
                    <option value="processing">Processing_Active</option>
                    <option value="in_progress">In_Progress</option>
                    <option value="completed">Completed_Success</option>
                    <option value="rejected">Rejected_Failed</option>
                    <option value="cancelled">Cancelled_System</option>
                  </select>
                </div>
                <div className="space-y-2 pt-2 border-t border-zinc-900/50">
                  <label className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest text-indigo-400">Resource_Priority_Protocol</label>
                  <select 
                    value={(selectedDataset as any).priority || "medium"}
                    onChange={(e) => dataStore().updateDatasetPriority(selectedId!, e.target.value)}
                    className="w-full bg-black border border-zinc-800 py-2 px-3 text-[10px] font-bold text-white outline-none focus:border-indigo-500 font-mono uppercase"
                  >
                    <option value="low">Low_Yield_Standard</option>
                    <option value="medium">Medium_Yield_Active</option>
                    <option value="high">High_Yield_Critical</option>
                    <option value="urgent">Urgent_Market_Sync</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Market_Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} className={s <= (selectedDataset.rating || 0) ? "fill-amber-500 text-amber-500" : "text-zinc-800"} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={12} /> // Technical_Manifest
                </h3>
                <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                  <QuickStat label="Blueprint" value={(selectedDataset as any).datasetType || "General"} />
                  <QuickStat label="Format" value={selectedDataset.datasetFormat || "N/A"} />
                  <QuickStat label="Target_Volume" value={(selectedDataset as any).rows?.toLocaleString() || (selectedDataset as any).metadata?.numRecords?.toLocaleString() || (selectedDataset as any).volume || "---"} />
                  <QuickStat label="Finalized" value={(selectedDataset as any).rowsCompleted?.toLocaleString() || "0"} />
                  <QuickStat label="Domain" value={(selectedDataset as any).domain || selectedDataset.category || "N/A"} />
                  <QuickStat label="Labelling" value={(selectedDataset as any).labellingMethod?.toUpperCase() || "N/A"} />
                  <QuickStat label="Content" value={(selectedDataset as any).contentType?.toUpperCase() || "N/A"} />
                  <QuickStat label="Payment" value={selectedDataset.paidAt ? `Settled (${new Date(selectedDataset.paidAt).toLocaleDateString()})` : "Awaiting_Payment"} />
                </div>
                <div className="space-y-px bg-zinc-900 border border-zinc-900">
                  <div className="bg-[#050505] p-3 flex justify-between items-center">
                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">Lifecycle_Status</span>
                    <span className="text-[9px] font-mono font-bold text-white uppercase italic">{(selectedDataset as any).status || "Awaiting_Review"}</span>
                  </div>
                  <div className="bg-[#050505] p-3 flex justify-between items-center">
                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">Owner_Node</span>
                    <span className="text-[9px] font-mono font-bold text-indigo-400">{selectedDataset.datasetOwner?.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>
              {((selectedDataset as any).fileUrl || (selectedDataset as any).downloadUrl || (selectedDataset as any).sourceLink) && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Download size={12} /> // Resource_Access
                  </h3>
                  <a 
                    href={(selectedDataset as any).fileUrl || (selectedDataset as any).downloadUrl || (selectedDataset as any).sourceLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink size={14} /> Download_Source_Files
                  </a>
                </div>
              )}

              <div className="space-y-3 pt-6 border-t border-zinc-900">
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton onClick={() => approveDataset(selectedDataset.datasetId ?? String(selectedDataset._id))} icon={<CheckCircle size={14} />} label="APPROVE" color="bg-emerald-600 hover:bg-emerald-500 text-white" />
                  <ActionButton onClick={() => rejectDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "QUALITY")} icon={<XCircle size={14} />} label="REJECT" color="bg-rose-600 hover:bg-rose-500 text-white" />
                </div>
                
                {selectedDataset.isPublished ? (
                  <button onClick={() => unpublishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id), "REVOKE")} className="w-full py-3 border border-zinc-800 text-zinc-500 hover:text-white text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all">
                    <Lock size={14} /> Unpublish_Asset
                  </button>
                ) : (
                  <button 
                    onClick={() => publishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id))} 
                    disabled={
                      !(selectedDataset.price > 0) || 
                      !((selectedDataset as any).status === "approved" || (selectedDataset as any).status === "completed") ||
                      !((selectedDataset as any).rows > 0 || (selectedDataset as any).volume) ||
                      ((selectedDataset as any).rowsCompleted < (selectedDataset as any).rows) ||
                      ((selectedDataset as any).type === 'custom' && !selectedDataset.paidAt)
                    }
                    className="w-full py-3 bg-indigo-600 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:border-zinc-800 border border-transparent text-white text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all"
                  >
                    <Globe size={14} /> {
                      (!(selectedDataset.price > 0) || !((selectedDataset as any).status === "approved" || (selectedDataset as any).status === "completed")) 
                      ? "Market_Injection_Locked" 
                      : ((selectedDataset as any).type === 'custom' && !selectedDataset.paidAt)
                      ? "Payment_Awaiting"
                      : ((selectedDataset as any).rowsCompleted < (selectedDataset as any).rows)
                      ? "Batch_Incomplete"
                      : "Market_Injection"
                    }
                  </button>
                )}
                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-amber-500/70 uppercase tracking-widest">Batch_Control_Override</span>
                    {revokeResult && (
                      <span className="text-[8px] font-mono text-emerald-500">
                        ✓ {revokeResult.revoked}b / {revokeResult.tasksReset}t reset
                      </span>
                    )}
                  </div>
                  <button
                    id={`revoke-batches-${selectedId}`}
                    onClick={handleRevokeDatasetBatches}
                    disabled={isRevoking}
                    className={`w-full py-2.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm border ${
                      revokeConfirm
                        ? "bg-amber-500/10 border-amber-500 text-amber-400 animate-pulse"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500/50 hover:text-amber-400"
                    }`}
                  >
                    {isRevoking ? (
                      <><RefreshCw size={12} className="animate-spin" /> Revoking...</>  
                    ) : revokeConfirm ? (
                      <><RotateCcw size={12} /> Confirm_Revoke? (5s)
                      </>
                    ) : (
                      <><RotateCcw size={12} /> Revoke_&amp;_Renew_Batches</>
                    )}
                  </button>
                  <p className="text-[8px] font-mono text-zinc-700 leading-tight">
                    Clears all assigned batches for this dataset. Tasks return to pool with a renewed 1h window.
                  </p>
                </div>

                <button onClick={() => deleteDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "PURGE")} className="w-full pt-4 text-[9px] font-mono text-zinc-700 hover:text-rose-500 transition-colors uppercase flex items-center justify-center gap-2">
                  <Trash2 size={12} /> System_Purge
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-center justify-center items-center text-zinc-800 text-[10px] font-mono uppercase tracking-widest">Select_Asset_For_Mod</div>
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