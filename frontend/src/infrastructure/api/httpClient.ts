// Frontend Infrastructure: Axios HTTP Client with in-memory token and 401 refresh interceptor

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

let accessTokenInMemory: string | null = null;

export const setAccessTokenInMemory = (token: string | null): void => {
  accessTokenInMemory = token;
};

export const getAccessTokenInMemory = (): string | null => {
  return accessTokenInMemory;
};

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes: inyecta Bearer token desde memoria
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessTokenInMemory && config.headers) {
    config.headers.Authorization = `Bearer ${accessTokenInMemory}`;
  }
  return config;
});

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interceptor de respuestas: refresca automáticamente si 401
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Evitar bucle si la ruta que falló con 401 fue el propio refresh o login
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        setAccessTokenInMemory(null);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessTokenInMemory(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return httpClient(originalRequest);
      } catch (refreshError) {
        setAccessTokenInMemory(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
