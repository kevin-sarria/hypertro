// Frontend Infrastructure: workoutApi implementation

import { httpClient } from './httpClient';
import { IWorkoutApi, LogSetPayload, ActiveSessionResponse } from '../../domain/interfaces/IWorkoutApi';
import { WorkoutSession } from '../../domain/entities/WorkoutSession';
import { LogSetResponse } from '../../domain/entities/SetLog';

export const workoutApi: IWorkoutApi = {
  async startSession(data) {
    const response = await httpClient.post<WorkoutSession>('/workouts/start', data);
    return response.data;
  },

  async getActiveSession() {
    const response = await httpClient.get<ActiveSessionResponse>('/workouts/active');
    return response.data;
  },

  async logSet(payload: LogSetPayload) {
    const response = await httpClient.post<LogSetResponse>('/workouts/set', payload);
    return response.data;
  },

  async finishSession(sessionId, notes) {
    const response = await httpClient.patch<WorkoutSession>(`/workouts/${sessionId}/finish`, { notes });
    return response.data;
  }
};
