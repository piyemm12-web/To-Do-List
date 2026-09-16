import { ITask, TaskPriority } from '../models/Task';

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  URGENT: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25,
};

/**
 * Calculates a dynamic urgency smart score for a task combining Priority level and Deadline time remaining.
 * Higher scores represent higher priority for immediate execution.
 */
export const calculateSmartScore = (task: ITask, now: Date = new Date()): number => {
  if (task.completed) {
    return 0; // Completed tasks sink to the bottom
  }

  const priorityWeight = PRIORITY_WEIGHTS[task.priority] || 50;
  const deadlineTime = new Date(task.deadline).getTime();
  const currentTime = now.getTime();
  const hoursRemaining = (deadlineTime - currentTime) / (1000 * 60 * 60);

  let timeScore: number;
  if (hoursRemaining <= 0) {
    // Overdue task! Assign maximum urgency score + overdue bonus
    timeScore = 120;
  } else if (hoursRemaining <= 6) {
    // Due within 6 hours (critical window)
    timeScore = 100 - (hoursRemaining / 6) * 15;
  } else if (hoursRemaining <= 24) {
    // Due within 24 hours
    timeScore = 85 - ((hoursRemaining - 6) / 18) * 25;
  } else if (hoursRemaining <= 72) {
    // Due within 3 days
    timeScore = 60 - ((hoursRemaining - 24) / 48) * 30;
  } else {
    // Due after 3 days
    timeScore = Math.max(5, 30 - ((hoursRemaining - 72) / 168) * 25);
  }

  // Smart score weighted mix: 55% priority, 45% time urgency
  const smartScore = priorityWeight * 0.55 + timeScore * 0.45;
  return Math.round(smartScore * 10) / 10;
};

/**
 * Sorts array of tasks in descending order of smart score (Highest urgency first)
 */
export const sortTasksBySmartScore = <T extends ITask>(tasks: T[], now: Date = new Date()): T[] => {
  return [...tasks].sort((a, b) => {
    // Active tasks come before completed tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const scoreA = calculateSmartScore(a, now);
    const scoreB = calculateSmartScore(b, now);
    return scoreB - scoreA;
  });
};
