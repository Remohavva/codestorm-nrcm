import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow admin to access all routes
  if (user.role === 'admin') {
    return children;
  }

  // Check specific role requirements
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;