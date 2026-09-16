export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskCategory = 'WORK' | 'PERSONAL' | 'HEALTH' | 'STUDY' | 'GENERAL';
export type TaskStatusFilter = 'ALL' | 'ACTIVE' | 'COMPLETED';
export type TaskSortOption = 'SMART' | 'DEADLINE' | 'PRIORITY' | 'NEWEST';

export interface Task {
  _id: string;
  user: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  deadline: string; // ISO date string
  completed: boolean;
  completedAt?: string | null;
  smartScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  deadline: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  deadline?: string;
  completed?: boolean;
}

export interface TaskFilterOptions {
  status: TaskStatusFilter;
  priority: TaskPriority | 'ALL';
  category: TaskCategory | 'ALL';
  search: string;
  sort: TaskSortOption;
}
