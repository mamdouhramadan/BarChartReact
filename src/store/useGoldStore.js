import { create } from 'zustand';
import { filterObservationsByRange, loadFreeGoldDataset } from '../api/freeGoldApi';

/**
 * Single public series (Free Gold API — USD normalized blend, no API key).
 */
export const GOLD_SERIES_OPTIONS = [{ id: 'FREE_GOLD_USD', label: 'Gold USD (Free Gold API)' }];

export const DEFAULT_GOLD_SERIES_ID = GOLD_SERIES_OPTIONS[0].id;

const useGoldStore = create((set, get) => ({
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
    const id = seriesId || get().seriesId;

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
    } catch (error) {
      set({
        observations: [],
        error: error.message || 'errors.genericLoad'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useGoldStore;
