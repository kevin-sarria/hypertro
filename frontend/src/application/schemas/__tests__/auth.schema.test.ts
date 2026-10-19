import { describe, it, expect } from 'vitest';
import {
  loginFormSchema,
  registerFormSchema,
  forgotPasswordFormSchema
} from '../auth.schema';

describe('auth.schema', () => {
  describe('loginFormSchema', () => {
    it('accepts valid credentials', () => {
      const result = loginFormSchema.safeParse({
        email: 'user@hypertro.app',
        password: 'Password123'
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email formats', () => {
      const result = loginFormSchema.safeParse({
        email: 'invalid-email-format',
        password: 'Password123'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Correo electronico invalido');
      }
    });

    it('rejects empty password', () => {
      const result = loginFormSchema.safeParse({
        email: 'user@hypertro.app',
        password: ''
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerFormSchema', () => {
    const validData = {
      email: 'newuser@hypertro.app',
      password: 'StrongPass123',
      firstName: 'Alex',
      lastName: 'Rios',
      birthDate: '1995-05-15',
      avatarUrl: 'https://example.com/avatar.png'
    };

    it('accepts valid registration data', () => {
      const result = registerFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts valid registration without avatarUrl', () => {
      const result = registerFormSchema.safeParse({
        ...validData,
        avatarUrl: ''
      });
      expect(result.success).toBe(true);
    });

    it('rejects passwords shorter than 10 characters', () => {
      const result = registerFormSchema.safeParse({
        ...validData,
        password: 'Short1'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => e.message);
        expect(errorMessages).toContain('La contrasena debe contener al menos 10 caracteres');
      }
    });

    it('rejects passwords without uppercase letters', () => {
      const result = registerFormSchema.safeParse({
        ...validData,
        password: 'weakpassword123'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => e.message);
        expect(errorMessages).toContain('Debe contener al menos una mayuscula');
      }
    });

    it('rejects passwords without numbers', () => {
      const result = registerFormSchema.safeParse({
        ...validData,
        password: 'WeakPasswordNoNumber'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => e.message);
        expect(errorMessages).toContain('Debe contener al menos un numero');
      }
    });

    it('rejects users younger than 13 years old', () => {
      const currentYear = new Date().getFullYear();
      const result = registerFormSchema.safeParse({
        ...validData,
        birthDate: `${currentYear - 10}-01-01`
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => e.message);
        expect(errorMessages).toContain('Debes tener al menos 13 anos para registrarte');
      }
    });

    it('rejects invalid date strings', () => {
      const result = registerFormSchema.safeParse({
        ...validData,
        birthDate: 'invalid-date'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => e.message);
        expect(errorMessages).toContain('Fecha invalida');
      }
    });
  });

  describe('forgotPasswordFormSchema', () => {
    it('accepts valid email', () => {
      const result = forgotPasswordFormSchema.safeParse({
        email: 'user@hypertro.app'
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = forgotPasswordFormSchema.safeParse({
        email: 'not-an-email'
      });
      expect(result.success).toBe(false);
    });
  });
});
