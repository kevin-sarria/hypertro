// Domain Value Object: RPE (Rate of Perceived Exertion)

import { ValidationError } from '../errors/DomainError';

export class Rpe {
  private readonly value: number;

  private constructor(rpe: number) {
    if (rpe < 1.0 || rpe > 10.0) {
      throw new ValidationError(`El RPE debe estar comprendido entre 1.0 y 10.0 (recibido: ${rpe})`);
    }
    // Paso de 0.5 (ej. 7.0, 7.5, 8.0, etc.)
    const remainder = (rpe * 10) % 5;
    if (remainder !== 0) {
      throw new ValidationError(`El RPE debe ser en incrementos de 0.5 (recibido: ${rpe})`);
    }
    this.value = rpe;
  }

  public static create(rpe: number): Rpe {
    return new Rpe(rpe);
  }

  public getValue(): number {
    return this.value;
  }
}
