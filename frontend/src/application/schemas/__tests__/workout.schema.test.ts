import { describe, it, expect } from 'vitest';
import { logSetFormSchema } from '../workout.schema';

describe('workout.schema', () => {
  describe('logSetFormSchema', () => {
    const validSet = {
      weightKg: 100,
      reps: 5,
      rir: 2,
      rpe: 8.0,
      feeling: 'good' as const,
      restSeconds: 90
    };

    it('accepts a valid set log entry', () => {
      const result = logSetFormSchema.safeParse(validSet);
      expect(result.success).toBe(true);
    });

    it('accepts bodyweight set with 0 kg', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        weightKg: 0
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative weight', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        weightKg: -5
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('El peso minimo es 0 kg');
      }
    });

    it('rejects weight exceeding maximum limit', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        weightKg: 1500
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('El peso maximo es 1000 kg');
      }
    });

    it('rejects 0 repetitions', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        reps: 0
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Minimo 1 repeticion');
      }
    });

    it('rejects fractional repetitions', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        reps: 5.5
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Debe ser entero');
      }
    });

    it('rejects RPE below 1.0 or above 10.0', () => {
      const resultLow = logSetFormSchema.safeParse({
        ...validSet,
        rpe: 0.5
      });
      expect(resultLow.success).toBe(false);

      const resultHigh = logSetFormSchema.safeParse({
        ...validSet,
        rpe: 10.5
      });
      expect(resultHigh.success).toBe(false);
    });

    it('rejects RPE with invalid increment (must be step of 0.5)', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        rpe: 8.2
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Incrementos de 0.5');
      }
    });

    it('accepts valid half-step RPE values (e.g., 7.5, 8.0, 9.5)', () => {
      expect(logSetFormSchema.safeParse({ ...validSet, rpe: 7.5 }).success).toBe(true);
      expect(logSetFormSchema.safeParse({ ...validSet, rpe: 9.5 }).success).toBe(true);
      expect(logSetFormSchema.safeParse({ ...validSet, rpe: 10.0 }).success).toBe(true);
    });

    it('rejects RIR outside the 0-10 range', () => {
      const resultNeg = logSetFormSchema.safeParse({
        ...validSet,
        rir: -1
      });
      expect(resultNeg.success).toBe(false);

      const resultOver = logSetFormSchema.safeParse({
        ...validSet,
        rir: 11
      });
      expect(resultOver.success).toBe(false);
    });

    it('rejects unrecognized feeling values', () => {
      const result = logSetFormSchema.safeParse({
        ...validSet,
        feeling: 'exhausted'
      });
      expect(result.success).toBe(false);
    });
  });
});
