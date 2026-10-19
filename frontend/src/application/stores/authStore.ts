// Frontend Application Store: authStore (Access token strictly in memory, user in store)

import { create } from 'zustand';
import { User } from '../../domain/entities/User';
import { setAccessTokenInMemory, getAccessTokenInMemory } from '../../infrastructure/api/httpClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  updateUser: (partialUser: Partial<User>) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, accessToken: string) => {
    setAccessTokenInMemory(accessToken);
    set({
      user,
      isAuthenticated: true,
      isLoading: false
    });
  },

  updateUser: (partialUser: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...partialUser } : null
    }));
  },

  clearAuth: () => {
    setAccessTokenInMemory(null);
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  getAccessToken: () => getAccessTokenInMemory()
}));
