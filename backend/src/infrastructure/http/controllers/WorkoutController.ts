// Infrastructure HTTP Controller: WorkoutController

import { Request, Response, NextFunction } from 'express';
import { StartWorkoutSession } from '../../../application/use-cases/workout/StartWorkoutSession';
import { LogExerciseSet } from '../../../application/use-cases/workout/LogExerciseSet';
import { FinishWorkoutSession } from '../../../application/use-cases/workout/FinishWorkoutSession';
import { IWorkoutRepository } from '../../../domain/repositories/IWorkoutRepository';
import { UnauthorizedError, ValidationError } from '../../../domain/errors/DomainError';

export class WorkoutController {
  constructor(
    private readonly startWorkoutSessionUseCase: StartWorkoutSession,
    private readonly logExerciseSetUseCase: LogExerciseSet,
    private readonly finishWorkoutSessionUseCase: FinishWorkoutSession,
    private readonly workoutRepository: IWorkoutRepository
  ) {}

  public startSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const session = await this.startWorkoutSessionUseCase.execute(req.auth.userId, req.body);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  };

  public getActiveSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const active = await this.workoutRepository.findActiveSessionByUserId(req.auth.userId);
      if (!active) {
        res.status(200).json({ activeSession: null });
        return;
      }
      const sets = await this.workoutRepository.getSetsBySession(active.id);
      res.status(200).json({
        activeSession: {
          id: active.id,
          userId: active.userId,
          routineId: active.routineId,
          startedAt: active.startedAt,
          endedAt: active.endedAt,
          notes: active.notes,
          status: active.status
        },
        sets: sets.map((s) => ({
          id: s.id,
          sessionId: s.sessionId,
          exerciseId: s.exerciseId,
          setNumber: s.setNumber,
          weightKg: s.weightKg,
          reps: s.reps,
          rir: s.rir,
          rpe: s.rpe,
          feeling: s.feeling,
          restSeconds: s.restSeconds,
          isPersonalRecord: s.isPersonalRecord,
          loggedAt: s.loggedAt,
          volume: s.volume
        }))
      });
    } catch (error) {
      next(error);
    }
  };

  public logSet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const result = await this.logExerciseSetUseCase.execute(req.auth.userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public finishSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const sessionId = parseInt(req.params.id ?? '', 10);
      if (isNaN(sessionId)) {
        throw new ValidationError('ID de sesion invalido en la ruta');
      }

      const result = await this.finishWorkoutSessionUseCase.execute(
        req.auth.userId,
        sessionId,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
