// Frontend Application Use Case: loginUseCase

import { authApi } from '../../infrastructure/api/authApi';
import { useAuthStore } from '../stores/authStore';
import { LoginFormValues } from '../schemas/auth.schema';
import { AuthResponse } from '../../domain/interfaces/IAuthApi';

export async function loginUseCase(values: LoginFormValues): Promise<AuthResponse> {
  const result = await authApi.login(values);
  useAuthStore.getState().setAuth(result.user, result.accessToken);
  return result;
}
