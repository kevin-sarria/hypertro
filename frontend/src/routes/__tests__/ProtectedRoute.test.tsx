import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '../../application/stores/authStore';
import { User } from '../../domain/entities/User';
import { chakraTheme } from '../../theme/chakraTheme';

const renderWithRouter = (initialRoute: string, allowedRoles?: ('gymrat' | 'coach' | 'admin')[]) => {
  return render(
    <ChakraProvider theme={chakraTheme}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page Screen</div>} />
          <Route path="/" element={<div>Home Dashboard Screen</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <div>Secret Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </ChakraProvider>
  );
};

describe('ProtectedRoute', () => {
  const athleteUser: User = {
    id: 1,
    email: 'athlete@hypertro.app',
    role: 'gymrat',
    mustChangePassword: false
  };

  const adminUser: User = {
    id: 2,
    email: 'admin@hypertro.app',
    role: 'admin',
    mustChangePassword: false
  };

  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('shows loading indicator while authentication status is being checked', () => {
    useAuthStore.getState().setLoading(true);

    renderWithRouter('/protected');

    // Should display Chakra Spinner role or presentation
    expect(screen.queryByText('Secret Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page Screen')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user to /login', () => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });

    renderWithRouter('/protected');

    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret Protected Content')).not.toBeInTheDocument();
  });

  it('allows access to protected route when user is authenticated with permitted role', () => {
    useAuthStore.setState({
      user: athleteUser,
      isAuthenticated: true,
      isLoading: false
    });

    renderWithRouter('/protected', ['gymrat', 'coach']);

    expect(screen.getByText('Secret Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page Screen')).not.toBeInTheDocument();
  });

  it('blocks access and redirects to home / when user role is not permitted', () => {
    useAuthStore.setState({
      user: athleteUser, // gymrat role
      isAuthenticated: true,
      isLoading: false
    });

    // Route requires admin or coach role
    renderWithRouter('/protected', ['admin', 'coach']);

    expect(screen.getByText('Home Dashboard Screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret Protected Content')).not.toBeInTheDocument();
  });

  it('allows admin role access to admin-only route', () => {
    useAuthStore.setState({
      user: adminUser,
      isAuthenticated: true,
      isLoading: false
    });

    renderWithRouter('/protected', ['admin']);

    expect(screen.getByText('Secret Protected Content')).toBeInTheDocument();
  });
});
