// Application Use Case: StartWorkoutSession

import { IWorkoutRepository } from '../../../domain/repositories/IWorkoutRepository';
import { WorkoutSessionDTO } from '../../dto/workout.dto';
import { StartSessionInput } from '../../validators/workout.schemas';

export class StartWorkoutSession {
  constructor(private readonly workoutRepository: IWorkoutRepository) {}

  public async execute(userId: number, input: StartSessionInput): Promise<WorkoutSessionDTO> {
    const existingActive = await this.workoutRepository.findActiveSessionByUserId(userId);
    if (existingActive) {
      // Reanudar la sesión activa existente si el usuario ya tenía una abierta
      return {
        id: existingActive.id,
        userId: existingActive.userId,
        routineId: existingActive.routineId,
        startedAt: existingActive.startedAt,
        endedAt: existingActive.endedAt,
        notes: existingActive.notes,
        status: existingActive.status,
        createdAt: existingActive.createdAt,
        updatedAt: existingActive.updatedAt
      };
    }

    const session = await this.workoutRepository.startSession({
      userId,
      routineId: input.routineId ?? null,
      notes: input.notes ?? null
    });

    return {
      id: session.id,
      userId: session.userId,
      routineId: session.routineId,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      notes: session.notes,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  }
}
