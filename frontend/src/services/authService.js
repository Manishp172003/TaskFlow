import { INITIAL_MOCK_USERS, ROLES } from '../utils/constants';

// Simulated delay helper
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Login with email and password
   * Supports admin@taskflow.com or user email
   */
  async login(email, password, roleHint = null) {
    await delay(300);

    // Fetch existing users from localStorage or initial mock
    const storedUsers = localStorage.getItem('taskflow_users');
    const users = storedUsers ? JSON.parse(storedUsers) : INITIAL_MOCK_USERS;

    let user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    // If not matched exactly or user picked quick-login
    if (!user) {
      if (email.toLowerCase().includes('admin') || roleHint === ROLES.ADMIN) {
        user = users.find((u) => u.role === ROLES.ADMIN) || INITIAL_MOCK_USERS[0];
      } else {
        user = users.find((u) => u.role === ROLES.USER) || INITIAL_MOCK_USERS[1];
      }
    }

    const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
    };

    localStorage.setItem('taskflow_token', mockToken);
    localStorage.setItem('taskflow_user', JSON.stringify(sessionUser));

    return {
      token: mockToken,
      user: sessionUser,
    };
  },

  /**
   * Logout user and clear local storage credentials
   */
  async logout() {
    await delay(100);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    return { success: true };
  },

  /**
   * Get stored current user
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('taskflow_user');
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem('taskflow_token');
  },
};

export default authService;
