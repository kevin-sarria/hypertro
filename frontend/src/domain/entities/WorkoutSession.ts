// Frontend Domain Entity: WorkoutSession

export type SessionStatus = 'active' | 'finished';

export interface WorkoutSession {
  id: number;
  userId: number;
  routineId: number | null;
  startedAt: string;
  endedAt: string | null;
  notes: string | null;
  status: SessionStatus;
}
