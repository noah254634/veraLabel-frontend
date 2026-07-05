import { api } from "../../../shared/types/api";

export interface GeoAccessLog {
  _id: string;
  ip: string;
  country: string;
  city: string;
  timezone: string;
  coordinates: number[];
  userAgent: string;
  lastPath: string;
  lastMethod: string;
  isBlocked: boolean;
  hits: number;
  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountryStat {
  _id: string; // country code
  uniqueVisitors: number;
  totalHits: number;
}

export interface BlockStat {
  _id: boolean; // isBlocked
  uniqueVisitors: number;
  totalHits: number;
}

export interface GeoAnalytics {
  totalUniqueVisitors: number;
  countryBreakdown: CountryStat[];
  blockStatusBreakdown: BlockStat[];
}

export type GeoTimeRange = "30m" | "1h" | "2h" | "3h" | "6h" | "12h" | "24h" | "7d";

export const GEO_TIME_RANGE_LABELS: Record<GeoTimeRange, string> = {
  "30m": "Last 30 min",
  "1h": "30m - 1h",
  "2h": "1h - 2h",
  "3h": "2h - 3h",
  "6h": "3h - 6h",
  "12h": "6h - 12h",
  "24h": "12h - 24h",
  "7d": "Last 7 days",
};

export interface GeoRequestAudit {
  _id: string;
  ip: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  userRole?: string | null;
  country: string;
  city: string;
  timezone: string;
  path: string;
  method: string;
  statusCode: number;
  isBlocked: boolean;
  userAgent: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export const securityService = {
  fetchGeoAccessLogs: async (timeRange: GeoTimeRange = "7d"): Promise<GeoAccessLog[]> => {
    const response = await api.get("/admin/geo-access-logs", { params: { timeRange } });
    return response.data.data?.logs ?? [];
  },
  fetchGeoRequestAudits: async (timeRange: GeoTimeRange = "7d"): Promise<GeoRequestAudit[]> => {
    const response = await api.get("/admin/geo-request-audits", { params: { timeRange } });
    return response.data.data?.audits ?? [];
  },
  fetchGeoAnalytics: async (timeRange: GeoTimeRange = "7d"): Promise<GeoAnalytics> => {
    const response = await api.get("/admin/geo-analytics", { params: { timeRange } });
    return response.data.data?.analytics ?? {
      totalUniqueVisitors: 0,
      countryBreakdown: [],
      blockStatusBreakdown: []
    };
  }
};
