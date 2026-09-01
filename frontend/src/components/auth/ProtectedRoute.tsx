import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  requiredRole?: string;
}

/**
 * ProtectedRoute — wraps admin pages.
 *
 * - If not authenticated → redirect to /admin/login (with `from` state so
 *   login can redirect back after success).
 * - If authenticated but wrong role → redirect to /admin/login.
 * - Otherwise → render child routes via <Outlet />.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
