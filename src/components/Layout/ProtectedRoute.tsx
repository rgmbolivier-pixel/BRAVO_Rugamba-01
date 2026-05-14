import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { forbiddenRedirectForRole } from '../../utils/roleAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If omitted, any logged-in user may access (use sparingly). */
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={forbiddenRedirectForRole()} replace />;
  }

  return <>{children}</>;
};
