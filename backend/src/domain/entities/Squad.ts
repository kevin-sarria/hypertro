// Domain Entity: Squad and SquadMember

export interface SquadMember {
  squadId: number;
  userId: number;
  joinedAt: Date;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface SquadProps {
  id: number;
  coachId: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  members?: SquadMember[];
}

export class Squad {
  constructor(private readonly props: SquadProps) {}

  public get id(): number {
    return this.props.id;
  }

  public get coachId(): number {
    return this.props.coachId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | null {
    return this.props.description;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get members(): readonly SquadMember[] {
    return this.props.members ?? [];
  }

  public isOwnedBy(coachId: number): boolean {
    return this.props.coachId === coachId;
  }
}
