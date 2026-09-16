import apiClient from './client';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilterOptions } from '../types/task';

export interface TasksResponse {
  success: boolean;
  count: number;
  data: Task[];
}

export interface TaskSingleResponse {
  success: boolean;
  message?: string;
  data: Task;
}

export const fetchTasksApi = async (filters?: Partial<TaskFilterOptions>): Promise<TasksResponse> => {
  const params: any = {};
  if (filters?.status) params.status = filters.status.toLowerCase();
  if (filters?.priority && filters.priority !== 'ALL') params.priority = filters.priority;
  if (filters?.category && filters.category !== 'ALL') params.category = filters.category;
  if (filters?.search) params.search = filters.search;
  if (filters?.sort) params.sort = filters.sort.toLowerCase();

  const response = await apiClient.get<TasksResponse>('/tasks', { params });
  return response.data;
};

export const createTaskApi = async (input: CreateTaskInput): Promise<TaskSingleResponse> => {
  const response = await apiClient.post<TaskSingleResponse>('/tasks', input);
  return response.data;
};

export const updateTaskApi = async (id: string, input: UpdateTaskInput): Promise<TaskSingleResponse> => {
  const response = await apiClient.put<TaskSingleResponse>(`/tasks/${id}`, input);
  return response.data;
};

export const toggleTaskApi = async (id: string): Promise<TaskSingleResponse> => {
  const response = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/toggle`);
  return response.data;
};

export const deleteTaskApi = async (id: string): Promise<{ success: boolean; data: { id: string } }> => {
  const response = await apiClient.delete<{ success: boolean; data: { id: string } }>(`/tasks/${id}`);
  return response.data;
};
