export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: string; // e.g., "99.98%"
  serverTime: string; // ISO string for sync checks
  
  // Performance Latency
  latency: {
    apiResponseTime: number; // in ms
    dbQueryTime: number; // in ms
  };

  // Error Tracking
  errorRate: number; // percentage of failed requests
  lastErrorAt: string | null;
  
  // Resource Usage
  storageUsage: number; // percentage of DB capacity
}