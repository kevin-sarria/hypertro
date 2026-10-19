// Domain Entity: Exercise

export interface ExerciseProps {
  id: number;
  name: string;
  muscleGroupId: number;
  muscleGroupName?: string;
  machineTypeId: number | null;
  machineTypeName?: string | null;
  isActive: boolean;
  createdByUserId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Exercise {
  constructor(private readonly props: ExerciseProps) {}

  public get id(): number {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get muscleGroupId(): number {
    return this.props.muscleGroupId;
  }

  public get muscleGroupName(): string | undefined {
    return this.props.muscleGroupName;
  }

  public get machineTypeId(): number | null {
    return this.props.machineTypeId;
  }

  public get machineTypeName(): string | null | undefined {
    return this.props.machineTypeName;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public get createdByUserId(): number | null {
    return this.props.createdByUserId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
