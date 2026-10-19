// Application Use Case: FinishWorkoutSession

import { IWorkoutRepository } from '../../../domain/repositories/IWorkoutRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/DomainError';
import { WorkoutSessionDTO } from '../../dto/workout.dto';
import { FinishSessionInput } from '../../validators/workout.schemas';

export class FinishWorkoutSession {
  constructor(private readonly workoutRepository: IWorkoutRepository) {}

  public async execute(userId: number, sessionId: number, input: FinishSessionInput): Promise<WorkoutSessionDTO> {
    const session = await this.workoutRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError('Sesion de entrenamiento no encontrada');
    }

    if (!session.isOwnedBy(userId)) {
      throw new ForbiddenError('No tienes permiso para finalizar esta sesion');
    }

    if (!session.isActive()) {
      throw new ValidationError('La sesion de entrenamiento ya se encuentra finalizada');
    }

    const finished = await this.workoutRepository.finishSession(sessionId, input.notes);

    return {
      id: finished.id,
      userId: finished.userId,
      routineId: finished.routineId,
      startedAt: finished.startedAt,
      endedAt: finished.endedAt,
      notes: finished.notes,
      status: finished.status,
      createdAt: finished.createdAt,
      updatedAt: finished.updatedAt
    };
  }
}
