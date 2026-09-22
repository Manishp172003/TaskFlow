export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  [TASK_STATUS.COMPLETED]: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  [TASK_STATUS.CANCELLED]: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
    dot: 'bg-slate-400',
  },
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  [TASK_PRIORITY.MEDIUM]: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  [TASK_PRIORITY.HIGH]: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

export const INITIAL_MOCK_USERS = [
  {
    id: 'usr_admin',
    name: 'Alexander Wright',
    email: 'admin@taskflow.com',
    role: ROLES.ADMIN,
    department: 'Engineering Leadership',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 3,
  },
  {
    id: 'usr_1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@taskflow.com',
    role: ROLES.USER,
    department: 'Frontend Engineering',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 5,
  },
  {
    id: 'usr_2',
    name: 'Alex Rivera',
    email: 'alex.rivera@taskflow.com',
    role: ROLES.USER,
    department: 'Backend Platform',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 4,
  },
  {
    id: 'usr_3',
    name: 'David Kim',
    email: 'david.kim@taskflow.com',
    role: ROLES.USER,
    department: 'QA & Automation',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 3,
  },
  {
    id: 'usr_4',
    name: 'Elena Rostova',
    email: 'elena.rostova@taskflow.com',
    role: ROLES.USER,
    department: 'Product Design',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 2,
  },
];

export const INITIAL_MOCK_TASKS = [
  {
    id: 'TSK-101',
    title: 'Architect JWT Security Filter Chain in Spring Boot',
    description: 'Implement stateless JWT token validation interceptor and configure Spring Security 6 role-based path matchers.',
    assignedToId: 'usr_2',
    priority: TASK_PRIORITY.HIGH,
    status: TASK_STATUS.IN_PROGRESS,
    dueDate: '2026-09-25',
    createdAt: '2026-09-18',
    comments: [
      {
        id: 'c1',
        authorName: 'Alexander Wright',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Ensure token expiration is set to 24 hours with refresh capability.',
        createdAt: '2026-09-19 10:30',
      },
      {
        id: 'c2',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Drafted the JwtAuthenticationFilter; working on unit test mock credentials.',
        createdAt: '2026-09-20 14:15',
      },
    ],
  },
  {
    id: 'TSK-102',
    title: 'Build Responsive Sidebar and Header Shell',
    description: 'Develop responsive navigation drawer for mobile and desktop slate sidebar following Tailwind 2563EB design guidelines.',
    assignedToId: 'usr_1',
    priority: TASK_PRIORITY.HIGH,
    status: TASK_STATUS.COMPLETED,
    dueDate: '2026-09-21',
    createdAt: '2026-09-17',
    comments: [
      {
        id: 'c3',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Sidebar layout completed with collapsible drawer on tablet and mobile.',
        createdAt: '2026-09-21 09:00',
      },
    ],
  },
  {
    id: 'TSK-103',
    title: 'Design Modal Dialog and Form System for Task Creation',
    description: 'Create reusable Modal component with focus trap, backdrop dismissal, and validation states for creating tasks.',
    assignedToId: 'usr_1',
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.IN_PROGRESS,
    dueDate: '2026-09-24',
    createdAt: '2026-09-19',
    comments: [],
  },
  {
    id: 'TSK-104',
    title: 'Automated E2E Role Navigation Test Suites',
    description: 'Set up automated tests to ensure users cannot access /admin/users or unauthorized task modification endpoints.',
    assignedToId: 'usr_3',
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.PENDING,
    dueDate: '2026-09-28',
    createdAt: '2026-09-20',
    comments: [],
  },
  {
    id: 'TSK-105',
    title: 'Refine Design Tokens & Accessibility Contrast',
    description: 'Audit WCAG 2.1 AA color contrast for primary buttons, badge status colors, and card borders.',
    assignedToId: 'usr_4',
    priority: TASK_PRIORITY.LOW,
    status: TASK_STATUS.PENDING,
    dueDate: '2026-09-30',
    createdAt: '2026-09-21',
    comments: [],
  },
  {
    id: 'TSK-106',
    title: 'Implement Database Migration Scripts for Task Auditing',
    description: 'Create Flyway or Liquibase scripts to record status change timestamps and user comments in MySQL.',
    assignedToId: 'usr_2',
    priority: TASK_PRIORITY.HIGH,
    status: TASK_STATUS.PENDING,
    dueDate: '2026-09-27',
    createdAt: '2026-09-22',
    comments: [],
  },
  {
    id: 'TSK-107',
    title: 'Optimize Dashboard Metric Aggregation Queries',
    description: 'Ensure group-by queries for task statuses and user workloads execute under 50ms.',
    assignedToId: 'usr_2',
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.COMPLETED,
    dueDate: '2026-09-20',
    createdAt: '2026-09-15',
    comments: [],
  },
  {
    id: 'TSK-108',
    title: 'Deprecated Legacy Task Sync Webhook',
    description: 'Clean up previous integration hooks that are no longer supported in TaskFlow v2.',
    assignedToId: 'usr_3',
    priority: TASK_PRIORITY.LOW,
    status: TASK_STATUS.CANCELLED,
    dueDate: '2026-09-18',
    createdAt: '2026-09-10',
    comments: [],
  },
];
