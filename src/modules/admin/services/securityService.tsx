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

export const securityService = {
  fetchGeoAccessLogs: async (): Promise<GeoAccessLog[]> => {
    const response = await api.get("/admin/geo-access-logs");
    return response.data.data?.logs ?? [];
  },
  fetchGeoAnalytics: async (): Promise<GeoAnalytics> => {
    const response = await api.get("/admin/geo-analytics");
    return response.data.data?.analytics ?? {
      totalUniqueVisitors: 0,
      countryBreakdown: [],
      blockStatusBreakdown: []
    };
  }
};
