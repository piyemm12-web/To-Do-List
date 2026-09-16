# 🚀 React Native To-Do App with JWT Authentication & Node.js/MongoDB Backend

A modern, production-grade mobile To-Do application built with **React Native CLI (TypeScript)** and a **Node.js + Express + MongoDB** API backend. It features user authentication, full task management CRUD, task categories/tags, date-time deadlines, and an advanced **Priority & Deadline Mix Smart Sorting Algorithm**.

---

## 🌟 Features Overview

- **User Authentication**:
  - Account registration (`Email`, `Password`, `Name`)
  - Login authentication with JWT tokens
  - Token persistence via `@react-native-async-storage/async-storage`
  - Demo Account quick auto-fill button (`demo@todo.com` / `Password123!`)
- **Task CRUD Management**:
  - Add tasks with title, description, priority, category tag, and date-time deadline
  - Toggle completion status with animated strike-through visuals
  - Edit existing task details
  - Delete tasks with confirmation prompt
- **🧠 Priority & Deadline Mix Smart Sorting Algorithm**:
  - Combines explicit priority level with exponential time urgency calculation to automatically bubble up tasks nearing deadline.
  - Formula:
    $$\text{SmartScore} = (P_{\text{weight}} \times 0.55) + (\text{TimeScore} \times 0.45)$$
    - Priority Weights: Urgent (100), High (75), Medium (50), Low (25)
    - Overdue tasks receive automatic priority boost (+120 urgency bonus).
- **Filtering & Search**:
  - Real-time title & description text search
  - Status filter tabs (`All`, `Active`, `Completed`)
  - Priority filter chips (`Urgent`, `High`, `Medium`, `Low`)
  - Category tag chips (`Work`, `Personal`, `Health`, `Study`, `General`)
- **Design System & Visual Excellence**:
  - High-end dark obsidian glassmorphism theme (`#0D0F17`)
  - Neon cyan and electric violet accents
  - Dynamic productivity banner displaying real-time completion progress track bar & urgency warning alerts

---

## 🏗️ Technical Architecture & Project Structure

```
react-native-todo-app/
├── backend/                  # Node.js + Express + TypeScript + MongoDB API
│   ├── src/
│   │   ├── config/           # DB connection (with Memory Mongo Fallback) & JWT helpers
│   │   ├── controllers/      # Auth & Task business logic handlers
│   │   ├── middleware/       # Auth JWT protection & Error middleware
│   │   ├── models/           # Mongoose User & Task Schemas
│   │   ├── routes/           # Express API endpoints
│   │   ├── utils/            # Smart sorting calculation logic
│   │   ├── seed.ts           # Database seeder script
│   │   └── server.ts         # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── mobile/                   # React Native CLI TypeScript Mobile App
    ├── src/
    │   ├── api/              # Axios HTTP client & API services
    │   ├── components/       # CustomInput, CustomButton, PriorityBadge, CategoryChip, HeaderStats, TaskCard, FilterBar, AddTaskModal
    │   ├── context/          # AuthContext & TaskContext providers
    │   ├── screens/          # LoginScreen, RegisterScreen, HomeScreen
    │   ├── theme/            # Obsidian dark design system colors & typography
    │   ├── types/            # TypeScript interface definitions
    │   ├── utils/            # Client smart sorting & deadline date formatters
    │   └── App.tsx           # App root & navigation router
    ├── index.js
    └── package.json
```

---

## 🛠️ Getting Started & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Android Studio / Android Emulator or physical device (for React Native CLI)

### 1. Running the Backend API Server

```bash
cd backend
cmd /c npm install
```

To seed initial demo user (`demo@todo.com` / `Password123!`) and sample tasks:
```bash
cmd /c npm run seed
```

Start the dev server:
```bash
cmd /c npm run dev
```
> The API server starts on **http://localhost:5000**. If no external MongoDB URI is specified, it automatically starts an in-memory MongoDB server out-of-the-box!

---

### 2. Running the React Native CLI Mobile App

```bash
cd mobile
cmd /c npm install
```

Start Metro bundler & run on Android emulator:
```bash
cmd /c npm run android
```

---

## 📡 API Endpoint Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate & get JWT token | ❌ No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ Yes |

### Task Routes (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get tasks with search, filters, & smart sort | ✅ Yes |
| `POST` | `/api/tasks` | Create new task | ✅ Yes |
| `PUT` | `/api/tasks/:id` | Update task details | ✅ Yes |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completion status | ✅ Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | ✅ Yes |

---

## 🔑 Demo Account Credentials
- **Email**: `demo@todo.com`
- **Password**: `Password123!`
