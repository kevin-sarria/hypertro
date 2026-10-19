// Application Validators: Auth Schemas

import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(10, 'La contrasena debe contener al menos 10 caracteres')
  .regex(/[A-Z]/, 'La contrasena debe contener al menos una letra mayuscula')
  .regex(/[a-z]/, 'La contrasena debe contener al menos una letra minuscula')
  .regex(/[0-9]/, 'La contrasena debe contener al menos un numero');

const birthDateValidation = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Fecha de nacimiento invalida (debe ser formato ISO)'
  })
  .refine(
    (val) => {
      const birth = new Date(val);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 13;
    },
    {
      message: 'Debes tener al menos 13 anos para registrarte'
    }
  );

export const registerSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  password: passwordValidation,
  firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(100),
  birthDate: birthDateValidation,
  avatarUrl: z.string().url('URL de avatar invalida').optional().nullable()
});

export const loginSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  password: z.string().min(1, 'La contrasena es requerida')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electronico invalido')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
  newPassword: passwordValidation
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contrasena actual es requerida'),
  newPassword: passwordValidation
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'El id_token de Google es requerido')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
