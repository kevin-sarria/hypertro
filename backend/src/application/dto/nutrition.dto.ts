// Application DTO: Nutrition and TDEE

import { NutritionLogProps } from '../../domain/entities/NutritionLog';
import { DailyNutritionSummary } from '../../domain/repositories/INutritionRepository';

export interface NutritionLogDTO extends NutritionLogProps {}

export interface DailySummaryDTO extends DailyNutritionSummary {}

export interface TdeeResultDTO {
  bmr: number;
  tdee: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  proteinKcal: number;
  fatKcal: number;
  carbsKcal: number;
}
