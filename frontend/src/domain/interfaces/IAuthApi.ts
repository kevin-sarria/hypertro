// Frontend Domain Interface: IAuthApi

import { User } from '../entities/User';

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface IAuthApi {
  login(credentials: { email: string; password: string }): Promise<AuthResponse>;
  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    avatarUrl?: string | null;
  }): Promise<AuthResponse>;
  refreshToken(): Promise<RefreshResponse>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<{ message: string }>;
  resetPassword(data: { token: string; newPassword: string }): Promise<{ message: string }>;
}
