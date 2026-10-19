// Frontend Application Hook: useRestTimer

import { useEffect } from 'react';
import { useActiveWorkoutStore } from '../stores/activeWorkoutStore';
import { timerService } from '../../infrastructure/services/timerService';

export function useRestTimer() {
  const restSecondsLeft = useActiveWorkoutStore((state) => state.restSecondsLeft);
  const restTimerTargetMs = useActiveWorkoutStore((state) => state.restTimerTargetMs);
  const restTimerDurationSeconds = useActiveWorkoutStore((state) => state.restTimerDurationSeconds);
  const startRestTimer = useActiveWorkoutStore((state) => state.startRestTimer);
  const cancelRestTimer = useActiveWorkoutStore((state) => state.cancelRestTimer);
  const tick = useActiveWorkoutStore((state) => state.tick);

  useEffect(() => {
    if (!restTimerTargetMs) return;

    // Tick cada 500ms para asegurar actualización visual fluida
    const interval = setInterval(() => {
      tick();
    }, 500);

    return () => clearInterval(interval);
  }, [restTimerTargetMs, tick]);

  const progressPercent =
    restTimerDurationSeconds > 0
      ? Math.max(0, Math.min(100, Math.round(((restTimerDurationSeconds - restSecondsLeft) / restTimerDurationSeconds) * 100)))
      : 0;

  return {
    isActive: restTimerTargetMs !== null && restSecondsLeft > 0,
    secondsLeft: restSecondsLeft,
    formattedTime: timerService.formatTime(restSecondsLeft),
    progressPercent,
    startTimer: startRestTimer,
    cancelTimer: cancelRestTimer
  };
}
