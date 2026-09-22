import { INITIAL_MOCK_USERS, ROLES } from '../utils/constants';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUsers = () => {
  const stored = localStorage.getItem('taskflow_users');
  if (!stored) {
    localStorage.setItem('taskflow_users', JSON.stringify(INITIAL_MOCK_USERS));
    return INITIAL_MOCK_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_USERS;
  }
};

const saveUsers = (users) => {
  localStorage.setItem('taskflow_users', JSON.stringify(users));
};

export const userService = {
  /**
   * Fetch all users
   */
  async getUsers(search = '') {
    await delay(150);
    let users = getStoredUsers();
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }
    return users;
  },

  /**
   * Get single user by ID
   */
  async getUserById(id) {
    await delay(100);
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * Create a new user
   */
  async createUser(userData) {
    await delay(200);
    const users = getStoredUsers();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || ROLES.USER,
      department: userData.department || 'General',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: userData.status || 'Active',
      assignedTasksCount: 0,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    return newUser;
  },

  /**
   * Update existing user
   */
  async updateUser(id, userData) {
    await delay(200);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    users[index] = { ...users[index], ...userData };
    saveUsers(users);
    return users[index];
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    await delay(150);
    const users = getStoredUsers();
    const filtered = users.filter((u) => u.id !== id);
    saveUsers(filtered);
    return { success: true, id };
  },
};

export default userService;
