// Frontend Application Hook: useActiveWorkout

import { useEffect, useState, useCallback } from 'react';
import { useActiveWorkoutStore } from '../stores/activeWorkoutStore';
import { workoutApi } from '../../infrastructure/api/workoutApi';
import { timerService } from '../../infrastructure/services/timerService';
import { LogSetPayload } from '../../domain/interfaces/IWorkoutApi';

export function useActiveWorkout() {
  const store = useActiveWorkoutStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tick para el cronómetro transcurrido de la sesión
  useEffect(() => {
    if (!store.session) return;
    const interval = setInterval(() => {
      store.tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [store.session, store]);

  const loadActiveSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await workoutApi.getActiveSession();
      if (data.activeSession) {
        store.setSession(data.activeSession);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sesion activa');
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const startSession = async (routineId?: number | null, notes?: string | null) => {
    try {
      setIsLoading(true);
      setError(null);
      const session = await workoutApi.startSession({ routineId, notes });
      store.setSession(session);
      return session;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesion';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logSet = async (payload: Omit<LogSetPayload, 'sessionId'>) => {
    if (!store.session) {
      throw new Error('No hay una sesion de entrenamiento activa');
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await workoutApi.logSet({
        ...payload,
        sessionId: store.session.id
      });
      store.addSet(result.set, result.previousSession);

      // Iniciar descanso si se configuraron segundos
      if (payload.restSeconds && payload.restSeconds > 0) {
        store.startRestTimer(payload.restSeconds);
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar serie';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const finishSession = async (notes?: string | null) => {
    if (!store.session) return;
    try {
      setIsLoading(true);
      setError(null);
      const finished = await workoutApi.finishSession(store.session.id, notes);
      store.clearSession();
      return finished;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al finalizar sesion';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session: store.session,
    isActive: Boolean(store.session),
    activeExerciseId: store.activeExerciseId,
    sets: store.sets,
    lastPreviousSession: store.lastPreviousSession,
    elapsedSeconds: store.elapsedSeconds,
    formattedElapsed: timerService.formatHoursMinutes(store.elapsedSeconds),
    isLoading,
    error,
    loadActiveSession,
    startSession,
    logSet,
    finishSession,
    setActiveExerciseId: store.setActiveExerciseId
  };
}
