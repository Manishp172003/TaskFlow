import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import Loader from '../components/common/Loader';

export default function AdminRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <Loader fullPage text="Verifying administrative permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== ROLES.ADMIN) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
