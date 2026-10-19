// Domain Repository Interface: IWorkoutRepository

import { WorkoutSession } from '../entities/WorkoutSession';
import { SetLog, LogSetResult, Feeling } from '../entities/SetLog';

export interface LogSetInput {
  userId: number;
  sessionId: number;
  exerciseId: number;
  setNumber: number;
  weightKg: number;
  reps: number;
  rir?: number | null;
  rpe?: number | null;
  feeling?: Feeling | null;
  restSeconds?: number | null;
}

export interface StartSessionInput {
  userId: number;
  routineId?: number | null;
  notes?: string | null;
}

export interface IWorkoutRepository {
  startSession(input: StartSessionInput): Promise<WorkoutSession>;
  findSessionById(sessionId: number): Promise<WorkoutSession | null>;
  findActiveSessionByUserId(userId: number): Promise<WorkoutSession | null>;
  finishSession(sessionId: number, notes?: string | null): Promise<WorkoutSession>;
  logSet(input: LogSetInput): Promise<LogSetResult>;
  getSetsBySession(sessionId: number): Promise<SetLog[]>;
}
