// Infrastructure HTTP Controller: NutritionController

import { Request, Response, NextFunction } from 'express';
import { LogNutrition } from '../../../application/use-cases/nutrition/LogNutrition';
import { CalculateTdee } from '../../../application/use-cases/nutrition/CalculateTdee';
import { INutritionRepository } from '../../../domain/repositories/INutritionRepository';
import { UnauthorizedError, ValidationError } from '../../../domain/errors/DomainError';

export class NutritionController {
  constructor(
    private readonly logNutritionUseCase: LogNutrition,
    private readonly calculateTdeeUseCase: CalculateTdee,
    private readonly nutritionRepository: INutritionRepository
  ) {}

  public logMeal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const log = await this.logNutritionUseCase.execute(req.auth.userId, req.body);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  };

  public getDailyLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const dateStr = (req.query['date'] as string | undefined) ?? new Date().toISOString().slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new ValidationError('El parametro date debe tener formato YYYY-MM-DD');
      }

      const logs = await this.nutritionRepository.findByUserIdAndDate(req.auth.userId, dateStr);
      const summary = await this.nutritionRepository.getDailySummary(req.auth.userId, dateStr);

      res.status(200).json({
        date: dateStr,
        summary,
        meals: logs
      });
    } catch (error) {
      next(error);
    }
  };

  public calculateTdee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.calculateTdeeUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
