import { X, FileText, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import type { TaskSession } from "../types/taskProgressTypes";

interface SessionDetailViewProps {
  session: TaskSession | null;
  onClose: () => void;
  isConnected: boolean;
}

const SessionDetailView = ({ session, onClose, isConnected }: SessionDetailViewProps) => {
  if (!session) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/40";
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-3xl w-full my-8">
        <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-lg font-semibold text-white">Session Details</h2>
              <p className="text-zinc-500 text-xs font-mono mt-1">
                {session.projectId} / {session.datasetId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-zinc-600 text-xs">Status</p>
              <div
                className={`mt-2 inline-flex items-center gap-2 px-2 py-1 rounded border text-xs font-medium ${getStatusColor(
                  session.status
                )}`}
              >
                {session.status === "processing" && <TrendingUp className="w-3 h-3" />}
                {session.status === "completed" && <CheckCircle className="w-3 h-3" />}
                {session.status === "failed" && <AlertCircle className="w-3 h-3" />}
                {session.status}
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-zinc-600 text-xs">Started</p>
              <p className="text-white text-sm font-mono mt-2">
                {formatTime(session.startTime)}
              </p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-zinc-600 text-xs">Duration</p>
              <p className="text-white text-sm font-mono mt-2">
                {formatDuration(session.durationMs)}
              </p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-zinc-600 text-xs">Connection</p>
              <p className={`text-sm font-medium mt-2 ${isConnected ? "text-green-400" : "text-yellow-400"}`}>
                {isConnected ? "🔴 Live" : "⚪ Polling"}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Event Metrics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                label="Total Events"
                value={session.eventCount}
                color="text-indigo-400"
              />
              <MetricCard
                label="Processed"
                value={session.eventMetrics.processed}
                color="text-blue-400"
              />
              <MetricCard
                label="Errors"
                value={session.eventMetrics.errors}
                color={session.eventMetrics.errors > 0 ? "text-red-400" : "text-green-400"}
              />
              <MetricCard
                label="Warnings"
                value={session.eventMetrics.warnings}
                color={session.eventMetrics.warnings > 0 ? "text-yellow-400" : "text-green-400"}
              />
            </div>
          </div>
          {session.eventMetrics.checkpoints > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Checkpoints</h3>
              <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700">
                <p className="text-zinc-400 text-sm">
                  {session.eventMetrics.checkpoints} checkpoint{session.eventMetrics.checkpoints !== 1 ? "s" : ""} recorded
                </p>
              </div>
            </div>
          )}
          {isConnected && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 text-sm font-medium mb-1">🔴 Live Stream Active</p>
              <p className="text-green-600 text-xs">
                Real-time updates are streaming. New events will appear as they arrive from the worker.
              </p>
            </div>
          )}
          <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700">
            <p className="text-zinc-600 text-xs mb-1">Session ID</p>
            <p className="text-white text-xs font-mono break-all">{session.sessionId}</p>
          </div>
        </div>
        <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
    <p className="text-zinc-600 text-xs">{label}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default SessionDetailView;
