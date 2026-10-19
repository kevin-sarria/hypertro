// Application Use Case: ChangePassword

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { UnauthorizedError, NotFoundError } from '../../../domain/errors/DomainError';
import { ChangePasswordInput } from '../../validators/auth.schemas';

export class ChangePassword {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  public async execute(userId: number, input: ChangePasswordInput): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError('La cuenta no tiene una contrasena local configurada (inicie con Google)');
    }

    const isMatch = await this.passwordHasher.verify(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('La contrasena actual es incorrecta');
    }

    const newHash = await this.passwordHasher.hash(input.newPassword);
    await this.userRepository.updatePassword(user.id, newHash);

    if (user.mustChangePassword) {
      await this.userRepository.update(user.id, { mustChangePassword: false });
    }

    return {
      message: 'Contrasena actualizada exitosamente'
    };
  }
}
