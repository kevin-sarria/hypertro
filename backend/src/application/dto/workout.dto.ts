// Application DTO: Workout

import { SetLogProps, PreviousSessionSummary } from '../../domain/entities/SetLog';
import { WorkoutSessionProps } from '../../domain/entities/WorkoutSession';

export interface WorkoutSessionDTO extends WorkoutSessionProps {}

export interface SetLogDTO extends SetLogProps {
  volume: number;
}

export interface LogSetResponseDTO {
  set: SetLogDTO;
  previousSession: PreviousSessionSummary | null;
}
