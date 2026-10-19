// Application Use Case: LogoutUser

import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class LogoutUser {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: number): Promise<void> {
    await this.userRepository.updateRefreshTokenHash(userId, null);
  }
}
