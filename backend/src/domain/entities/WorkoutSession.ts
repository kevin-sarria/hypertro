// Domain Entity: WorkoutSession

export type SessionStatus = 'active' | 'finished';

export interface WorkoutSessionProps {
  id: number;
  userId: number;
  routineId: number | null;
  startedAt: Date;
  endedAt: Date | null;
  notes: string | null;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkoutSession {
  constructor(private readonly props: WorkoutSessionProps) {}

  public get id(): number {
    return this.props.id;
  }

  public get userId(): number {
    return this.props.userId;
  }

  public get routineId(): number | null {
    return this.props.routineId;
  }

  public get startedAt(): Date {
    return this.props.startedAt;
  }

  public get endedAt(): Date | null {
    return this.props.endedAt;
  }

  public get notes(): string | null {
    return this.props.notes;
  }

  public get status(): SessionStatus {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public isActive(): boolean {
    return this.props.status === 'active';
  }

  public isOwnedBy(userId: number): boolean {
    return this.props.userId === userId;
  }
}
