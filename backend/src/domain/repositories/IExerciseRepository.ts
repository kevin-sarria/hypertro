// Domain Repository Interface: IExerciseRepository

import { Exercise } from '../entities/Exercise';

export interface CreateExerciseData {
  name: string;
  muscleGroupId: number;
  machineTypeId?: number | null;
  createdByUserId?: number | null;
}

export interface IExerciseRepository {
  findById(id: number): Promise<Exercise | null>;
  findAll(): Promise<Exercise[]>;
  findByMuscleGroup(muscleGroupId: number): Promise<Exercise[]>;
  create(data: CreateExerciseData): Promise<Exercise>;
}
