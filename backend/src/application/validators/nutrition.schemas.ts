// Application Validators: Nutrition Schemas

import { z } from 'zod';

export const nutritionLogSchema = z.object({
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD'),
  mealName: z.string().min(1, 'El nombre de la comida es requerido').max(80),
  calories: z.number().int().min(0, 'Las calorias deben ser mayor o igual a 0'),
  proteinG: z.number().min(0, 'Las proteinas deben ser mayor o igual a 0'),
  carbsG: z.number().min(0, 'Los carbohidratos deben ser mayor o igual a 0'),
  fatG: z.number().min(0, 'Las grasas deben ser mayor o igual a 0'),
  notes: z.string().max(500).optional().nullable()
});

export const tdeeSchema = z.object({
  weightKg: z.number().positive('El peso debe ser positivo'),
  heightCm: z.number().positive('La altura debe ser positiva'),
  age: z.number().int().min(13, 'La edad minima es 13 anos').max(120),
  sex: z.enum(['male', 'female'], {
    errorMap: () => ({ message: "El sexo debe ser 'male' o 'female'" })
  }),
  activityMultiplier: z.number().min(1.0).max(2.5)
});

export type NutritionLogInputDTO = z.infer<typeof nutritionLogSchema>;
export type TdeeInputDTO = z.infer<typeof tdeeSchema>;
