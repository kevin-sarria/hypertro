// Domain Entity: NutritionLog

export interface NutritionLogProps {
  id: number;
  userId: number;
  logDate: string; // Formato YYYY-MM-DD
  mealName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class NutritionLog {
  constructor(private readonly props: NutritionLogProps) {}

  public get id(): number {
    return this.props.id;
  }

  public get userId(): number {
    return this.props.userId;
  }

  public get logDate(): string {
    return this.props.logDate;
  }

  public get mealName(): string {
    return this.props.mealName;
  }

  public get calories(): number {
    return this.props.calories;
  }

  public get proteinG(): number {
    return this.props.proteinG;
  }

  public get carbsG(): number {
    return this.props.carbsG;
  }

  public get fatG(): number {
    return this.props.fatG;
  }

  public get notes(): string | null {
    return this.props.notes;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
