import { describe, it, expect } from 'vitest';
import { logSetSchema } from '../../src/application/validators/workout.schemas';

describe('logSetSchema validation', () => {
  it('debe validar exitosamente una serie con todos los campos correctos', () => {
    const validData = {
      sessionId: 1,
      exerciseId: 5,
      setNumber: 1,
      weightKg: 80.5,
      reps: 10,
      rir: 2,
      rpe: 8.0,
      feeling: 'good',
      restSeconds: 120
    };

    const result = logSetSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('debe rechazar pesos negativos o excesivos (>1000 kg)', () => {
    const negative = logSetSchema.safeParse({
      sessionId: 1,
      exerciseId: 5,
      setNumber: 1,
      weightKg: -5,
      reps: 10
    });
    expect(negative.success).toBe(false);

    const excessive = logSetSchema.safeParse({
      sessionId: 1,
      exerciseId: 5,
      setNumber: 1,
      weightKg: 1005,
      reps: 10
    });
    expect(excessive.success).toBe(false);
  });

  it('debe rechazar repeticiones menores a 1', () => {
    const result = logSetSchema.safeParse({
      sessionId: 1,
      exerciseId: 5,
      setNumber: 1,
      weightKg: 50,
      reps: 0
    });
    expect(result.success).toBe(false);
  });

  it('debe validar que el RPE cumpla con incrementos de 0.5', () => {
    const invalidStep = logSetSchema.safeParse({
      sessionId: 1,
      exerciseId: 5,
      setNumber: 1,
      weightKg: 50,
      reps: 8,
      rpe: 8.3
    });
    expect(invalidStep.success).toBe(false);

    const validStep = logSetSchema.safeParse({
      sessionId: 1,
      exerciseId: 5,
      setNumber: 1,
      weightKg: 50,
      reps: 8,
      rpe: 8.5
    });
    expect(validStep.success).toBe(true);
  });
});
