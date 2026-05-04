import { create } from 'zustand';
import { filterObservationsByRange, loadFreeGoldDataset } from '../api/freeGoldApi';
import type { DateRange, Observation, SeriesId } from '../types/gold';

export const GOLD_SERIES_OPTIONS = [{ id: 'FREE_GOLD_USD', label: 'Gold USD (Free Gold API)' }] as const;

export const DEFAULT_GOLD_SERIES_ID: SeriesId = GOLD_SERIES_OPTIONS[0].id;

export interface GoldStore {
  observations: Observation[];
  dateRange: DateRange;
  seriesId: SeriesId;
  isLoading: boolean;
  error: string;
  setSeriesId: (seriesId: SeriesId) => void;
  setDateRange: (dateRange: DateRange) => void;
  fetchObservations: (args: { from: string; to: string; seriesId?: SeriesId }) => Promise<Observation[]>;
}

const useGoldStore = create<GoldStore>()((set, get) => ({
  observations: [],
  dateRange: { from: '', to: '' },
  seriesId: DEFAULT_GOLD_SERIES_ID,
  isLoading: false,
  error: '',
  setSeriesId(seriesId) {
    set({ seriesId });
  },
  setDateRange(dateRange) {
    set({ dateRange });
  },
  async fetchObservations({ from, to, seriesId }) {
    const id = seriesId ?? get().seriesId;

    set({
      isLoading: true,
      error: '',
      dateRange: { from, to },
      seriesId: id
    });

    try {
      const all = await loadFreeGoldDataset();
      const observations = filterObservationsByRange(all, from, to);

      set({
        observations,
        error: ''
      });

      return observations;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message || 'errors.genericLoad' : 'errors.genericLoad';
      set({
        observations: [],
        error: message
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useGoldStore;
