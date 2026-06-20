import { api } from "../../../shared/types/api";

export interface SAM2Telemetry {
  status: string;
  uptime_seconds: number;
  total_embeddings_generated: number;
  total_masks_decoded: number;
  avg_embedding_latency_sec: number;
  avg_decode_latency_sec: number;
  error_count: number;
  gpu_memory_mb: number;
  device: string;
  mock_mode: boolean;
  checkpoint: string;
}

export const mlService = {
  getTelemetry: async (): Promise<SAM2Telemetry | null> => {
    try {
      const response = await api.get("/admin/ml/sam2/telemetry");
      return response.data.data?.telemetry ?? null;
    } catch (error) {
      console.error("Failed to fetch SAM2 telemetry", error);
      return null;
    }
  },

  updateSettings: async (settings: { mock_mode?: boolean; device?: string }): Promise<any> => {
    const response = await api.post("/admin/ml/sam2/settings", settings);
    return response.data.data;
  }
};
