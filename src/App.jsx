import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ToastContainer from './components/ToastContainer';

function AppRouter() {
  const { route } = useApp();
  const isAdmin = route === '/admin' || route === '/admin.html';
  const isDashboard = route === '/dashboard';

  useEffect(() => {
    if (isAdmin) {
      document.title = 'Mission 3 - Admin Studio & Frontend Customizer';
    } else if (isDashboard) {
      document.title = 'Mission 3 - Modern Interactive Trading Dashboard';
    } else {
      document.title = 'Mission 3 - Next-Gen Trading Analytics & Journal';
    }
  }, [isAdmin, isDashboard]);

  return (
    <>
      {isAdmin ? <AdminPage /> : isDashboard ? <DashboardPage /> : <LandingPage />}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

