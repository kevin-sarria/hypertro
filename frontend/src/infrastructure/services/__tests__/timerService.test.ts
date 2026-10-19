import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { timerService } from '../timerService';

describe('timerService', () => {
  const initialTime = new Date('2026-10-18T12:00:00.000Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(initialTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates elapsed seconds accurately from initial timestamp', () => {
    const startTimestamp = initialTime;

    // Direct check at start
    expect(timerService.getElapsedSeconds(startTimestamp)).toBe(0);

    // Advance system time by 15.5 seconds
    vi.setSystemTime(initialTime + 15500);
    expect(timerService.getElapsedSeconds(startTimestamp)).toBe(15);
  });

  it('remains accurate after skipping 60 seconds without intermediate ticks (background survival)', () => {
    const startTimestamp = initialTime;

    // Simulate the phone app going to background for 60 seconds
    vi.setSystemTime(initialTime + 60000);

    expect(timerService.getElapsedSeconds(startTimestamp)).toBe(60);

    // Jump another 120 seconds
    vi.setSystemTime(initialTime + 180000);
    expect(timerService.getElapsedSeconds(startTimestamp)).toBe(180);
  });

  it('calculates remaining seconds correctly and clamps to zero', () => {
    const restDurationMs = 90000; // 90 seconds
    const targetTimestamp = initialTime + restDurationMs;

    expect(timerService.getRemainingSeconds(targetTimestamp)).toBe(90);

    // Jump 45 seconds
    vi.setSystemTime(initialTime + 45000);
    expect(timerService.getRemainingSeconds(targetTimestamp)).toBe(45);

    // Jump past the target timestamp
    vi.setSystemTime(initialTime + 100000);
    expect(timerService.getRemainingSeconds(targetTimestamp)).toBe(0);
  });

  it('formats time in MM:SS format correctly', () => {
    expect(timerService.formatTime(0)).toBe('00:00');
    expect(timerService.formatTime(59)).toBe('00:59');
    expect(timerService.formatTime(65)).toBe('01:05');
    expect(timerService.formatTime(600)).toBe('10:00');
  });

  it('formats time in hours and minutes correctly', () => {
    expect(timerService.formatHoursMinutes(45)).toBe('0m 45s');
    expect(timerService.formatHoursMinutes(125)).toBe('2m 05s');
    expect(timerService.formatHoursMinutes(3665)).toBe('1h 01m');
  });
});
