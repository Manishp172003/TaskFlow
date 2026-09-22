import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { ROLES, INITIAL_MOCK_USERS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state from localStorage
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        // Default to demo admin session if fresh run for instant review access
        const defaultAdmin = INITIAL_MOCK_USERS[0];
        const demoToken = `mock-jwt-${defaultAdmin.id}`;
        localStorage.setItem('taskflow_token', demoToken);
        localStorage.setItem('taskflow_user', JSON.stringify(defaultAdmin));
        setToken(demoToken);
        setUser(defaultAdmin);
      }
    } catch (err) {
      console.error('Error initializing auth state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, roleHint = null) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password, roleHint);
      setToken(result.token);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function for testing/demoing role switching easily
   */
  const switchRole = async (targetRole) => {
    const target = targetRole === ROLES.ADMIN ? INITIAL_MOCK_USERS[0] : INITIAL_MOCK_USERS[1];
    await login(target.email, 'password123', targetRole);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    loading,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
