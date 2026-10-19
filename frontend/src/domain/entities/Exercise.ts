// Frontend Domain Entity: Exercise

export interface Exercise {
  id: number;
  name: string;
  muscleGroupId: number;
  muscleGroupName?: string;
  machineTypeId: number | null;
  machineTypeName?: string | null;
  isActive: boolean;
}
