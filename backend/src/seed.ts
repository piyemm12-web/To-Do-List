import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db';
import User from './models/User';
import Task from './models/Task';

dotenv.config();

export const runSeed = async (clearExisting = false) => {
  try {
    if (clearExisting) {
      console.log('Clearing existing seed data...');
      await User.deleteMany({});
      await Task.deleteMany({});
    }

    const existingUser = await User.findOne({ email: 'demo@todo.com' });
    if (existingUser && !clearExisting) {
      console.log('Demo user already exists, skipping auto-seed.');
      return;
    }

    console.log('Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'demo@todo.com',
      password: 'Password123!',
    });

    console.log(`Demo User Created: ${demoUser.email} (ID: ${demoUser._id})`);

    const now = new Date();
    const addHours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);
    const subtractHours = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

    const sampleTasks = [
      {
        user: demoUser._id,
        title: '🚀 Submit React Native Assignment',
        description: 'Finalize mobile UI components, smart sorting algorithm, and backend API documentation.',
        priority: 'URGENT',
        category: 'WORK',
        deadline: addHours(3), // Due in 3 hours
        completed: false,
      },
      {
        user: demoUser._id,
        title: '⚡ Code Review for Mobile App PR',
        description: 'Review state management and custom context hooks in TypeScript.',
        priority: 'HIGH',
        category: 'WORK',
        deadline: addHours(12), // Due in 12 hours
        completed: false,
      },
      {
        user: demoUser._id,
        title: '🏃 5K Morning Run & Cardio Workout',
        description: 'Maintain health goals and track progress in fitness log.',
        priority: 'HIGH',
        category: 'HEALTH',
        deadline: addHours(24), // Tomorrow morning
        completed: false,
      },
      {
        user: demoUser._id,
        title: '📚 Read MongoDB Indexing & Optimization Guide',
        description: 'Study compound indexes and query execution plans for high performance.',
        priority: 'MEDIUM',
        category: 'STUDY',
        deadline: addHours(48), // In 2 days
        completed: false,
      },
      {
        user: demoUser._id,
        title: '🛒 Weekly Grocery Shopping',
        description: 'Buy fresh produce, oat milk, meal prep ingredients, and snacks.',
        priority: 'LOW',
        category: 'PERSONAL',
        deadline: addHours(72), // In 3 days
        completed: false,
      },
      {
        user: demoUser._id,
        title: '☕ Setup Local Node.js Development Environment',
        description: 'Configure TypeScript, Nodemon, and Environment variable defaults.',
        priority: 'MEDIUM',
        category: 'WORK',
        deadline: subtractHours(5), // Already completed task
        completed: true,
        completedAt: subtractHours(4),
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`Successfully seeded ${sampleTasks.length} sample tasks!`);

    console.log('\n========================================');
    console.log('🔑 DEMO CREDENTIALS:');
    console.log('   Email: demo@todo.com');
    console.log('   Password: Password123!');
    console.log('========================================\n');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

if (require.main === module) {
  (async () => {
    await connectDB();
    await runSeed(true);
    await disconnectDB();
    process.exit(0);
  })();
}

