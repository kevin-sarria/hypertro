// Frontend Infrastructure Service: timerService (Timestamp-based accuracy for background survival)

export const timerService = {
  getRemainingSeconds(targetTimestampMs: number): number {
    const diff = targetTimestampMs - Date.now();
    return Math.max(0, Math.ceil(diff / 1000));
  },

  getElapsedSeconds(startTimestampMs: number): number {
    const diff = Date.now() - startTimestampMs;
    return Math.max(0, Math.floor(diff / 1000));
  },

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  formatHoursMinutes(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    }
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
};
