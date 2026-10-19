// Domain Value Object: Weight

import { ValidationError } from '../errors/DomainError';

export class Weight {
  private readonly valueKg: number;

  private constructor(weight: number) {
    if (weight < 0 || weight > 1000) {
      throw new ValidationError(`El peso debe estar entre 0 y 1000 kg (recibido: ${weight})`);
    }
    // Redondear a 2 decimales
    this.valueKg = Math.round(weight * 100) / 100;
  }

  public static create(weight: number): Weight {
    return new Weight(weight);
  }

  public getValue(): number {
    return this.valueKg;
  }
}
