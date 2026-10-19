// Application Use Case: LogNutrition

import { INutritionRepository } from '../../../domain/repositories/INutritionRepository';
import { NutritionLogDTO } from '../../dto/nutrition.dto';
import { NutritionLogInputDTO } from '../../validators/nutrition.schemas';

export class LogNutrition {
  constructor(private readonly nutritionRepository: INutritionRepository) {}

  public async execute(userId: number, input: NutritionLogInputDTO): Promise<NutritionLogDTO> {
    const log = await this.nutritionRepository.create({
      userId,
      logDate: input.logDate,
      mealName: input.mealName,
      calories: input.calories,
      proteinG: input.proteinG,
      carbsG: input.carbsG,
      fatG: input.fatG,
      notes: input.notes
    });

    return {
      id: log.id,
      userId: log.userId,
      logDate: log.logDate,
      mealName: log.mealName,
      calories: log.calories,
      proteinG: log.proteinG,
      carbsG: log.carbsG,
      fatG: log.fatG,
      notes: log.notes,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt
    };
  }
}
