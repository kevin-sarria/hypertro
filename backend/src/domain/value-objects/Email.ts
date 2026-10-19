// Domain Value Object: Email

import { ValidationError } from '../errors/DomainError';

export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(rawEmail: string) {
    const trimmed = rawEmail.trim().toLowerCase();
    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError(`Formato de correo electronico invalido: ${rawEmail}`);
    }
    this.value = trimmed;
  }

  public static create(rawEmail: string): Email {
    return new Email(rawEmail);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
