// Application Validators: Squad Schemas

import { z } from 'zod';

export const createSquadSchema = z.object({
  name: z.string().min(2, 'El nombre del squad debe tener al menos 2 caracteres').max(100),
  description: z.string().max(1000).optional().nullable()
});

export const provisionStudentSchema = z.object({
  squadId: z.number().int().positive('squadId debe ser un entero positivo'),
  email: z.string().email('Correo electronico invalido'),
  firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(100),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Fecha de nacimiento invalida (debe ser formato ISO)'
  })
});

export type CreateSquadInput = z.infer<typeof createSquadSchema>;
export type ProvisionStudentInput = z.infer<typeof provisionStudentSchema>;
