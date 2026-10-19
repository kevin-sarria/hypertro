// Frontend Application Schema: workout.schema.ts

import { z } from 'zod';

export const logSetFormSchema = z.object({
  weightKg: z
    .number({ invalid_type_error: 'Ingresa un peso valido' })
    .min(0, 'El peso minimo es 0 kg')
    .max(1000, 'El peso maximo es 1000 kg'),
  reps: z
    .number({ invalid_type_error: 'Ingresa repeticiones validas' })
    .int('Debe ser entero')
    .min(1, 'Minimo 1 repeticion')
    .max(100, 'Maximo 100 repeticiones'),
  rir: z
    .number()
    .int()
    .min(0, 'RIR minimo 0')
    .max(10, 'RIR maximo 10')
    .optional()
    .nullable(),
  rpe: z
    .number()
    .min(1.0, 'RPE minimo 1.0')
    .max(10.0, 'RPE maximo 10.0')
    .refine((val) => (val * 10) % 5 === 0, {
      message: 'Incrementos de 0.5'
    })
    .optional()
    .nullable(),
  feeling: z.enum(['bad', 'ok', 'good', 'great']).optional().nullable(),
  restSeconds: z.number().int().min(0).max(3600).optional().nullable()
});

export type LogSetFormValues = z.infer<typeof logSetFormSchema>;
