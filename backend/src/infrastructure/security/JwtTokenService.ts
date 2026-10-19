// Infrastructure Security: JwtTokenService

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import {
  ITokenService,
  TokenPayload,
  RefreshTokenPayload
} from '../../domain/services/ITokenService';
import { UnauthorizedError } from '../../domain/errors/DomainError';
import { assertRole } from '../../domain/value-objects/Role';
import { env } from '../config/env';

export class JwtTokenService implements ITokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly issuer: string;
  private readonly audience = 'hypertro-app';

  constructor() {
    this.accessSecret = env.JWT_ACCESS_SECRET;
    this.refreshSecret = env.JWT_REFRESH_SECRET;
    this.issuer = env.JWT_ISSUER;
  }

  public signAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: '15m',
      issuer: this.issuer,
      audience: this.audience
    };
    return jwt.sign(payload, this.accessSecret, options);
  }

  public signRefreshToken(payload: TokenPayload): { token: string; jti: string } {
    const jti = randomUUID();
    const options: SignOptions = {
      expiresIn: '7d',
      issuer: this.issuer,
      audience: this.audience,
      jwtid: jti
    };
    const token = jwt.sign(payload, this.refreshSecret, options);
    return { token, jti };
  }

  public verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessSecret, {
        issuer: this.issuer,
        audience: this.audience
      });

      return this.extractTokenPayload(decoded);
    } catch {
      throw new UnauthorizedError('Token de acceso invalido o expirado');
    }
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        issuer: this.issuer,
        audience: this.audience
      });

      const base = this.extractTokenPayload(decoded);
      if (typeof decoded === 'object' && decoded !== null && 'jti' in decoded && typeof decoded.jti === 'string') {
        return {
          ...base,
          jti: decoded.jti
        };
      }
      throw new UnauthorizedError('Token de refresco no contiene jti valido');
    } catch {
      throw new UnauthorizedError('Token de refresco invalido o expirado');
    }
  }

  private extractTokenPayload(decoded: string | JwtPayload): TokenPayload {
    if (typeof decoded !== 'object' || decoded === null) {
      throw new UnauthorizedError('Token con estructura invalida');
    }

    const { userId, role } = decoded as Record<string, unknown>;

    if (typeof userId !== 'number') {
      throw new UnauthorizedError('Token no contiene un userId numerico valido');
    }

    assertRole(role);

    return {
      userId,
      role
    };
  }
}
