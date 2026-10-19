// Router: AppRouter with React.lazy and Suspense

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ProtectedRoute } from './ProtectedRoute';
import { Spinner } from '../components/atoms/Spinner';

// Carga perezosa (lazy load) de las páginas
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const WorkoutPage = lazy(() => import('../pages/WorkoutPage'));
const NutritionPage = lazy(() => import('../pages/NutritionPage'));
const CoachPage = lazy(() => import('../pages/CoachPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const FallbackLoader: React.FC = () => (
  <Box minHeight="100vh" bg="#09090b" display="flex" alignItems="center" justifyContent="center">
    <Spinner size="xl" />
  </Box>
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rutas Protegidas Generales (gymrat, coach, admin) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <WorkoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <NutritionPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas Protegidas para Coach y Admin */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <CoachPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas Exclusivas de Administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 No Encontrado */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
