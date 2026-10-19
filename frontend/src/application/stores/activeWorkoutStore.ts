// Frontend Application Store: activeWorkoutStore (Robust timestamp-based timers with Zustand persist)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorkoutSession } from '../../domain/entities/WorkoutSession';
import { SetLog, PreviousSessionSummary } from '../../domain/entities/SetLog';
import { timerService } from '../../infrastructure/services/timerService';

interface ActiveWorkoutState {
  session: WorkoutSession | null;
  startedAtTimestampMs: number | null;
  activeExerciseId: number | null;
  sets: SetLog[];
  lastPreviousSession: PreviousSessionSummary | null;
  restTimerTargetMs: number | null;
  restTimerDurationSeconds: number;
  elapsedSeconds: number;
  restSecondsLeft: number;

  setSession: (session: WorkoutSession) => void;
  setActiveExerciseId: (exerciseId: number) => void;
  addSet: (set: SetLog, prevSession: PreviousSessionSummary | null) => void;
  startRestTimer: (durationSeconds: number) => void;
  cancelRestTimer: () => void;
  tick: () => void;
  clearSession: () => void;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set, get) => ({
      session: null,
      startedAtTimestampMs: null,
      activeExerciseId: 1, // Default exercise id
      sets: [],
      lastPreviousSession: null,
      restTimerTargetMs: null,
      restTimerDurationSeconds: 90,
      elapsedSeconds: 0,
      restSecondsLeft: 0,

      setSession: (session: WorkoutSession) => {
        const startedAtMs = new Date(session.startedAt).getTime() || Date.now();
        set({
          session,
          startedAtTimestampMs: startedAtMs,
          elapsedSeconds: timerService.getElapsedSeconds(startedAtMs)
        });
      },

      setActiveExerciseId: (exerciseId: number) => {
        set({ activeExerciseId: exerciseId });
      },

      addSet: (setLog: SetLog, prevSession: PreviousSessionSummary | null) => {
        set((state) => ({
          sets: [...state.sets, setLog],
          lastPreviousSession: prevSession ?? state.lastPreviousSession
        }));
      },

      startRestTimer: (durationSeconds: number) => {
        const targetMs = Date.now() + durationSeconds * 1000;
        set({
          restTimerTargetMs: targetMs,
          restTimerDurationSeconds: durationSeconds,
          restSecondsLeft: durationSeconds
        });
      },

      cancelRestTimer: () => {
        set({
          restTimerTargetMs: null,
          restSecondsLeft: 0
        });
      },

      tick: () => {
        const { startedAtTimestampMs, restTimerTargetMs } = get();
        let newElapsed = 0;
        let newRestLeft = 0;

        if (startedAtTimestampMs) {
          newElapsed = timerService.getElapsedSeconds(startedAtTimestampMs);
        }

        if (restTimerTargetMs) {
          newRestLeft = timerService.getRemainingSeconds(restTimerTargetMs);
          if (newRestLeft === 0) {
            // Temporizador completado
            set({ restTimerTargetMs: null, restSecondsLeft: 0, elapsedSeconds: newElapsed });
            return;
          }
        }

        set({
          elapsedSeconds: newElapsed,
          restSecondsLeft: newRestLeft
        });
      },

      clearSession: () => {
        set({
          session: null,
          startedAtTimestampMs: null,
          sets: [],
          lastPreviousSession: null,
          restTimerTargetMs: null,
          elapsedSeconds: 0,
          restSecondsLeft: 0
        });
      }
    }),
    {
      name: 'hypertro-active-workout',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        startedAtTimestampMs: state.startedAtTimestampMs,
        activeExerciseId: state.activeExerciseId,
        sets: state.sets,
        lastPreviousSession: state.lastPreviousSession,
        restTimerTargetMs: state.restTimerTargetMs,
        restTimerDurationSeconds: state.restTimerDurationSeconds
      })
    }
  )
);
