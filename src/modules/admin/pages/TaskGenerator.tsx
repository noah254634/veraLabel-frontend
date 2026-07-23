import { useState, useEffect } from "react";
import { 
  Bot, Sparkles, Layers, Check, Edit2, Play, AlertCircle, 
  RefreshCw, Eye, CheckSquare, Plus, X, Trash2
} from "lucide-react";
import { taskGenerationService } from "../services/taskGenerationService";
import type { TaskGenerationRun, DraftTask } from "../services/taskGenerationService";
import { datasetService } from "../services/datasetService";
import type { Dataset } from "../../../shared/types/dataset";

const TaskGenerator = () => {
  // Form State
  const [category, setCategory] = useState("fintech");
  const [regionTags, setRegionTags] = useState<string[]>(["East-Africa"]);
  const [newTag, setNewTag] = useState("");
  const [speechLengthTarget, setSpeechLengthTarget] = useState(15);
  const [codeSwitchExpected, setCodeSwitchExpected] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [count, setCount] = useState(10);
  const [customDomain, setCustomDomain] = useState("");

  // Lists State
  const [runs, setRuns] = useState<TaskGenerationRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<TaskGenerationRun | null>(null);
  const [draftTasks, setDraftTasks] = useState<DraftTask[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [targetDatasetId, setTargetDatasetId] = useState("");

  // Dynamic Dataset Creation Form State
  const [isCreateNewDataset, setIsCreateNewDataset] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState("");
  const [newDatasetDescription, setNewDatasetDescription] = useState("");
  const [newDatasetPrice, setNewDatasetPrice] = useState<number>(0);
  const [newDatasetPricePerBatch, setNewDatasetPricePerBatch] = useState<number>(0.42);

  // Loading/Editing UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch initial data
  useEffect(() => {
    loadRuns();
    loadDatasets();
  }, []);

  const loadRuns = async () => {
    try {
      const data = await taskGenerationService.getRuns();
      setRuns(data);
    } catch (err: any) {
      console.error("Failed to load runs", err);
    }
  };

  const loadDatasets = async () => {
    try {
      const data = await datasetService.fetchDatasets();
      setDatasets(data);
      if (data.length > 0) {
        setTargetDatasetId(data[0]._id);
      }
    } catch (err: any) {
      console.error("Failed to load datasets", err);
    }
  };

  const handleSelectRun = async (run: TaskGenerationRun) => {
    setSelectedRun(run);
    setErrorMsg("");
    setSuccessMsg("");
    setNewDatasetName(`Generator Dataset - ${run.category.toUpperCase()} - ${run.runId}`);
    setNewDatasetDescription(`Dynamically generated instructions for ${run.category} tasks in region: ${run.regionTags.join(', ') || 'Global'}`);
    try {
      const tasks = await taskGenerationService.getTasksForRun(run.runId);
      setDraftTasks(tasks);
    } catch (err: any) {
      console.error("Failed to load tasks for run", err);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !regionTags.includes(newTag.trim())) {
      setRegionTags([...regionTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setRegionTags(regionTags.filter(t => t !== tagToRemove));
  };

  const handleTriggerGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await taskGenerationService.generateTasks({
        category,
        regionTags,
        speechLengthTarget,
        codeSwitchExpected,
        customInstructions,
        count
      });
      setSuccessMsg("Task generation request completed!");
      loadRuns();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to trigger generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartEditing = (task: DraftTask) => {
    setEditingTaskId(task.taskId);
    setEditingText(task.instructionText);
  };

  const handleSaveEdit = async (taskId: string) => {
    try {
      const updated = await taskGenerationService.updateTaskText(taskId, editingText);
      setDraftTasks(draftTasks.map(t => t.taskId === taskId ? updated : t));
      setEditingTaskId(null);
    } catch (err: any) {
      setErrorMsg("Failed to save updated task description");
    }
  };

  const handleApproveAndBatch = async () => {
    if (!selectedRun) return;

    const params: { datasetId?: string; datasetName?: string; datasetDescription?: string; price?: number; pricePerBatch?: number } = {};
    if (isCreateNewDataset) {
      if (!newDatasetName.trim()) {
        setErrorMsg("New dataset name is required.");
        return;
      }
      params.datasetName = newDatasetName.trim();
      params.datasetDescription = newDatasetDescription.trim();
      params.price = newDatasetPrice;
      params.pricePerBatch = newDatasetPricePerBatch;
    } else {
      if (!targetDatasetId) {
        setErrorMsg("Please select a target dataset node first.");
        return;
      }
      params.datasetId = targetDatasetId;
    }

    setIsApproving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await taskGenerationService.approveRunAndBatch(selectedRun.runId, params);
      if (result.success) {
        setSuccessMsg(`Successfully approved and batched ${result.modifiedCount} tasks!`);
        loadRuns();
        loadDatasets(); // Reload datasets so the newly created dataset appears in the lists!
        // Refresh selected run details
        const updatedRuns = await taskGenerationService.getRuns();
        setRuns(updatedRuns);
        const match = updatedRuns.find(r => r.runId === selectedRun.runId);
        if (match) setSelectedRun(match);
        // Reload tasks status
        const tasks = await taskGenerationService.getTasksForRun(selectedRun.runId);
        setDraftTasks(tasks);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Approval failed");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeleteRun = async (runId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete generation run ${runId}? This will remove all associated draft tasks.`)) {
      return;
    }

    try {
      await taskGenerationService.deleteRun(runId);
      setSuccessMsg(`Run ${runId} deleted successfully.`);
      if (selectedRun?.runId === runId) {
        setSelectedRun(null);
        setDraftTasks([]);
      }
      loadRuns();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to delete generation run");
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700 relative text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Bot size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Agent_Direct_v4.5</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none italic">
            Task Instruction Agent
          </h1>
          <p className="text-zinc-500 font-light text-sm mt-4">
            Prompt AI agent to draft diverse guidelines, review scenarios, and dynamically claim batch tasks.
          </p>
        </div>
      </header>

      {/* Main Grid: Form Left, runs list right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {/* Form panel */}
        <div className="xl:col-span-1 bg-[#050505] border border-zinc-900 p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-indigo-500 mb-6 pb-4 border-b border-zinc-900">
            <Sparkles size={16} />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Generator_Spec</h3>
          </div>

          <form onSubmit={handleTriggerGeneration} className="space-y-6">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                Category Domain
              </label>
              <select 
                value={['fintech', 'transport', 'agriculture', 'healthcare', 'education'].includes(category) ? category : '__custom__'}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCategory(customDomain || '');
                  } else {
                    setCategory(e.target.value);
                    setCustomDomain('');
                  }
                }}
                className="w-full bg-black border border-zinc-800 p-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="fintech">Fintech & Banking</option>
                <option value="transport">Transport & logistics</option>
                <option value="agriculture">Agriculture & Trade</option>
                <option value="healthcare">Healthcare & Biotech</option>
                <option value="education">Education & Science</option>
                <option value="__custom__">Custom Domain</option>
              </select>
              {!['fintech', 'transport', 'agriculture', 'healthcare', 'education'].includes(category) && (
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    setCategory(e.target.value);
                  }}
                  placeholder="e.g. Real Estate, Legal, Retail..."
                  className="w-full mt-2 bg-black border border-zinc-800 p-3 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-700"
                />
              )}
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                Region Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. Kenya"
                  className="flex-1 bg-black border border-zinc-800 px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {regionTags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 border border-zinc-800 text-[10px] font-mono">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-zinc-500 hover:text-rose-500">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                  Audio Secs
                </label>
                <input 
                  type="number" 
                  value={speechLengthTarget}
                  onChange={(e) => setSpeechLengthTarget(parseInt(e.target.value))}
                  className="w-full bg-black border border-zinc-800 p-3 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                  Generation Count
                </label>
                <input 
                  type="number" 
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full bg-black border border-zinc-800 p-3 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                Language Code-Switch
              </label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setCodeSwitchExpected(true)}
                  className={`flex-1 py-2.5 border text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${codeSwitchExpected ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                >
                  Expected
                </button>
                <button 
                  type="button"
                  onClick={() => setCodeSwitchExpected(false)}
                  className={`flex-1 py-2.5 border text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${!codeSwitchExpected ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                >
                  Disabled
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                Custom Instructions
              </label>
              <textarea 
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
                placeholder="Instruct the agent on specific context scenario details..."
                className="w-full bg-black border border-zinc-800 p-3 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><RefreshCw className="animate-spin" size={14} /> Generator_Working...</>
              ) : (
                <><Play size={14} /> Compile_and_Generate</>
              )}
            </button>
          </form>
        </div>

        {/* Runs List & Details panel */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* List panel */}
          <div className="bg-[#050505] border border-zinc-900 p-8 shadow-2xl flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-2 text-zinc-400">
                <Layers size={16} />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Generation_Runs</h3>
              </div>
              <button onClick={loadRuns} className="text-zinc-500 hover:text-white transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {runs.map(run => (
                <div 
                  key={run._id}
                  onClick={() => handleSelectRun(run)}
                  className={`p-4 border cursor-pointer transition-all ${selectedRun?.runId === run.runId ? 'bg-zinc-950 border-indigo-500/50' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs font-bold text-white tracking-tight">{run.runId}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 border text-[8px] font-mono uppercase tracking-widest ${
                        run.status === "completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        run.status === "review_required" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        run.status === "generating" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse" :
                        "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      }`}>
                        {run.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteRun(run.runId, e)}
                        className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                        title="Delete Generation Run"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Category: {run.category}</span>
                    <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                    <span>Count: {run.countRequested}</span>
                  </div>
                </div>
              ))}
              {runs.length === 0 && (
                <div className="text-center py-12 text-zinc-600 font-light text-xs">
                  No generation runs logged. Spec parameters and trigger generation above.
                </div>
              )}
            </div>
          </div>

          {/* Details & Review pane */}
          <div className="bg-[#050505] border border-zinc-900 p-8 shadow-2xl flex flex-col h-[600px]">
            {selectedRun ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-2 text-indigo-500">
                    <Eye size={16} />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Review_Scenarios</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">{selectedRun.runId}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteRun(selectedRun.runId, e)}
                      className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                      title="Delete Generation Run"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Info messages */}
                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 mb-4 font-mono">
                    <Check size={14} /> {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 mb-4 font-mono">
                    <AlertCircle size={14} /> {errorMsg}
                  </div>
                )}

                {/* Tasks List */}
                <div className="space-y-4 overflow-y-auto flex-1 pr-2 mb-6">
                  {draftTasks.map((task) => (
                    <div key={task._id} className="bg-black border border-zinc-900 p-4 hover:border-zinc-800 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-zinc-500 font-bold">{task.taskId}</span>
                        {selectedRun.status === "review_required" && (
                          <button 
                            onClick={() => handleStartEditing(task)}
                            className="text-zinc-600 hover:text-indigo-400 transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </div>

                      {editingTaskId === task.taskId ? (
                        <div className="space-y-2">
                          <textarea 
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingTaskId(null)} className="px-3 py-1 bg-zinc-900 text-[10px] font-bold">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveEdit(task.taskId)} className="px-3 py-1 bg-indigo-600 text-[10px] font-bold">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-zinc-300 text-xs font-light leading-relaxed">
                          {task.instructionText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Approve block */}
                {selectedRun.status === "review_required" && (
                  <div className="border-t border-zinc-900 pt-6 space-y-4">
                    <div>
                      <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                        Target Asset Mode
                      </label>
                      <div className="flex gap-4 mb-4">
                        <button 
                          onClick={() => setIsCreateNewDataset(false)}
                          className={`flex-1 py-2 border text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${!isCreateNewDataset ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                        >
                          Link Existing Dataset
                        </button>
                        <button 
                          onClick={() => setIsCreateNewDataset(true)}
                          className={`flex-1 py-2 border text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${isCreateNewDataset ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                        >
                          Create New Dataset
                        </button>
                      </div>
                    </div>

                    {!isCreateNewDataset ? (
                      <div>
                        <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                          Select Existing Dataset
                        </label>
                        <select
                          value={targetDatasetId}
                          onChange={(e) => setTargetDatasetId(e.target.value)}
                          className="w-full bg-black border border-zinc-850 p-3 text-xs focus:outline-none"
                        >
                          {datasets.map(d => (
                            <option key={d._id} value={d._id}>{d.name} ({d.datasetType || "Modality"})</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                            New Dataset Name
                          </label>
                          <input 
                            type="text"
                            value={newDatasetName}
                            onChange={(e) => setNewDatasetName(e.target.value)}
                            placeholder="e.g. Fintech Audio Run 1"
                            className="w-full bg-black border border-zinc-850 p-3 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                            Dataset Description
                          </label>
                          <textarea 
                            value={newDatasetDescription}
                            onChange={(e) => setNewDatasetDescription(e.target.value)}
                            rows={2}
                            placeholder="Provide dataset context..."
                            className="w-full bg-black border border-zinc-850 p-3 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                              Total Price ($)
                            </label>
                            <input 
                              type="number"
                              step="0.01"
                              value={newDatasetPrice}
                              onChange={(e) => setNewDatasetPrice(parseFloat(e.target.value) || 0)}
                              className="w-full bg-black border border-zinc-850 p-3 text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                              Price per Batch ($)
                            </label>
                            <input 
                              type="number"
                              step="0.01"
                              value={newDatasetPricePerBatch}
                              onChange={(e) => setNewDatasetPricePerBatch(parseFloat(e.target.value) || 0)}
                              className="w-full bg-black border border-zinc-850 p-3 text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleApproveAndBatch}
                      disabled={isApproving}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                    >
                      {isApproving ? (
                        <><RefreshCw className="animate-spin" size={14} /> Batching...</>
                      ) : (
                        <><CheckSquare size={14} /> Approve_and_Inject_Batches</>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600 font-light text-xs">
                <Bot size={36} className="mb-4 text-zinc-800" />
                Select a generation run from the left to review instructions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskGenerator;
