export interface EventMetrics {
  processed: number;
  errors: number;
  warnings: number;
  checkpoints: number;
}

export interface TaskSession {
  sessionId: string;
  projectId: string;
  datasetId: string;
  status: "processing" | "completed" | "failed";
  startTime: string;
  eventCount: number;
  durationMs: number;
  eventMetrics: EventMetrics;
}

export interface SystemStats {
  activeSessions: number;
  totalEvents: number;
  totalErrors: number;
  completedSessions: number;
  failedSessions: number;
  processingCount: number;
  timestamp: string;
}

export interface TaskProgressState {
  sessions: TaskSession[];
  stats: SystemStats | null;
  loading: boolean;
  error: string | null;
  selectedSession: string | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  setSelectedSession: (sessionId: string | null) => void;
  setError: (error: string | null) => void;
  refreshData: () => Promise<void>;
}
