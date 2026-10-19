// Frontend Application Hook: useAuth

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../../infrastructure/api/authApi';
import { LoginFormValues, RegisterFormValues } from '../schemas/auth.schema';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi.refreshToken();
      // Si el refresh tuvo éxito pero aún no tenemos datos del usuario, podemos consultar o mantener
      if (res.accessToken && !user) {
        // En una app completa se obtendría el perfil con /auth/me
      }
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth, setLoading, user]);

  useEffect(() => {
    if (!isAuthenticated && isLoading) {
      initAuth();
    }
  }, [initAuth, isAuthenticated, isLoading]);

  const login = async (values: LoginFormValues) => {
    const data = await authApi.login(values);
    setAuth(data.user, data.accessToken);
    return data;
  };

  const register = async (values: RegisterFormValues) => {
    const data = await authApi.register({
      ...values,
      avatarUrl: values.avatarUrl || null
    });
    setAuth(data.user, data.accessToken);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };
}
