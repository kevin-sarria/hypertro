// Route Guard: ProtectedRoute

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAuthStore } from '../application/stores/authStore';
import { UserRole } from '../domain/entities/User';
import { Spinner } from '../components/atoms/Spinner';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box minHeight="100vh" bg="#09090b" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
