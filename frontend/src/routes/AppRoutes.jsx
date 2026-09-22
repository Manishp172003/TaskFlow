import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import Login from '../pages/auth/Login';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminTasks from '../pages/admin/Tasks';
import AdminUsers from '../pages/admin/Users';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import MyTasks from '../pages/user/MyTasks';
import Profile from '../pages/user/Profile';

export default function AppRoutes() {
  const { isAuthenticated, role, loading } = useAuth();

  // Root redirector based on authentication & role
  const RootRedirect = () => {
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return role === ROLES.ADMIN ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/dashboard" replace />
    );
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            role === ROLES.ADMIN ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/user/dashboard" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* User Protected Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Default Root Redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
