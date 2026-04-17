import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f5ece5]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f15a24]"></div>
    </div>
  );

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
