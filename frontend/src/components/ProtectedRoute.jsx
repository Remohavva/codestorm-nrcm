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
  if (requiredRole) {
    // Handle club_lead role requirement (allow both club_lead and admin)
    if (requiredRole === 'club_lead' && !['club_lead', 'admin'].includes(user.role)) {
      return <Navigate to="/login" state={{ error: 'Access denied. Club coordinator access required.' }} replace />;
    }
    // Handle other specific role requirements
    else if (requiredRole !== 'club_lead' && user.role !== requiredRole) {
      return <Navigate to="/login" state={{ error: 'Access denied. Insufficient permissions.' }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;