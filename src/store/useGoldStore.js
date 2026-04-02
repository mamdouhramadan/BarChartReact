import { create } from 'zustand';

/** Curated FRED series — London bullion market gold fixes in USD per troy ounce. */
export const GOLD_SERIES_OPTIONS = [
  { id: 'GOLDPMGBD228NLBM', label: 'London PM gold fix (USD / t oz)' },
  { id: 'GOLDAMGBD228NLBM', label: 'London AM gold fix (USD / t oz)' }
];

export const DEFAULT_GOLD_SERIES_ID = GOLD_SERIES_OPTIONS[0].id;

const getFredBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // Must match PUBLIC_URL when homepage is set (e.g. GitHub Pages); otherwise
    // redirectServedPath sends /api/fred → /BarChartReact/api/fred and the
    // proxy on /api/fred never runs — the app gets index.html instead of JSON.
    const pub = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return pub ? `${pub}/api/fred` : '/api/fred';
  }
  const proxy = process.env.REACT_APP_FRED_PROXY_URL;
  return proxy ? proxy.replace(/\/$/, '') : '';
};

const parseObservations = (payload) => {
  const rows = payload?.observations ?? [];
  return rows
    .map((row) => ({
      date: row.date,
      value: row.value === '.' || row.value === undefined ? null : Number(row.value)
    }))
    .filter((row) => row.value != null && !Number.isNaN(row.value))
    .sort((a, b) => a.date.localeCompare(b.date));
};

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
    const base = getFredBaseUrl();
    if (!base) {
      const message =
        'FRED data needs a dev proxy. Run npm start with FRED_API_KEY in .env.local, or set REACT_APP_FRED_PROXY_URL for production builds.';
      set({ error: message, observations: [] });
      throw new Error(message);
    }

    const id = seriesId || get().seriesId;
    const params = new URLSearchParams({
      series_id: id,
      observation_start: from,
      observation_end: to,
      file_type: 'json'
    });

    set({
      isLoading: true,
      error: '',
      dateRange: { from, to },
      seriesId: id
    });

    try {
      const response = await fetch(`${base}/series/observations?${params.toString()}`);

      const text = await response.text();
      const trimmed = text.trim();
      if (trimmed.startsWith('<')) {
        throw new Error(
          'Received HTML instead of JSON (often a dev-server index page). Use npm start with FRED_API_KEY in .env.local, or set REACT_APP_FRED_PROXY_URL for production.'
        );
      }

      let payload;
      try {
        payload = JSON.parse(trimmed);
      } catch {
        throw new Error('FRED proxy returned data that is not valid JSON.');
      }

      if (!response.ok) {
        const msg =
          payload?.error_message ||
          payload?.message ||
          trimmed ||
          'Unable to load gold series from FRED.';
        throw new Error(typeof msg === 'string' ? msg : 'Unable to load gold series from FRED.');
      }

      if (payload.error_code) {
        throw new Error(payload.error_message || 'FRED returned an error for this series or date range.');
      }

      const observations = parseObservations(payload);

      set({
        observations,
        error: ''
      });

      return observations;
    } catch (error) {
      set({
        observations: [],
        error: error.message || 'Unable to load gold series from FRED.'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useGoldStore;
