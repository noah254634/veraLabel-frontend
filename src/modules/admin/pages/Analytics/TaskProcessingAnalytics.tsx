import { useEffect, useState, useRef } from "react";
import { Activity, Zap, AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { taskProgressStore } from "../../store/taskProgressStore";
import { taskProgressService } from "../../services/taskProgressService";
import SessionDetailView from "../../components/SessionDetailView";
import type { TaskSession } from "../../types/taskProgressTypes";

const TaskProcessingAnalytics = () => {
  const {
    sessions,
    stats,
    loading,
    error,
    selectedSession,
    fetchSessions,
    setSelectedSession,
    setError,
    refreshData,
  } = taskProgressStore();

  const [connected, setConnected] = useState(false);
  const [viewDetailSessionId, setViewDetailSessionId] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Get the session to display (looks it up from sessions array)
  const viewDetailSession = viewDetailSessionId
    ? sessions.find((s) => s.sessionId === viewDetailSessionId) || null
    : null;

  // Initial data fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Polling interval
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [refreshData]);

  // SSE streaming for selected session
  useEffect(() => {
    if (!selectedSession) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setConnected(false);
      }
      return;
    }

    try {
      const parts = selectedSession.split(":");
      const projectId = parts[0];
      const datasetId = parts[1];

      console.log("Connecting to SSE stream:", projectId, datasetId);

      const es = taskProgressService.subscribeToSessionStream(projectId, datasetId);

      const handleMessage = () => {
        console.log("SSE message received");
        refreshData();
      };

      const handleError = (error: Event) => {
        console.error("SSE connection error:", error);
        setConnected(false);
        setError("Lost connection to task stream");
        es.close();
        eventSourceRef.current = null;
      };

      const handleOpen = () => {
        console.log("SSE connection established");
        setConnected(true);
        setError(null);
      };

      es.addEventListener("message", handleMessage);
      es.addEventListener("error", handleError);
      es.addEventListener("open", handleOpen);

      eventSourceRef.current = es;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect to task stream";
      console.error("Error setting up SSE:", message, err);
      setError(message);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setConnected(false);
      }
    };
    // Only depend on selectedSession, not refreshData to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Activity className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm font-medium">Active Processing</span>
            <Activity className={`w-5 h-5 ${stats?.processingCount ? "text-blue-500" : "text-zinc-700"}`} />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.processingCount || 0}</p>
          <p className="text-zinc-600 text-xs mt-1">Dataset splits in progress</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm font-medium">Total Sessions</span>
            <TrendingUp className={`w-5 h-5 ${stats?.activeSessions ? "text-indigo-500" : "text-zinc-700"}`} />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.activeSessions || 0}</p>
          <p className="text-zinc-600 text-xs mt-1">Active session instances</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm font-medium">Completed</span>
            <CheckCircle className={`w-5 h-5 ${stats?.completedSessions ? "text-green-500" : "text-zinc-700"}`} />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.completedSessions || 0}</p>
          <p className="text-zinc-600 text-xs mt-1">Successfully processed</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-sm font-medium">Failed</span>
            <AlertCircle className={`w-5 h-5 ${stats?.failedSessions ? "text-red-500" : "text-zinc-700"}`} />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.failedSessions || 0}</p>
          <p className="text-zinc-600 text-xs mt-1">Processing failures</p>
        </div>
      </div>

      {/* Event Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <p className="text-zinc-500 text-sm font-medium mb-2">Total Events Processed</p>
          <p className="text-3xl font-bold text-indigo-500">{stats?.totalEvents || 0}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <p className="text-zinc-500 text-sm font-medium mb-2">Error Events</p>
          <p className={`text-3xl font-bold ${stats?.totalErrors ? 'text-red-500' : 'text-green-500'}`}>
            {stats?.totalErrors || 0}
          </p>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            Active Tasks
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${connected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {connected ? '🔴 Live' : '⚪ Polling'}
          </span>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-500/10 border-b border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="divide-y divide-zinc-800 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-6 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3"></div>
              <p className="text-zinc-600 text-sm">Loading tasks...</p>
            </div>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => {
                  setSelectedSession(session.sessionId);
                  setViewDetailSessionId(session.sessionId);
                }}
                className={`px-6 py-4 cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                  selectedSession === session.sessionId
                    ? "bg-zinc-800/50 border-l-2 border-indigo-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white font-medium font-mono text-sm mb-1">
                      {session.projectId} / {session.datasetId}
                    </p>
                    <p className="text-zinc-600 text-xs">
                      {new Date(session.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                    {session.status}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-zinc-800/30 rounded px-2 py-1">
                    <p className="text-zinc-600">Events</p>
                    <p className="text-white font-semibold">{session.eventCount}</p>
                  </div>
                  <div className="bg-zinc-800/30 rounded px-2 py-1">
                    <p className="text-zinc-600">Processed</p>
                    <p className="text-white font-semibold">{session.eventMetrics.processed}</p>
                  </div>
                  <div className="bg-zinc-800/30 rounded px-2 py-1">
                    <p className="text-zinc-600">Errors</p>
                    <p className={`font-semibold ${session.eventMetrics.errors ? 'text-red-500' : 'text-green-500'}`}>
                      {session.eventMetrics.errors}
                    </p>
                  </div>
                  <div className="bg-zinc-800/30 rounded px-2 py-1">
                    <p className="text-zinc-600">Duration</p>
                    <p className="text-white font-semibold">{formatDuration(session.durationMs)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <Clock className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-600 text-sm">No active task processing</p>
            </div>
          )}
        </div>
      </div>

      {/* Session Detail Modal */}
      <SessionDetailView
        session={viewDetailSession}
        onClose={() => setViewDetailSessionId(null)}
        isConnected={connected}
      />
    </div>
  );
};

export default TaskProcessingAnalytics;
