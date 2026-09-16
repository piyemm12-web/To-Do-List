import { Task, TaskPriority } from '../types/task';

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  URGENT: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25,
};

export const calculateSmartScoreClient = (task: Task, now: Date = new Date()): number => {
  if (task.completed) {
    return 0;
  }

  const priorityWeight = PRIORITY_WEIGHTS[task.priority] || 50;
  const deadlineTime = new Date(task.deadline).getTime();
  const currentTime = now.getTime();
  const hoursRemaining = (deadlineTime - currentTime) / (1000 * 60 * 60);

  let timeScore: number;
  if (hoursRemaining <= 0) {
    timeScore = 120; // Overdue bonus
  } else if (hoursRemaining <= 6) {
    timeScore = 100 - (hoursRemaining / 6) * 15;
  } else if (hoursRemaining <= 24) {
    timeScore = 85 - ((hoursRemaining - 6) / 18) * 25;
  } else if (hoursRemaining <= 72) {
    timeScore = 60 - ((hoursRemaining - 24) / 48) * 30;
  } else {
    timeScore = Math.max(5, 30 - ((hoursRemaining - 72) / 168) * 25);
  }

  return Math.round((priorityWeight * 0.55 + timeScore * 0.45) * 10) / 10;
};

export const sortTasksSmartClient = (tasks: Task[]): Task[] => {
  const now = new Date();
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const scoreA = a.smartScore ?? calculateSmartScoreClient(a, now);
    const scoreB = b.smartScore ?? calculateSmartScoreClient(b, now);
    return scoreB - scoreA;
  });
};
