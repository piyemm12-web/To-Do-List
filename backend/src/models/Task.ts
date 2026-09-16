import mongoose, { Schema, Document } from 'mongoose';

export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskCategory = 'WORK' | 'PERSONAL' | 'HEALTH' | 'STUDY' | 'GENERAL';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  deadline: Date;
  completed: boolean;
  completedAt?: Date | null;
  smartScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    category: {
      type: String,
      enum: ['WORK', 'PERSONAL', 'HEALTH', 'STUDY', 'GENERAL'],
      default: 'GENERAL',
    },
    deadline: {
      type: Date,
      required: [true, 'Task deadline date-time is required'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for query optimization
TaskSchema.index({ user: 1, completed: 1, priority: 1, deadline: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
