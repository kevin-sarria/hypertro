import { describe, it, expect } from 'vitest';
import { registerSchema } from '../../src/application/validators/auth.schemas';

describe('registerSchema validation', () => {
  it('debe validar un registro con datos correctos y edad mayor a 13', () => {
    const validData = {
      email: 'gymrat@example.com',
      password: 'StrongPassword123!',
      firstName: 'Franco',
      lastName: 'Columbu',
      birthDate: '1995-05-15'
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('debe rechazar contraseñas débiles (<10 chars, sin mayúsculas o números)', () => {
    const short = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Pass1',
      firstName: 'A',
      lastName: 'B',
      birthDate: '2000-01-01'
    });
    expect(short.success).toBe(false);

    const noNumbers = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'PasswordSinNumeros',
      firstName: 'A',
      lastName: 'B',
      birthDate: '2000-01-01'
    });
    expect(noNumbers.success).toBe(false);
  });

  it('debe rechazar usuarios menores de 13 años', () => {
    const now = new Date();
    const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());

    const result = registerSchema.safeParse({
      email: 'kid@example.com',
      password: 'ValidPassword123',
      firstName: 'Nino',
      lastName: 'Pequeno',
      birthDate: tenYearsAgo.toISOString().slice(0, 10)
    });

    expect(result.success).toBe(false);
  });
});
