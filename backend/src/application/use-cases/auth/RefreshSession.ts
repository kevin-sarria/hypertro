// Application Use Case: RefreshSession (Token rotation + reuse detection)

import { createHash } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ITokenService } from '../../../domain/services/ITokenService';
import { UnauthorizedError } from '../../../domain/errors/DomainError';
import { AuthTokensDTO } from '../../dto/auth.dto';

export class RefreshSession {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(incomingRefreshToken: string): Promise<AuthTokensDTO> {
    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(incomingRefreshToken);
    } catch {
      throw new UnauthorizedError('Token de refresco invalido o expirado');
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuario no encontrado o inactivo');
    }

    const incomingHash = createHash('sha256').update(incomingRefreshToken).digest('hex');

    // Detección de reuso: si el hash no coincide con el almacenado, se usó un token viejo revocado
    if (user.refreshTokenHash !== incomingHash) {
      // Revocar inmediatamente la sesión del usuario por posible robo de token
      await this.userRepository.updateRefreshTokenHash(user.id, null);
      throw new UnauthorizedError('Deteccion de reuso de sesion: token revocado por seguridad');
    }

    // Rotación exitosa: emitir nuevo par de tokens
    const accessToken = this.tokenService.signAccessToken({
      userId: user.id,
      role: user.role
    });

    const { token: newRefreshToken } = this.tokenService.signRefreshToken({
      userId: user.id,
      role: user.role
    });

    const newHash = createHash('sha256').update(newRefreshToken).digest('hex');
    await this.userRepository.updateRefreshTokenHash(user.id, newHash);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }
}
