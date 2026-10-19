// Frontend Infrastructure: authApi implementation

import { httpClient, setAccessTokenInMemory } from './httpClient';
import { IAuthApi, AuthResponse, RefreshResponse } from '../../domain/interfaces/IAuthApi';

export const authApi: IAuthApi = {
  async login(credentials) {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    setAccessTokenInMemory(response.data.accessToken);
    return response.data;
  },

  async register(data) {
    const response = await httpClient.post<AuthResponse>('/auth/register', data);
    setAccessTokenInMemory(response.data.accessToken);
    return response.data;
  },

  async refreshToken() {
    const response = await httpClient.post<RefreshResponse>('/auth/refresh');
    setAccessTokenInMemory(response.data.accessToken);
    return response.data;
  },

  async logout() {
    await httpClient.post('/auth/logout');
    setAccessTokenInMemory(null);
  },

  async requestPasswordReset(email) {
    const response = await httpClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data) {
    const response = await httpClient.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  }
};
