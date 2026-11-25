import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ToastContainer from './components/ToastContainer';

function AppRouter() {
  const { route } = useApp();
  const isAdmin = route === '/admin' || route === '/admin.html';

  useEffect(() => {
    document.title = isAdmin
      ? 'Mission 3 - Admin Studio & Frontend Customizer'
      : 'Mission 3 - Modern Interactive Trading Dashboard';
  }, [isAdmin]);

  return (
    <>
      {isAdmin ? <AdminPage /> : <DashboardPage />}
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

