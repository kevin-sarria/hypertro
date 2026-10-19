import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useActiveWorkoutStore } from '../activeWorkoutStore';
import { WorkoutSession } from '../../../domain/entities/WorkoutSession';
import { SetLog, PreviousSessionSummary } from '../../../domain/entities/SetLog';

describe('activeWorkoutStore', () => {
  const baseTimestamp = new Date('2026-10-18T10:00:00.000Z').getTime();

  const mockSession: WorkoutSession = {
    id: 101,
    userId: 1,
    routineId: null,
    startedAt: new Date(baseTimestamp).toISOString(),
    endedAt: null,
    notes: 'Chest & Triceps hypertrophy session',
    status: 'active'
  };

  const mockSet: SetLog = {
    id: 1,
    sessionId: 101,
    userId: 1,
    exerciseId: 10,
    setNumber: 1,
    weightKg: 100,
    reps: 5,
    rir: 2,
    rpe: 8.5,
    feeling: 'good',
    restSeconds: 90,
    isPersonalRecord: true,
    loggedAt: new Date(baseTimestamp + 60000).toISOString(),
    volume: 500
  };

  const mockPrevSession: PreviousSessionSummary = {
    previousSessionId: 99,
    previousSessionDate: '2026-10-10',
    maxWeightKg: 95,
    repsAtMaxWeight: 5
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(baseTimestamp);
    localStorage.clear();
    useActiveWorkoutStore.getState().clearSession();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts and initializes workout session with timestamp tracking', () => {
    useActiveWorkoutStore.getState().setSession(mockSession);

    const state = useActiveWorkoutStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.startedAtTimestampMs).toBe(baseTimestamp);
    expect(state.elapsedSeconds).toBe(0);
    expect(state.sets).toHaveLength(0);
  });

  it('records logged set into state and updates lastPreviousSession', () => {
    useActiveWorkoutStore.getState().setSession(mockSession);
    useActiveWorkoutStore.getState().addSet(mockSet, mockPrevSession);

    const state = useActiveWorkoutStore.getState();
    expect(state.sets).toHaveLength(1);
    expect(state.sets[0]).toEqual(mockSet);
    expect(state.lastPreviousSession).toEqual(mockPrevSession);
  });

  it('starts rest timer and counts down correctly with ticks', () => {
    useActiveWorkoutStore.getState().setSession(mockSession);
    const restDuration = 90;

    useActiveWorkoutStore.getState().startRestTimer(restDuration);

    let state = useActiveWorkoutStore.getState();
    expect(state.restSecondsLeft).toBe(90);
    expect(state.restTimerDurationSeconds).toBe(90);
    expect(state.restTimerTargetMs).toBe(baseTimestamp + 90000);

    // Advance 30 seconds
    vi.setSystemTime(baseTimestamp + 30000);
    useActiveWorkoutStore.getState().tick();

    state = useActiveWorkoutStore.getState();
    expect(state.elapsedSeconds).toBe(30);
    expect(state.restSecondsLeft).toBe(60);

    // Advance past rest timer completion
    vi.setSystemTime(baseTimestamp + 95000);
    useActiveWorkoutStore.getState().tick();

    state = useActiveWorkoutStore.getState();
    expect(state.restSecondsLeft).toBe(0);
    expect(state.restTimerTargetMs).toBeNull();
    expect(state.elapsedSeconds).toBe(95);
  });

  it('cancels rest timer immediately upon request', () => {
    useActiveWorkoutStore.getState().setSession(mockSession);
    useActiveWorkoutStore.getState().startRestTimer(120);

    expect(useActiveWorkoutStore.getState().restSecondsLeft).toBe(120);

    useActiveWorkoutStore.getState().cancelRestTimer();

    const state = useActiveWorkoutStore.getState();
    expect(state.restTimerTargetMs).toBeNull();
    expect(state.restSecondsLeft).toBe(0);
  });

  it('clears session and resets all workout states to default', () => {
    useActiveWorkoutStore.getState().setSession(mockSession);
    useActiveWorkoutStore.getState().addSet(mockSet, mockPrevSession);
    useActiveWorkoutStore.getState().startRestTimer(90);

    useActiveWorkoutStore.getState().clearSession();

    const state = useActiveWorkoutStore.getState();
    expect(state.session).toBeNull();
    expect(state.startedAtTimestampMs).toBeNull();
    expect(state.sets).toHaveLength(0);
    expect(state.lastPreviousSession).toBeNull();
    expect(state.restTimerTargetMs).toBeNull();
    expect(state.elapsedSeconds).toBe(0);
    expect(state.restSecondsLeft).toBe(0);
  });
});
