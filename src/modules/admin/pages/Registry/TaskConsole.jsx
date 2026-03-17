import React from "react";
import {
  UserPlus,
  RotateCcw,
  CheckCircle,
  Eye, // Added for the review action
  Filter,
  ChevronDown,
} from "lucide-react";
import TaskInspectorModal from "./TaskInspectorModal";

const TaskConsole = () => {
  const [selectedTask, setSelectedTask] = React.useState(null);

  const tasks = [
    {
      id: "UNIT-992",
      file: "img_042.png",
      status: "In Progress",
      labeller: "Noah K.",
      type: "Bounding Box",
      datasetName: "Autonomous_Nav_v4", // Added for the modal metadata
      timeTaken: "12m 45s",
    },
    {
      id: "UNIT-993",
      file: "audio_01.wav",
      status: "Under Review",
      labeller: "Sarah W.",
      type: "Transcription",
      datasetName: "Customer_Support_Audio",
      timeTaken: "05m 12s",
    },
  ];

  return (
    <div className="bg-[#050505] border border-zinc-900 mt-8 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-zinc-950 border-b border-zinc-900 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
        <div className="col-span-1">Unit_ID</div>
        <div className="col-span-1">Dataset_Source</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Assignee</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Actions_Manual</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task) => (
        <div
          key={task.id}
          // CLICK HANDLER TO OPEN MODAL
          onClick={() => setSelectedTask(task)}
          className="grid grid-cols-6 gap-4 p-4 border-b border-zinc-900 items-center hover:bg-[#080808] group transition-all cursor-pointer"
        >
          <div className="font-mono text-xs text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
            {task.id}
          </div>
          <div className="text-zinc-400 text-xs">{task.file}</div>
          <div className="text-[10px] font-mono text-zinc-600">{task.type}</div>
          <div className="text-zinc-300 text-xs font-bold">
            {task.labeller || "UNASSIGNED"}
          </div>

          <div>
            <span
              className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-sm ${
                task.status === "Under Review"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-indigo-500/10 text-indigo-500"
              }`}
            >
              {task.status}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            {/* e.stopPropagation prevents the modal from opening when clicking specific small buttons */}
            <button
              title="Assign Task"
              className="p-2 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-indigo-600 transition-all rounded-sm"
            >
              <UserPlus size={14} />
            </button>

            <button
              title="Revoke & Re-queue"
              className="p-2 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-rose-600 transition-all rounded-sm"
            >
              <RotateCcw size={14} />
            </button>

            <div className="h-4 w-px bg-zinc-800 mx-1" />
            
            <button
              title="Inspect Task"
              onClick={() => setSelectedTask(task)}
              className="p-2 text-indigo-400 hover:text-white transition-colors"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      ))}

      {/* The Modal */}
      <TaskInspectorModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onApprove={(id) => {
          console.log("Approving:", id);
          setSelectedTask(null);
        }}
        onReject={(id, reason) => {
          console.log("Rejecting:", id, reason);
          setSelectedTask(null);
        }}
        onRevoke={(id) => {
          console.log("Revoking:", id);
          setSelectedTask(null);
        }}
      />
    </div>
  );
};

export default TaskConsole;