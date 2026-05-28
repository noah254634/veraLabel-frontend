import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { Terminal, Activity, Loader2 } from "lucide-react";
import { datasetService } from "../../admin/services/datasetService";
import toast from "react-hot-toast";

type FilterType = "ALL" | "IMAGE" | "AUDIO" | "TEXT";

export const FindWorkPage = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Bug #4 fix: track active filter and apply it to the list
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const data = await datasetService.fetchDatasets();
        setDatasets(data);
      } catch (err) {
        toast.error("Failed to synchronize with work registry.");
      } finally {
        setLoading(false);
      }
    };
    loadDatasets();
  }, []);

  const filteredDatasets = datasets.filter((dataset) => {
    if (activeFilter === "ALL") return true;
    const type = (
      dataset.datasetType ||
      dataset.metadata?.type ||
      dataset.contentType ||
      ""
    ).toUpperCase();
    return type.includes(activeFilter);
  });

  return (
    <div className="w-full animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Terminal size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Job_Queue_v.02</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
            Available Missions
          </h1>
          <p className="text-zinc-500 font-light text-sm mt-4">
            Select an operational node to initialize your work session.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#050505] border border-zinc-900 p-2 shadow-2xl">
           <div className="flex items-center gap-2 px-3 border-r border-zinc-900">
              <Activity size={14} className="text-emerald-500" />
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Live_Inflow: {filteredDatasets.length}</span>
           </div>
           <div className="flex gap-1">
              <FilterBtn label="ALL"   active={activeFilter === "ALL"}   onClick={() => setActiveFilter("ALL")} />
              <FilterBtn label="IMAGE" active={activeFilter === "IMAGE"} onClick={() => setActiveFilter("IMAGE")} />
              <FilterBtn label="AUDIO" active={activeFilter === "AUDIO"} onClick={() => setActiveFilter("AUDIO")} />
              <FilterBtn label="TEXT"  active={activeFilter === "TEXT"}  onClick={() => setActiveFilter("TEXT")} />
           </div>
        </div>
      </header>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
           <Loader2 className="animate-spin text-indigo-500" size={24} />
           Scanning_Network_Nodes...
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="h-64 border border-dashed border-zinc-900 flex flex-col items-center justify-center gap-3 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
           [ No_Active_Missions_Found ]
           {activeFilter !== "ALL" && (
             <button
               onClick={() => setActiveFilter("ALL")}
               className="text-indigo-400 hover:text-indigo-300 underline uppercase tracking-widest"
             >
               Clear_Filter
             </button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">
          {filteredDatasets.map((dataset) => (
             <ProjectCard 
               key={dataset._id}
               id={dataset._id}
               title={dataset.name} 
               type={dataset.metadata?.type || dataset.datasetType || "TEXT"} 
               reward={`$${dataset.pricePerBatch || '0.00'}`} 
               totalTasks={dataset.metadata?.numRecords || dataset.rows || 0} 
               difficulty="MEDIUM_PRIORITY" 
             />
          ))}
        </div>
      )}
      <div className="mt-12 flex justify-between items-center opacity-20">
         <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Node_Status: Encrypted_Session</span>
         <span className="text-[8px] font-mono uppercase tracking-[0.4em]">v4.2.1-Prod</span>
      </div>
    </div>
  );
};

// --- INTERNAL HELPERS ---

const FilterBtn = ({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${
      active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
      : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'
    }`}
  >
    {label}
  </button>
);