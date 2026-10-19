import { describe, it, expect } from 'vitest';
import { CalculateTdee } from '../../src/application/use-cases/nutrition/CalculateTdee';

describe('CalculateTdee use case', () => {
  const calculateTdee = new CalculateTdee();

  it('debe calcular BMR, TDEE y macronutrientes correctamente para un hombre', () => {
    // Hombre: 80kg, 180cm, 25 años, moderadamente activo (1.55)
    // BMR = 10(80) + 6.25(180) - 5(25) + 5 = 800 + 1125 - 125 + 5 = 1805
    // TDEE = 1805 * 1.55 = 2797.75 -> 2798 kcal
    // Proteína: 80 * 2 = 160g (640 kcal)
    // Grasa: 25% de 2798 = 699.5 kcal -> 700 kcal / 9 = ~78g
    // Carbohidratos: 2798 - 640 - 700 = 1458 kcal / 4 = ~365g
    const result = calculateTdee.execute({
      weightKg: 80,
      heightCm: 180,
      age: 25,
      sex: 'male',
      activityMultiplier: 1.55
    });

    expect(result.bmr).toBe(1805);
    expect(result.tdee).toBe(2798);
    expect(result.proteinG).toBe(160);
    expect(result.proteinKcal).toBe(640);
    expect(result.fatKcal).toBe(700);
    expect(result.fatG).toBe(78);
    expect(result.carbsKcal).toBe(1458);
    expect(result.carbsG).toBe(365);
  });

  it('debe calcular BMR para una mujer restando 161 según fórmula Mifflin-St Jeor', () => {
    // Mujer: 60kg, 165cm, 30 años, ligeramente activa (1.375)
    // BMR = 10(60) + 6.25(165) - 5(30) - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
    // TDEE = 1320 * 1.375 = 1815 kcal
    const result = calculateTdee.execute({
      weightKg: 60,
      heightCm: 165,
      age: 30,
      sex: 'female',
      activityMultiplier: 1.375
    });

    expect(result.bmr).toBe(1320);
    expect(result.tdee).toBe(1815);
    expect(result.proteinG).toBe(120);
  });
});
