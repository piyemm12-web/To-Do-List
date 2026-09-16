import apiClient from './client';
import { AuthResponse, User } from '../types/auth';

export const registerApi = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', { name, email, password });
  return response.data;
};

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const getMeApi = async (): Promise<{ success: boolean; data: User }> => {
  const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
  return response.data;
};
