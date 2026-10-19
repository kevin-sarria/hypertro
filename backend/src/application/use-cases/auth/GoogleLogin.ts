// Application Use Case: GoogleLogin

import { createHash } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGoogleAuthProvider } from '../../../domain/services/IGoogleAuthProvider';
import { ITokenService } from '../../../domain/services/ITokenService';
import { NotFoundError } from '../../../domain/errors/DomainError';
import { ROLES } from '../../../domain/value-objects/Role';
import { AuthResponseDTO } from '../../dto/auth.dto';
import { GoogleLoginInput } from '../../validators/auth.schemas';

export class GoogleLogin {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly googleAuthProvider: IGoogleAuthProvider,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(input: GoogleLoginInput): Promise<AuthResponseDTO> {
    const payload = await this.googleAuthProvider.verifyIdToken(input.idToken);

    let user = await this.userRepository.findByGoogleId(payload.googleId);

    if (!user) {
      // Intentar vincular por correo si ya existía cuenta tradicional
      user = await this.userRepository.findByEmail(payload.email);
      if (user) {
        // Enlazar google_id y marcar email verificado
        await this.userRepository.update(user.id, {
          emailVerifiedAt: new Date()
        });
      } else {
        // Crear nuevo usuario con rol gymrat
        const roleId = await this.userRepository.findRoleIdByName(ROLES.GYMRAT);
        if (!roleId) {
          throw new NotFoundError('El rol gymrat no esta configurado');
        }

        user = await this.userRepository.create(
          {
            roleId,
            email: payload.email.toLowerCase().trim(),
            passwordHash: null,
            googleId: payload.googleId,
            isActive: true,
            emailVerifiedAt: new Date(),
            mustChangePassword: false
          },
          {
            userId: 0,
            firstName: payload.firstName || 'Usuario',
            lastName: payload.lastName || '',
            birthDate: new Date('2000-01-01'), // Fecha provisional si no es provista
            avatarUrl: payload.avatarUrl ?? null
          }
        );
      }
    }

    const accessToken = this.tokenService.signAccessToken({
      userId: user.id,
      role: user.role
    });

    const { token: refreshToken } = this.tokenService.signRefreshToken({
      userId: user.id,
      role: user.role
    });

    const refreshHash = createHash('sha256').update(refreshToken).digest('hex');
    await this.userRepository.updateRefreshTokenHash(user.id, refreshHash);
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const profile = await this.userRepository.getProfile(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        avatarUrl: profile?.avatarUrl ?? null
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }
}
