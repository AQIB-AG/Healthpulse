import { apiClient } from './apiClient';

export interface Hospital {
  _id: string;
  name: string;
  email: string;
  region: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  hospital: Hospital;
}

export async function registerHospital(payload: {
  name: string;
  email: string;
  password: string;
  region: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function loginHospital(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function fetchCurrentHospital(): Promise<Hospital> {
  const { data } = await apiClient.get<{ hospital: Hospital }>('/auth/me');
  return data.hospital;
}

