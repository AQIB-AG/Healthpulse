import { apiClient } from './apiClient';

export interface PublicSummary {
  totalCases: number;
  totalRegions: number;
  totalDiseases: number;
  latestReport: string | null;
  recentCases: number;
  previousCases: number;
  weeklyChangePercent: number | null;
  highRiskRegionCount: number;
}

export interface PublicRegion {
  region: string;
  totalCases: number;
  latestReport: string;
  diseases: string[];
}

export interface PublicTrendPoint {
  date: string;
  totalCases: number;
}

export async function fetchPublicSummary(): Promise<PublicSummary> {
  const { data } = await apiClient.get<PublicSummary>('/public/summary');
  return data;
}

export async function fetchPublicRegions(): Promise<PublicRegion[]> {
  const { data } = await apiClient.get<{ regions: PublicRegion[] }>('/public/regions');
  return data.regions;
}

export async function fetchPublicTrends(params?: {
  region?: string;
  diseaseName?: string;
}): Promise<PublicTrendPoint[]> {
  const { data } = await apiClient.get<{ trends: PublicTrendPoint[] }>('/public/trends', {
    params,
  });
  return data.trends;
}

