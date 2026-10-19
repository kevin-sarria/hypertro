// Domain Service Interface: ITokenService

import { Role } from '../value-objects/Role';

export interface TokenPayload {
  userId: number;
  role: Role;
}

export interface RefreshTokenPayload extends TokenPayload {
  jti: string;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenJti: string;
}

export interface ITokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): { token: string; jti: string };
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
}
