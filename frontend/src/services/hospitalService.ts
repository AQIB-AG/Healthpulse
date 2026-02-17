import { apiClient } from './apiClient';
import type { Hospital } from './authService';

export interface HospitalReport {
  _id: string;
  hospitalId: string;
  diseaseName: string;
  region: string;
  cases: number;
  reportedAt: string;
  createdAt: string;
}

export async function submitDiseaseReport(payload: {
  diseaseName: string;
  cases: number;
  region?: string;
}): Promise<HospitalReport> {
  const { data } = await apiClient.post<{ report: HospitalReport }>('/hospital/report', payload);
  return data.report;
}

export async function fetchMyReports(): Promise<HospitalReport[]> {
  const { data } = await apiClient.get<{ reports: HospitalReport[] }>('/hospital/my-reports');
  return data.reports;
}

export type { Hospital };

