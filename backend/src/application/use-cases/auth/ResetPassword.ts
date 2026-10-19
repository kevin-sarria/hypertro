// Application Use Case: ResetPassword

import { createHash } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { ValidationError } from '../../../domain/errors/DomainError';
import { ResetPasswordInput } from '../../validators/auth.schemas';

export class ResetPassword {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  public async execute(input: ResetPasswordInput): Promise<{ message: string }> {
    const tokenHash = createHash('sha256').update(input.token).digest('hex');
    const user = await this.userRepository.findByResetTokenHash(tokenHash);

    if (!user || !user.isActive) {
      throw new ValidationError('El token para restablecer la contrasena es invalido o ya ha sido utilizado');
    }

    if (!user.passwordResetExpiresAt || user.passwordResetExpiresAt.getTime() < Date.now()) {
      throw new ValidationError('El token para restablecer la contrasena ha expirado');
    }

    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);

    await this.userRepository.updatePassword(user.id, newPasswordHash);
    // Invalidar token de un solo uso y revocar sesiones previas
    await this.userRepository.setPasswordResetToken(user.id, null, null);
    await this.userRepository.updateRefreshTokenHash(user.id, null);

    if (user.mustChangePassword) {
      await this.userRepository.update(user.id, { mustChangePassword: false });
    }

    return {
      message: 'Contrasena restablecida exitosamente. Ahora puedes iniciar sesion con tu nueva contrasena.'
    };
  }
}
