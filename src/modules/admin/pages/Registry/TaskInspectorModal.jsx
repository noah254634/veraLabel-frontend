import React from "react";
import { X, ShieldCheck, AlertTriangle, RotateCcw, Info } from "lucide-react";
import {
  ImageInspector,
  AIReviewInspector,
  AudioInspector,
} from "./AtomicUnits";

const TaskInspectorModal = ({
  task,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRevoke,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-full bg-[#050505] border border-zinc-900 flex flex-col shadow-2xl">
        <header className="p-4 border-b border-zinc-900 bg-black flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Info size={14} />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold">
                Inspection_Mode
              </span>
            </div>
            <h2 className="text-white font-bold text-sm italic tracking-tight">
              UNIT_ID: <span className="text-indigo-400">{task.id}</span>
            </h2>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {task.type} // Source: {task.datasetName || "N/A"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-white transition-colors p-2"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 bg-black relative flex items-center justify-center overflow-auto p-4">
            <div className="w-full h-full border border-zinc-900/50 bg-[#020202] flex items-center justify-center relative overflow-hidden">
              {task.type === "Bounding Box" || task.type === "Segmentation" ? (
                <ImageInspector
                  src={task.fileUrl}
                  annotations={task.annotations}
                />
              ) : task.type === "Transcription" || task.type === "Audio" ? (
                <AudioInspector
                  src={task.fileUrl}
                  transcript={task.transcript}
                />
              ) : task.type === "AI Response Review" ? (
                <AIReviewInspector
                  prompt={task.prompt}
                  response={task.response}
                />
              ) : (
                <div className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">
                  Unsupported_Data_Format
                </div>
              )}
            </div>
          </main>

          <aside className="w-80 border-l border-zinc-900 p-6 flex flex-col gap-8 bg-[#050505]">
            <section>
              <h3 className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-4">
                // Annotator_Intel
              </h3>
              <div className="space-y-3">
                <MetaField
                  label="Assignee"
                  value={task.labeller || task.labellerName || "N/A"}
                />
                <MetaField
                  label="Processing_Time"
                  value={task.timeTaken || "N/A"}
                />
                <MetaField label="Confidence" value="94.2%" />
              </div>
            </section>

            <div className="mt-auto space-y-2">
              <button
                onClick={() => onApprove(task.id)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShieldCheck size={14} /> Approve_Release
              </button>

              <button
                onClick={() => onReject(task.id, "Quality Check Failed")}
                className="w-full py-4 bg-zinc-900 hover:bg-amber-600 text-amber-500 hover:text-white font-mono font-bold text-[10px] uppercase tracking-[0.2em] transition-all border border-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <AlertTriangle size={14} /> Send_To_Correction
              </button>

              <button
                onClick={() => onRevoke(task.id)}
                className="w-full py-4 bg-zinc-950 hover:bg-rose-600 text-rose-500 hover:text-white font-mono font-bold text-[10px] uppercase tracking-[0.2em] transition-all border border-rose-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw size={14} /> Revoke_Allocation
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const MetaField = ({ label, value }) => (
  <div className="flex justify-between items-end border-b border-zinc-900 pb-1">
    <span className="text-[8px] font-mono text-zinc-700 uppercase">
      {label}
    </span>
    <span className="text-[10px] text-zinc-300 font-bold">{value}</span>
  </div>
);

export default TaskInspectorModal;
