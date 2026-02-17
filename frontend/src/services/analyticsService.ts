import { apiClient } from './apiClient';

export interface HighRiskRegion {
  region: string;
  totalCases: number;
}

export interface Spike {
  region: string;
  diseaseName: string;
  growthRate: number;
  currentWeekCases: number;
  previousWeekCases: number;
  year: number;
  week: number;
  weekLabel: string;
}

export interface ComparisonPoint {
  year: number;
  week: number;
  label: string;
  totalCases: number;
}

export interface ComparisonSeries {
  region: string;
  points: ComparisonPoint[];
}

export async function fetchHighRiskRegions(): Promise<HighRiskRegion[]> {
  const { data } = await apiClient.get<{ regions: HighRiskRegion[] }>('/analytics/high-risk');
  return data.regions;
}

export async function fetchSpikes(): Promise<Spike[]> {
  const { data } = await apiClient.get<{ spikes: Spike[] }>('/analytics/spikes');
  return data.spikes;
}

export async function fetchRegionComparison(regions: string[]): Promise<ComparisonSeries[]> {
  const params: Record<string, string> = {};
  if (regions.length > 0) {
    params.regions = regions.join(',');
  }
  const { data } = await apiClient.get<{ series: ComparisonSeries[] }>('/analytics/compare', {
    params,
  });
  return data.series;
}

