// Frontend Domain Entity: SetLog

export type Feeling = 'bad' | 'ok' | 'good' | 'great';

export interface SetLog {
  id: number;
  sessionId: number;
  userId: number;
  exerciseId: number;
  setNumber: number;
  weightKg: number;
  reps: number;
  rir: number | null;
  rpe: number | null;
  feeling: Feeling | null;
  restSeconds: number | null;
  isPersonalRecord: boolean;
  loggedAt: string;
  volume: number;
}

export interface PreviousSessionSummary {
  previousSessionId: number | null;
  previousSessionDate: string | null;
  maxWeightKg: number | null;
  repsAtMaxWeight: number | null;
}

export interface LogSetResponse {
  set: SetLog;
  previousSession: PreviousSessionSummary | null;
}
