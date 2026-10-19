// Frontend Application Use Case: logSetUseCase

import { workoutApi } from '../../infrastructure/api/workoutApi';
import { useActiveWorkoutStore } from '../stores/activeWorkoutStore';
import { LogSetPayload } from '../../domain/interfaces/IWorkoutApi';
import { LogSetResponse } from '../../domain/entities/SetLog';

export async function logSetUseCase(payload: LogSetPayload): Promise<LogSetResponse> {
  const result = await workoutApi.logSet(payload);
  const store = useActiveWorkoutStore.getState();
  store.addSet(result.set, result.previousSession);

  if (payload.restSeconds && payload.restSeconds > 0) {
    store.startRestTimer(payload.restSeconds);
  }

  return result;
}
