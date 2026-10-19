// Application Use Case: LogExerciseSet

import { IWorkoutRepository } from '../../../domain/repositories/IWorkoutRepository';
import { LogSetResponseDTO } from '../../dto/workout.dto';
import { LogSetInputDTO } from '../../validators/workout.schemas';
import { Feeling } from '../../../domain/entities/SetLog';

export class LogExerciseSet {
  constructor(private readonly workoutRepository: IWorkoutRepository) {}

  public async execute(userId: number, input: LogSetInputDTO): Promise<LogSetResponseDTO> {
    const result = await this.workoutRepository.logSet({
      userId,
      sessionId: input.sessionId,
      exerciseId: input.exerciseId,
      setNumber: input.setNumber,
      weightKg: input.weightKg,
      reps: input.reps,
      rir: input.rir ?? null,
      rpe: input.rpe ?? null,
      feeling: (input.feeling as Feeling) ?? null,
      restSeconds: input.restSeconds ?? null
    });

    const set = result.set;

    return {
      set: {
        id: set.id,
        sessionId: set.sessionId,
        userId: set.userId,
        exerciseId: set.exerciseId,
        setNumber: set.setNumber,
        weightKg: set.weightKg,
        reps: set.reps,
        rir: set.rir,
        rpe: set.rpe,
        feeling: set.feeling,
        restSeconds: set.restSeconds,
        isPersonalRecord: set.isPersonalRecord,
        loggedAt: set.loggedAt,
        createdAt: set.createdAt,
        updatedAt: set.updatedAt,
        volume: set.volume
      },
      previousSession: result.previousSession
    };
  }
}
