import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { User } from '../../../domain/entities/User';
import { getAccessTokenInMemory } from '../../../infrastructure/api/httpClient';

describe('authStore', () => {
  const mockUser: User = {
    id: 1,
    email: 'athlete@hypertro.app',
    role: 'gymrat',
    mustChangePassword: false,
    firstName: 'Juan',
    lastName: 'Perez'
  };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  it('sets user authentication and keeps access token strictly in memory', () => {
    const fakeToken = 'header.payload.signature_jwt_token';

    useAuthStore.getState().setAuth(mockUser, fakeToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);

    // Token must be accessible via in-memory getter
    expect(state.getAccessToken()).toBe(fakeToken);
    expect(getAccessTokenInMemory()).toBe(fakeToken);

    // CRITICAL: Token must NEVER be saved to localStorage
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();

    // Verify localStorage contains nothing or no access token in any stored json
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) ?? '';
        expect(val).not.toContain(fakeToken);
      }
    }
  });

  it('updates partial user profile information correctly', () => {
    useAuthStore.getState().setAuth(mockUser, 'test_token');

    useAuthStore.getState().updateUser({
      firstName: 'Carlos'
    });

    const updatedUser = useAuthStore.getState().user;
    expect(updatedUser?.firstName).toBe('Carlos');
    expect(updatedUser?.lastName).toBe('Perez');
    expect(updatedUser?.email).toBe('athlete@hypertro.app');
  });

  it('clears session and removes access token from memory', () => {
    useAuthStore.getState().setAuth(mockUser, 'fake_token_to_clear');
    expect(useAuthStore.getState().getAccessToken()).toBe('fake_token_to_clear');

    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.getAccessToken()).toBeNull();
    expect(getAccessTokenInMemory()).toBeNull();
  });
});
