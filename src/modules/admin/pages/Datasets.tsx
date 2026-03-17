import React, { useState, useEffect, useMemo } from "react";
import {
  Database, CheckCircle, XCircle, Star, ShieldAlert, Globe, Lock, Search, 
  Download, Trash2, Terminal, ChevronRight
} from "lucide-react";
import { dataStore } from "../store/datasetManagementStore";

const DatasetAdminPage = () => {
  const {
    datasets, getDataset, approveDataset, rejectDataset, 
    unpublishDatasetById, publishDatasetById, deleteDataset, loading,
  } = dataStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  useEffect(() => {
    getDataset();
  }, [getDataset]);

  // Optimization: Memoize filtered list to prevent unnecessary re-renders
  const filteredDatasets = useMemo(() => {
    return datasets.filter((d) => {
      const val = d[searchType]?.toString().toLowerCase() || "";
      return val.includes(searchTerm.toLowerCase());
    });
  }, [datasets, searchTerm, searchType]);

  const selectedDataset = useMemo(() => 
    datasets.find((d) => (d.datasetId ?? String(d._id)) === selectedId),
    [datasets, selectedId]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden space-y-6 p-4 md:p-6 bg-black">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-indigo-500 pl-6 shrink-0">
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

      {/* --- FILTER BAR --- */}
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

      {/* --- MAIN CONTENT: Balanced Split View --- */}
      <div className="flex-1 flex flex-col lg:flex-row gap-px bg-zinc-900 border border-zinc-900 overflow-hidden shadow-2xl">
        
        {/* LEFT: DATA TABLE (Scrollable independently) */}
        <div className="flex-1 bg-[#050505] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-zinc-900">
              <tr>
                <th className="p-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Dataset_Object</th>
                <th className="p-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">// Status</th>
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
                          <div className="font-bold text-zinc-200 text-sm tracking-tight">{item.name || "UNNAMED"}</div>
                          <div className="text-[9px] text-zinc-600 font-mono uppercase truncate w-32">{id.slice(0, 12)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge published={item.isPublished} /></td>
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

        {/* RIGHT: ACTION PANEL (Sticky on Desktop) */}
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
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                  <input
                    type="number"
                    defaultValue={selectedDataset.price}
                    className="w-full bg-black border border-zinc-800 py-2 pl-7 pr-3 text-lg font-bold text-white outline-none focus:border-indigo-500 font-mono"
                  />
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

              <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                <QuickStat label="Samples" value="14,202" />
                <QuickStat label="Precision" value="98.2%" />
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-900">
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton onClick={() => approveDataset(selectedDataset.datasetId ?? String(selectedDataset._id))} icon={<CheckCircle size={14} />} label="APPROVE" color="bg-emerald-600 hover:bg-emerald-500 text-white" />
                  <ActionButton onClick={() => rejectDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "QUALITY")} icon={<XCircle size={14} />} label="REJECT" color="bg-rose-600 hover:bg-rose-500 text-white" />
                </div>
                
                {selectedDataset.isPublished ? (
                  <button onClick={() => unpublishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id), "REVOKE")} className="w-full py-3 border border-zinc-800 text-zinc-500 hover:text-white text-[10px] font-bold uppercase flex items-center justify-center gap-2">
                    <Lock size={14} /> Unpublish_Asset
                  </button>
                ) : (
                  <button onClick={() => publishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id))} className="w-full py-3 bg-indigo-600 text-white text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all">
                    <Globe size={14} /> Market_Injection
                  </button>
                )}

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

const StatusBadge = ({ published }: { published: boolean }) => (
  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-sm text-[8px] font-mono font-bold uppercase ${published ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-amber-500/5 border-amber-500/20 text-amber-500"}`}>
    <div className={`h-1 w-1 rounded-full ${published ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
    {published ? "Live" : "Pending"}
  </div>
);

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