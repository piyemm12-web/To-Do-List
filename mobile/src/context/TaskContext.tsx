import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterOptions,
  TaskPriority,
  TaskCategory,
  TaskStatusFilter,
  TaskSortOption,
} from '../types/task';
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  toggleTaskApi,
  deleteTaskApi,
} from '../api/taskApi';
import { useAuth } from './AuthContext';
import { sortTasksSmartClient } from '../utils/smartSort';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: TaskFilterOptions;
  stats: {
    total: number;
    completed: number;
    active: number;
    overdue: number;
    urgentActiveCount: number;
  };
  setFilterStatus: (status: TaskStatusFilter) => void;
  setFilterPriority: (priority: TaskPriority | 'ALL') => void;
  setFilterCategory: (category: TaskCategory | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (sort: TaskSortOption) => void;
  refreshTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<Task>;
  editTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

const defaultFilters: TaskFilterOptions = {
  status: 'ALL',
  priority: 'ALL',
  category: 'ALL',
  search: '',
  sort: 'SMART',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterOptions>(defaultFilters);

  const loadTasks = useCallback(async (showFullLoader = false) => {
    if (!isAuthenticated) return;
    if (showFullLoader) setIsLoading(true);
    setError(null);

    try {
      const res = await fetchTasksApi(filters);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setError(err.response?.data?.message || 'Error connecting to backend API');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks(true);
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, filters, loadTasks]);

  const refreshTasks = async () => {
    setIsRefreshing(true);
    await loadTasks(false);
  };

  const addTask = async (input: CreateTaskInput): Promise<Task> => {
    setIsLoading(true);
    try {
      const res = await createTaskApi(input);
      if (res.success && res.data) {
        await loadTasks(false);
        return res.data;
      }
      throw new Error(res.message || 'Failed to create task');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error creating task';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const editTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
    try {
      const res = await updateTaskApi(id, input);
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.data : t))
        );
        return res.data;
      }
      throw new Error(res.message || 'Failed to update task');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error updating task';
      setError(msg);
      throw new Error(msg);
    }
  };

  const toggleTask = async (id: string): Promise<void> => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => {
        if (t._id === id) {
          const newCompleted = !t.completed;
          return {
            ...t,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : null,
          };
        }
        return t;
      })
    );

    try {
      const res = await toggleTaskApi(id);
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.data : t))
        );
      }
    } catch (err: any) {
      console.error('Failed to toggle task, reverting state:', err);
      // Revert optimism if failed
      await loadTasks(false);
    }
  };

  const removeTask = async (id: string): Promise<void> => {
    // Optimistic UI remove
    const originalTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await deleteTaskApi(id);
    } catch (err: any) {
      console.error('Failed to delete task, reverting state:', err);
      setTasks(originalTasks);
    }
  };

  const setFilterStatus = (status: TaskStatusFilter) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setFilterPriority = (priority: TaskPriority | 'ALL') => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  const setFilterCategory = (category: TaskCategory | 'ALL') => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setSearchQuery = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const setSortOption = (sort: TaskSortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  // Compute live statistics for top header banner
  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(
    (t) => !t.completed && new Date(t.deadline).getTime() < now.getTime()
  ).length;
  const urgentActiveCount = tasks.filter(
    (t) => !t.completed && (t.priority === 'URGENT' || t.priority === 'HIGH')
  ).length;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        isRefreshing,
        error,
        filters,
        stats: { total, completed, active, overdue, urgentActiveCount },
        setFilterStatus,
        setFilterPriority,
        setFilterCategory,
        setSearchQuery,
        setSortOption,
        refreshTasks,
        addTask,
        editTask,
        toggleTask,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
