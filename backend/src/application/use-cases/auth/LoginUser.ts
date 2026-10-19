// Application Use Case: LoginUser

import { createHash } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { ITokenService } from '../../../domain/services/ITokenService';
import { UnauthorizedError } from '../../../domain/errors/DomainError';
import { LoginInput } from '../../validators/auth.schemas';
import { AuthResponseDTO } from '../../dto/auth.dto';

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(input: LoginInput): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedError('Credenciales incorrectas o usuario inactivo');
    }

    const isValid = await this.passwordHasher.verify(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Credenciales incorrectas o usuario inactivo');
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
