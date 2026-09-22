import { INITIAL_MOCK_TASKS } from '../utils/constants';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredTasks = () => {
  const stored = localStorage.getItem('taskflow_tasks');
  if (!stored) {
    localStorage.setItem('taskflow_tasks', JSON.stringify(INITIAL_MOCK_TASKS));
    return INITIAL_MOCK_TASKS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_TASKS;
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
};

export const taskService = {
  /**
   * Fetch all tasks with optional filters
   */
  async getTasks(filters = {}) {
    await delay(200);
    let tasks = getStoredTasks();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.id.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'ALL') {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }

    if (filters.assignedToId && filters.assignedToId !== 'ALL') {
      tasks = tasks.filter((t) => t.assignedToId === filters.assignedToId);
    }

    return tasks;
  },

  /**
   * Get single task by ID
   */
  async getTaskById(id) {
    await delay(100);
    const tasks = getStoredTasks();
    return tasks.find((t) => t.id === id) || null;
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    await delay(250);
    const tasks = getStoredTasks();
    const nextNum = 100 + tasks.length + 1;
    const newTask = {
      id: `TSK-${nextNum}`,
      title: taskData.title,
      description: taskData.description || '',
      assignedToId: taskData.assignedToId,
      priority: taskData.priority,
      status: taskData.status || 'Pending',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    return newTask;
  },

  /**
   * Update existing task
   */
  async updateTask(id, taskData) {
    await delay(250);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...tasks[index],
      ...taskData,
    };
    tasks[index] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  },

  /**
   * Update only task status
   */
  async updateTaskStatus(id, newStatus) {
    await delay(150);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    tasks[index].status = newStatus;
    saveTasks(tasks);
    return tasks[index];
  },

  /**
   * Delete a task
   */
  async deleteTask(id) {
    await delay(200);
    const tasks = getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    saveTasks(filtered);
    return { success: true, id };
  },

  /**
   * Add a comment to a task
   */
  async addComment(taskId, comment) {
    await delay(150);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    const newComment = {
      id: `c_${Date.now()}`,
      authorName: comment.authorName,
      authorAvatar: comment.authorAvatar || '',
      content: comment.content,
      createdAt: new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (!tasks[index].comments) {
      tasks[index].comments = [];
    }
    tasks[index].comments.push(newComment);
    saveTasks(tasks);
    return newComment;
  },
};

export default taskService;
