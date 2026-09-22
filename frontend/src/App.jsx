import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import RouteProgressBar from './components/common/RouteProgressBar';
import RoleSwitchOverlay from './components/common/RoleSwitchOverlay';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          {/* Top route progress bar */}
          <RouteProgressBar />

          {/* Full-screen role transition loader */}
          <RoleSwitchOverlay />

          {/* Application routes */}
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

