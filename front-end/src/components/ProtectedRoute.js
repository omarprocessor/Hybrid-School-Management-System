import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user's actual role
    if (user.is_superuser) {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/dashboard/students" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/dashboard/teachers" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 