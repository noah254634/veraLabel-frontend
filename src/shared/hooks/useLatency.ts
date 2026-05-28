import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const PING_INTERVAL = 5000; // Ping every 5 seconds

export interface HealthReport {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: number;
  uptime: {
    seconds: number;
    human: string;
  };
  system: {
    platform: string;
    architecture: string;
    nodeVersion: string;
    cpuLoad: {
      '1m': string;
      '5m': string;
      '15m': string;
    };
    memory: {
      total: string;
      free: string;
      used: string;
      percentage: string;
      process: {
        rss: string;
        heapTotal: string;
        heapUsed: string;
        external: string;
      };
    };
  };
  database: {
    status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' | 'unknown';
    latency: string;
  };
  network: {
    serverUrl: string;
    environment: string;
  };
}

// Create a clean instance to avoid global interceptors affecting latency measurement
const pingApi = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  headers: { 'Cache-Control': 'no-cache' }
});

export const useLatency = () => {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<'online' | 'offline' | 'degraded'>('online');
  const [health, setHealth] = useState<HealthReport | null>(null);

  const measureLatency = useCallback(async () => {
    const start = performance.now();
    try {
      const response = await pingApi.get<HealthReport>('/ping');
      const end = performance.now();
      const rtt = Math.round(end - start);
      
      const healthData = response.data;
      setLatency(rtt);
      setHealth(healthData);
      
      // Determine UI status based on both RTT and backend reported health
      // We only show 'offline' if the request itself fails.
      // If the backend returns a status of 'critical' or 'degraded', we show 'degraded'.
      if (healthData.status === 'critical' || healthData.status === 'degraded' || rtt > 500) {
        setStatus('degraded');
      } else {
        setStatus('online');
      }
    } catch (error) {
      // Only set offline if we can't reach the server at all
      console.warn("Latency probe failed. Node may be offline.");
      setStatus('offline');
      setLatency(null);
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    measureLatency();
    const interval = setInterval(measureLatency, PING_INTERVAL);
    return () => clearInterval(interval);
  }, [measureLatency]);

  return { latency, status, health };
};
