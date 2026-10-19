// Frontend Domain Interface: IWorkoutApi

import { WorkoutSession } from '../entities/WorkoutSession';
import { SetLog, LogSetResponse, Feeling } from '../entities/SetLog';

export interface LogSetPayload {
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

export interface ActiveSessionResponse {
  activeSession: WorkoutSession | null;
  sets: SetLog[];
}

export interface IWorkoutApi {
  startSession(data: { routineId?: number | null; notes?: string | null }): Promise<WorkoutSession>;
  getActiveSession(): Promise<ActiveSessionResponse>;
  logSet(payload: LogSetPayload): Promise<LogSetResponse>;
  finishSession(sessionId: number, notes?: string | null): Promise<WorkoutSession>;
}
