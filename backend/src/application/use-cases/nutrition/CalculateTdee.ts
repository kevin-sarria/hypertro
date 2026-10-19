// Application Use Case: CalculateTdee (Pure calculation based on Mifflin-St Jeor)

import { TdeeResultDTO } from '../../dto/nutrition.dto';
import { TdeeInputDTO } from '../../validators/nutrition.schemas';

export class CalculateTdee {
  public execute(input: TdeeInputDTO): TdeeResultDTO {
    const { weightKg, heightCm, age, sex, activityMultiplier } = input;

    // 1. Cálculo de BMR según Mifflin-St Jeor
    let baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (sex === 'male') {
      baseBmr += 5;
    } else {
      baseBmr -= 161;
    }

    const bmr = Math.round(baseBmr);
    const tdee = Math.round(bmr * activityMultiplier);

    // 2. Reparto de macronutrientes:
    // - Proteína: 2 g/kg de peso corporal (4 kcal/g)
    const proteinG = Math.round(2 * weightKg);
    const proteinKcal = proteinG * 4;

    // - Grasa: 25% del total de calorías del TDEE (9 kcal/g)
    const fatKcal = Math.round(tdee * 0.25);
    const fatG = Math.round(fatKcal / 9);

    // - Carbohidratos: el resto de las calorías (4 kcal/g)
    const carbsKcal = Math.max(0, tdee - proteinKcal - fatKcal);
    const carbsG = Math.round(carbsKcal / 4);

    return {
      bmr,
      tdee,
      proteinG,
      fatG,
      carbsG,
      proteinKcal,
      fatKcal,
      carbsKcal
    };
  }
}
