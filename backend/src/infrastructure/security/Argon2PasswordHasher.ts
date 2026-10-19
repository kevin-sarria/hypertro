// Infrastructure Security: Argon2PasswordHasher

import argon2 from 'argon2';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';

export class Argon2PasswordHasher implements IPasswordHasher {
  public async hash(plainText: string): Promise<string> {
    return argon2.hash(plainText, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1
    });
  }

  public async verify(plainText: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch {
      return false;
    }
  }
}
