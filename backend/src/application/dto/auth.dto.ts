// Application DTO: Auth

import { Role } from '../../domain/value-objects/Role';

export interface AuthUserDTO {
  id: number;
  email: string;
  role: Role;
  mustChangePassword: boolean;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDTO {
  user: AuthUserDTO;
  tokens: AuthTokensDTO;
}

export interface ProvisionResultDTO {
  user: AuthUserDTO;
  temporaryPassword: string;
  squadId: number;
}
