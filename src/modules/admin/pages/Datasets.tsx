import React, { useState, useEffect } from 'react';
import { 
  Database, MoreVertical, CheckCircle, XCircle, 
  Star, ShieldAlert, Globe, Lock, Search,
  Download, Trash2
} from 'lucide-react';
import { dataStore } from '../store/datasetManagementStore';

const DatasetAdminPage = () => {
  const { 
    datasets, getDataset, approveDataset, rejectDataset, 
    unpublishDatasetById, publishDatasetById, deleteDataset, 
    loading 
  } = dataStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getDataset();
  }, [getDataset]);

  const selectedDataset = datasets.find((d) => {
    const datasetId = d.datasetId ?? String(d._id ?? d.id);
    return datasetId === selectedId;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* --- HEADER & STATS --- */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-indigo-900">Dataset Inventory</h1>
          <p className="text-white-100 text-sm">Review, Moderate, and Manage Global Data Assets</p>
        </div>
        <div className="flex gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
            <div className="h-8 w-8 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 text-[10px] flex items-center justify-center font-bold">
              +24
            </div>
          </div>
          <button className="text-gray-900 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">
            <Download size={16} /> Export Catalog
          </button>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 flex-1 px-2">
          <Search size={18} className="text-gray-900 cursor-pointer" />
          <input 
            type="text" 
            placeholder="Search by ID, Owner, or Category..." 
            className="border-none bg-transparent focus:ring-0 text-sm text-gray-700 outline-none flex-1 w-full pl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-8 w-[1px] bg-slate-100 mx-4" />
        <div className="flex gap-2 pr-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
            Pending Approval
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600">
            Published
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT: SPLIT VIEW --- */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-[600px]">
        
        {/* LEFT: DATA TABLE */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-gray-900">
                <th className="p-4 text-[11px] font-black uppercase text-slate-400 tracking-wider">Dataset Info</th>
                <th className="p-4 text-[11px] font-black uppercase text-slate-400 tracking-wider">Status</th>
                <th className="p-4 text-[11px] font-black uppercase text-slate-400 tracking-wider">Quality</th>
                <th className="p-4 text-[11px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {datasets.map((item) => {
                const datasetId = item.datasetId ?? String(item._id);
                return (
                  <tr 
                    key={datasetId} 
                    onClick={() => setSelectedId(datasetId)}
                    className={`group cursor-pointer transition-colors ${selectedId === datasetId ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                  >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                        <Database size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{item.name || "Unnamed Dataset"}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{datasetId.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge published={item.isPublished} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-slate-700">{item.rating || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && (
            <div className="flex-1 flex items-center justify-center italic text-slate-400 animate-pulse">
              Syncing VeraLabel Database...
            </div>
          )}
        </div>

        {/* RIGHT: ACTION PANEL */}
        <aside className={`w-96 bg-slate-900 rounded-3xl p-6 text-white transition-all transform ${selectedDataset ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          {selectedDataset ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <ShieldAlert size={24} />
                </div>
                <button onClick={() => setSelectedId(null)} className="text-slate-500 hover:text-white">x</button>
              </div>

              <h2 className="text-xl font-bold mb-1">{selectedDataset.name}</h2>
              <p className="text-slate-400 text-xs mb-6 font-mono">{selectedDataset.datasetId ?? String(selectedDataset._id)}</p>

              <div className="space-y-4 flex-1">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">Internal Note</label>
                  <p className="text-sm text-slate-300 italic">No red flags detected by automated filters. Ready for human review.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <QuickStat label="Samples" value="14,202" />
                  <QuickStat label="Accuracy" value="98.2%" />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="flex gap-3">
                  <ActionButton 
                    onClick={() => approveDataset(selectedDataset.datasetId ?? String(selectedDataset._id))}
                    icon={<CheckCircle size={18} />} 
                    label="Approve" 
                    color="bg-emerald-500 hover:bg-emerald-600" 
                  />
                  <ActionButton 
                    onClick={() => rejectDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "Quality low")}
                    icon={<XCircle size={18} />} 
                    label="Reject" 
                    color="bg-rose-500 hover:bg-rose-600" 
                  />
                </div>
                
                {selectedDataset.isPublished ? (
                   <button 
                    onClick={() => unpublishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id), "Admin intervention")}
                    className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
                   >
                    <Lock size={18} /> Unpublish Dataset
                   </button>
                ) : (
                  <button 
                    onClick={() => publishDatasetById(selectedDataset.datasetId ?? String(selectedDataset._id))}
                    className="w-full py-3 bg-indigo-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Globe size={18} /> Push to Marketplace
                  </button>
                )}

                <button 
                  onClick={() => deleteDataset(selectedDataset.datasetId ?? String(selectedDataset._id), "Violation")}
                  className="w-full py-3 text-rose-400 text-xs font-bold hover:text-rose-300 transition-all flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} /> Permanently Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                <Database size={32} />
              </div>
              <h3 className="font-bold text-slate-400">No Dataset Selected</h3>
              <p className="text-slate-600 text-xs mt-2">Select an item from the inventory to view metadata and perform administrative actions.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StatusBadge = ({ published }: { published: boolean }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
    published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
  }`}>
    <div className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
    {published ? 'Published' : 'Pending'}
  </div>
);

const QuickStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
    <div className="text-[10px] font-bold text-slate-500 uppercase">{label}</div>
    <div className="text-lg font-black text-white">{value}</div>
  </div>
);

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

const ActionButton = ({ icon, label, color, onClick }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-black/20 ${color}`}
  >
    {icon} {label}
  </button>
);

export default DatasetAdminPage;
