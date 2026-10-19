// Infrastructure HTTP Controller: SquadController

import { Request, Response, NextFunction } from 'express';
import { CreateSquad } from '../../../application/use-cases/squads/CreateSquad';
import { ProvisionStudent } from '../../../application/use-cases/squads/ProvisionStudent';
import { ISquadRepository } from '../../../domain/repositories/ISquadRepository';
import { UnauthorizedError } from '../../../domain/errors/DomainError';

export class SquadController {
  constructor(
    private readonly createSquadUseCase: CreateSquad,
    private readonly provisionStudentUseCase: ProvisionStudent,
    private readonly squadRepository: ISquadRepository
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const squad = await this.createSquadUseCase.execute(req.auth.userId, req.body);
      res.status(201).json(squad);
    } catch (error) {
      next(error);
    }
  };

  public provisionStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const result = await this.provisionStudentUseCase.execute(req.auth.userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getMySquads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const squads = await this.squadRepository.findByCoachId(req.auth.userId);
      res.status(200).json(squads);
    } catch (error) {
      next(error);
    }
  };
}
