// Domain Entity: SetLog and previous session summary

export type Feeling = 'bad' | 'ok' | 'good' | 'great';

export const ALL_FEELINGS: readonly Feeling[] = ['bad', 'ok', 'good', 'great'] as const;

export function isFeeling(val: unknown): val is Feeling {
  return typeof val === 'string' && (ALL_FEELINGS as readonly string[]).includes(val);
}

export interface SetLogProps {
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
  loggedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SetLog {
  constructor(private readonly props: SetLogProps) {}

  public get id(): number {
    return this.props.id;
  }

  public get sessionId(): number {
    return this.props.sessionId;
  }

  public get userId(): number {
    return this.props.userId;
  }

  public get exerciseId(): number {
    return this.props.exerciseId;
  }

  public get setNumber(): number {
    return this.props.setNumber;
  }

  public get weightKg(): number {
    return this.props.weightKg;
  }

  public get reps(): number {
    return this.props.reps;
  }

  public get rir(): number | null {
    return this.props.rir;
  }

  public get rpe(): number | null {
    return this.props.rpe;
  }

  public get feeling(): Feeling | null {
    return this.props.feeling;
  }

  public get restSeconds(): number | null {
    return this.props.restSeconds;
  }

  public get isPersonalRecord(): boolean {
    return this.props.isPersonalRecord;
  }

  public get loggedAt(): Date {
    return this.props.loggedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get volume(): number {
    return this.props.weightKg * this.props.reps;
  }
}

export interface PreviousSessionSummary {
  previousSessionId: number | null;
  previousSessionDate: string | null;
  maxWeightKg: number | null;
  repsAtMaxWeight: number | null;
}

export interface LogSetResult {
  set: SetLog;
  previousSession: PreviousSessionSummary | null;
}
