// Frontend Application Store: metricsStore

import { create } from 'zustand';

interface PersonalRecordMetric {
  exerciseId: number;
  exerciseName: string;
  maxWeightKg: number;
  reps: number;
  date: string;
}

interface MetricsState {
  personalRecords: PersonalRecordMetric[];
  totalVolumeSession: number;
  addOrUpdatePR: (pr: PersonalRecordMetric) => void;
  updateTotalVolume: (volume: number) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  personalRecords: [],
  totalVolumeSession: 0,

  addOrUpdatePR: (newPR) => {
    set((state) => {
      const filtered = state.personalRecords.filter((p) => p.exerciseId !== newPR.exerciseId);
      return { personalRecords: [...filtered, newPR] };
    });
  },

  updateTotalVolume: (volume) => {
    set({ totalVolumeSession: volume });
  }
}));
