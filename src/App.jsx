import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ApiKeys from './pages/ApiKeys';
import AuditLogs from './pages/AuditLogs';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppLayout() {
  const { token } = useAuth();
  
  return (
    <div className="flex bg-[#f5ece5] min-h-screen">
      {token && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/keys" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ApiKeys />
            </ProtectedRoute>
          } />
          
          <Route path="/logs" element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          } />
          
          <Route path="/alerts" element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
