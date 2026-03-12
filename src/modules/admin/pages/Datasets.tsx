import React, { useState, useEffect } from "react";
import {
  Database,
  MoreVertical,
  CheckCircle,
  XCircle,
  Star,
  ShieldAlert,
  Globe,
  Lock,
  Search,
  Download,
  Trash2,
  Terminal,
  Activity,
  ChevronRight
} from "lucide-react";
import { dataStore } from "../store/datasetManagementStore";

const DatasetAdminPage = () => {
  const {
    datasets,
    getDataset,
    approveDataset,
    rejectDataset,
    unpublishDatasetById,
    publishDatasetById,
    deleteDataset,
    loading,
  } = dataStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  useEffect(() => {
    getDataset();
  }, [getDataset]);

  const selectedDataset = datasets.find((d) => {
    const datasetId = d.datasetId ?? String(d._id);
    return datasetId === selectedId;
  });

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700">
      
      {/* --- HEADER: Admin Control --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-2 border-indigo-500 pl-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-3">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Admin_Registry_Root</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
            Dataset Inventory
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-light">
            Moderation Portal: Global Data Asset Management & Validation.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-9 rounded-full border-2 border-[#020203] bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                U_{i}
              </div>
            ))}
          </div>
          <button className="bg-zinc-950 border border-zinc-900 px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all rounded-sm flex items-center gap-2">
            <Download size={14} /> Export_Log
          </button>
        </div>
      </div>

      {/* --- FILTER BAR: Technical Input --- */}
      <div className="bg-[#050505] border border-zinc-900 p-2 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 bg-black border border-zinc-900 px-3 py-1">
           <span className="text-[9px] font-mono text-zinc-700 uppercase font-bold">Filter_By:</span>
           <select
             value={searchType}
             onChange={(e) => setSearchType(e.target.value)}
             className="bg-transparent text-[10px] font-mono font-bold text-indigo-500 uppercase outline-none cursor-pointer"
           >
             <option value="name">Name</option>
             <option value="owner">Owner</option>
             <option value="category">Category</option>
             <option value="status">Status</option>
           </select>
        </div>

        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder={`Query registry by ${searchType}...`}
            className="w-full bg-black border border-zinc-900 py-3 pl-12 pr-4 text-xs font-medium text-white outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-800 rounded-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-px bg-zinc-900 border border-zinc-900">
          <button className="px-4 py-3 bg-[#0A0A0A] text-[9px] font-mono font-bold text-zinc-500 hover:text-white uppercase tracking-widest">
            Pending_Sync
          </button>
          <button className="px-4 py-3 bg-[#0A0A0A] text-[9px] font-mono font-bold text-zinc-500 hover:text-white uppercase tracking-widest">
            Published_Live
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT: Split View --- */}
      <div className="flex-1 flex gap-px bg-zinc-900 border border-zinc-900 overflow-hidden min-h-[600px] shadow-2xl">
        
        {/* LEFT: DATA TABLE */}
        <div className="flex-1 bg-[#050505] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-zinc-900">
              <tr>
                <th className="p-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Dataset_Object</th>
                <th className="p-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Status</th>
                <th className="p-5 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Quality</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {datasets.map((item) => {
                const datasetId = item.datasetId ?? String(item._id);
                const isActive = selectedId === datasetId;
                return (
                  <tr
                    key={datasetId}
                    onClick={() => setSelectedId(datasetId)}
                    className={`group cursor-pointer transition-all ${isActive ? "bg-indigo-500/5" : "hover:bg-zinc-900/30"}`}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 border flex items-center justify-center transition-all ${isActive ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
                          <Database size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-200 text-sm tracking-tight">{item.name || "UNNAMED_ASSET"}</div>
                          <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{datasetId.slice(0, 12)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <StatusBadge published={item.isPublished} />
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <Star size={10} className="fill-amber-500/50 text-amber-500/50" />
                        <span className="text-xs font-mono font-bold text-zinc-400">{item.rating || "0.0"}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                       <ChevronRight size={14} className={`inline-block transition-transform ${isActive ? 'translate-x-1 text-indigo-500' : 'text-zinc-800'}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && (
            <div className="p-20 text-center animate-pulse text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-800">
              Synchronizing_VeraLabel_Registry...
            </div>
          )}
        </div>

        {/* RIGHT: ACTION PANEL */}
        <aside className={`w-[400px] bg-[#0A0A0A] p-10 border-l border-zinc-900 transition-all ${selectedDataset ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {selectedDataset && (
            <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start mb-10">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                  <ShieldAlert size={24} />
                </div>
                <button onClick={() => setSelectedId(null)} className="text-zinc-700 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-widest">[Close]</button>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tighter mb-2">{selectedDataset.name}</h2>
              <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mb-10">UID: {selectedDataset.datasetId ?? String(selectedDataset._id)}</p>

              <div className="space-y-6 flex-1">
                <div className="bg-zinc-950 border border-zinc-900 p-5">
                  <label className="text-[9px] font-mono font-bold uppercase text-zinc-600 block mb-3">// Validation_Note</label>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed italic">
                    Automated heuristic scan complete. No high-risk telemetry detected. Pending final administrative authorization for marketplace injection.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                  <QuickStat label="Samples" value="14,202" />
                  <QuickStat label="Precision" value="98.2%" />
                </div>
              </div>

              {/* ACTION BUTTONS: High-Density & Primary Colors */}
              <div className="space-y-4 mt-12 pt-8 border-t border-zinc-900">
                <div className="grid grid-cols-2 gap-4">
                  <ActionButton
                    onClick={() => approveDataset(selectedDataset.datasetId ?? String(selectedDataset._id))}
                    icon={<CheckCircle size={16} />}
                    label="APPROVE"
                    color="bg-emerald-600 hover:bg-emerald-500 text-white"
                  />
                  <ActionButton
                    onClick={() => rejectDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "QUALITY_REJECTION")}
                    icon={<XCircle size={16} />}
                    label="REJECT"
                    color="bg-rose-600 hover:bg-rose-500 text-white"
                  />
                </div>

                {selectedDataset.isPublished ? (
                  <button onClick={() => unpublishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id), "ADMIN_REVOKE")} className="w-full py-4 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                    <Lock size={16} /> Unpublish_Asset
                  </button>
                ) : (
                  <button onClick={() => publishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id))} className="w-full py-4 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20">
                    <Globe size={16} /> Market_Injection
                  </button>
                )}

                <button onClick={() => deleteDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "VIOLATION")} className="w-full pt-4 text-[9px] font-mono font-bold text-zinc-700 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                  <Trash2 size={12} /> System_Purge (Permanent)
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

const StatusBadge = ({ published }: { published: boolean }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-sm text-[9px] font-mono font-bold uppercase tracking-tighter ${published ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-amber-500/5 border-amber-500/20 text-amber-500"}`}>
    <div className={`h-1 w-1 rounded-full ${published ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
    {published ? "Live_Status" : "Pending_Sync"}
  </div>
);

const QuickStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#050505] p-4">
    <div className="text-[8px] font-mono font-bold text-zinc-700 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-lg font-bold text-white tabular-nums tracking-tighter">{value}</div>
  </div>
);

interface ActionButtonProps {
  icon: React.ReactElement;
  label: string;
  color: string;
  onClick: () => void;
}

const ActionButton = ({ icon, label, color, onClick }: ActionButtonProps) => (
  <button onClick={onClick} className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${color} rounded-sm`}>
    {icon} {label}
  </button>
);

export default DatasetAdminPage;