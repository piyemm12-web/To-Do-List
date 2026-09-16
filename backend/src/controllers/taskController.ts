import { Response } from 'express';
import Task, { ITask } from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';
import { calculateSmartScore, sortTasksBySmartScore } from '../utils/smartSort';

/**
 * @desc    Get user tasks with optional search, category, status filter, and smart sorting
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status, priority, category, search, sort } = req.query;

    const query: any = { user: userId };

    // Status filter
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }

    // Priority filter
    if (priority && priority !== 'ALL') {
      query.priority = (priority as string).toUpperCase();
    }

    // Category filter
    if (category && category !== 'ALL') {
      query.category = (category as string).toUpperCase();
    }

    // Search filter
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let tasks = await Task.find(query).lean();

    // Attach smart score calculation to each task object
    const now = new Date();
    const tasksWithScores = tasks.map((t: any) => ({
      ...t,
      smartScore: calculateSmartScore(t as ITask, now),
    }));

    // Sorting logic
    let sortedTasks = tasksWithScores;
    if (sort === 'smart' || !sort) {
      // Default: Priority & Deadline Mix Algorithm Smart Sorting
      sortedTasks = sortTasksBySmartScore(tasksWithScores as ITask[], now);
    } else if (sort === 'deadline') {
      sortedTasks = [...tasksWithScores].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    } else if (sort === 'priority') {
      const pWeights: Record<string, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      sortedTasks = [...tasksWithScores].sort(
        (a, b) => (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0)
      );
    } else if (sort === 'newest') {
      sortedTasks = [...tasksWithScores].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    res.status(200).json({
      success: true,
      count: sortedTasks.length,
      data: sortedTasks,
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching tasks' });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { title, description, priority, category, deadline } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, message: 'Task title is required' });
      return;
    }

    if (!deadline) {
      res.status(400).json({ success: false, message: 'Deadline date-time is required' });
      return;
    }

    const task = await Task.create({
      user: userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'MEDIUM',
      category: category || 'GENERAL',
      deadline: new Date(deadline),
      completed: false,
    });

    const taskObj = task.toObject();
    const smartScore = calculateSmartScore(task, new Date());

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        ...taskObj,
        smartScore,
      },
    });
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating task' });
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;

    let task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found or access denied' });
      return;
    }

    const { title, description, priority, category, deadline, completed } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (deadline !== undefined) task.deadline = new Date(deadline);
    if (completed !== undefined) {
      task.completed = completed;
      task.completedAt = completed ? new Date() : null;
    }

    await task.save();

    const taskObj = task.toObject();
    const smartScore = calculateSmartScore(task, new Date());

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        ...taskObj,
        smartScore,
      },
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating task' });
  }
};

/**
 * @desc    Toggle task completion status
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Private
 */
export const toggleTaskCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found or access denied' });
      return;
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();

    const taskObj = task.toObject();
    const smartScore = calculateSmartScore(task, new Date());

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'active'}`,
      data: {
        ...taskObj,
        smartScore,
      },
    });
  } catch (error: any) {
    console.error('Error toggling task:', error);
    res.status(500).json({ success: false, message: error.message || 'Error toggling task status' });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: taskId },
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting task' });
  }
};
