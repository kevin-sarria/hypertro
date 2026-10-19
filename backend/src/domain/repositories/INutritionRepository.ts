// Domain Repository Interface: INutritionRepository

import { NutritionLog } from '../entities/NutritionLog';

export interface CreateNutritionLogData {
  userId: number;
  logDate: string;
  mealName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes?: string | null;
}

export interface DailyNutritionSummary {
  logDate: string;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  mealCount: number;
}

export interface INutritionRepository {
  create(data: CreateNutritionLogData): Promise<NutritionLog>;
  findByUserIdAndDate(userId: number, logDate: string): Promise<NutritionLog[]>;
  getDailySummary(userId: number, logDate: string): Promise<DailyNutritionSummary>;
}
