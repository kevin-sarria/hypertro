// Application Use Case: RegisterUser

import { createHash } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { ITokenService } from '../../../domain/services/ITokenService';
import { ConflictError, NotFoundError } from '../../../domain/errors/DomainError';
import { ROLES } from '../../../domain/value-objects/Role';
import { RegisterInput } from '../../validators/auth.schemas';
import { AuthResponseDTO } from '../../dto/auth.dto';

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(input: RegisterInput): Promise<AuthResponseDTO> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Ya existe una cuenta con este correo electronico');
    }

    const roleId = await this.userRepository.findRoleIdByName(ROLES.GYMRAT);
    if (!roleId) {
      throw new NotFoundError('El rol gymrat no esta configurado en la base de datos');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const birthDate = new Date(input.birthDate);

    const user = await this.userRepository.create(
      {
        roleId,
        email: input.email.toLowerCase().trim(),
        passwordHash,
        isActive: true,
        mustChangePassword: false
      },
      {
        userId: 0, // El repo asignará el id insertado
        firstName: input.firstName,
        lastName: input.lastName,
        birthDate,
        avatarUrl: input.avatarUrl ?? null
      }
    );

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

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        firstName: input.firstName,
        lastName: input.lastName,
        avatarUrl: input.avatarUrl ?? null
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }
}
