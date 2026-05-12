import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not allowed, redirect to a default page based on role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
