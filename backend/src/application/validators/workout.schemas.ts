// Application Validators: Workout Schemas

import { z } from 'zod';
import { ALL_FEELINGS } from '../../domain/entities/SetLog';

export const startSessionSchema = z.object({
  routineId: z.number().int().positive().optional().nullable(),
  notes: z.string().max(1000).optional().nullable()
});

export const logSetSchema = z.object({
  sessionId: z.number().int().positive('El id de sesion debe ser un entero positivo'),
  exerciseId: z.number().int().positive('El id de ejercicio debe ser un entero positivo'),
  setNumber: z.number().int().positive('El numero de serie debe ser mayor a 0'),
  weightKg: z.number().min(0, 'El peso debe ser mayor o igual a 0').max(1000, 'El peso no puede exceder 1000 kg'),
  reps: z.number().int().min(1, 'Las repeticiones deben ser al menos 1').max(100, 'Repeticiones maximas: 100'),
  rir: z.number().int().min(0, 'RIR minimo es 0').max(10, 'RIR maximo es 10').optional().nullable(),
  rpe: z
    .number()
    .min(1.0, 'RPE minimo es 1.0')
    .max(10.0, 'RPE maximo es 10.0')
    .refine((val) => (val * 10) % 5 === 0, {
      message: 'El RPE debe estar en incrementos de 0.5'
    })
    .optional()
    .nullable(),
  feeling: z.enum(ALL_FEELINGS as [string, ...string[]]).optional().nullable(),
  restSeconds: z.number().int().min(0).max(3600, 'El descanso no puede superar los 3600 segundos').optional().nullable()
});

export const finishSessionSchema = z.object({
  notes: z.string().max(1000).optional().nullable()
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type LogSetInputDTO = z.infer<typeof logSetSchema>;
export type FinishSessionInput = z.infer<typeof finishSessionSchema>;
