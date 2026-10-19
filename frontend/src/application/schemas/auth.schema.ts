// Frontend Application Schema: auth.schema.ts

import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(10, 'La contrasena debe contener al menos 10 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayuscula')
  .regex(/[a-z]/, 'Debe contener al menos una minuscula')
  .regex(/[0-9]/, 'Debe contener al menos un numero');

export const loginFormSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  password: z.string().min(1, 'La contrasena es requerida')
});

export const registerFormSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  password: passwordValidation,
  firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(100),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha invalida' })
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
      { message: 'Debes tener al menos 13 anos para registrarte' }
    ),
  avatarUrl: z.string().url('URL invalida').optional().or(z.literal(''))
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email('Correo electronico invalido')
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
