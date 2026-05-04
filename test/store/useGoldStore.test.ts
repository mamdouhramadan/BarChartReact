import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetFreeGoldApiCache } from '../../src/api/freeGoldApi';
import useGoldStore, { DEFAULT_GOLD_SERIES_ID } from '../../src/store/useGoldStore';

function jsonResponse(body: unknown, ok = true): Partial<Response> {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return {
    ok,
    text: async () => text
  };
}

function resetStore() {
  useGoldStore.setState({
    observations: [],
    dateRange: { from: '', to: '' },
    seriesId: DEFAULT_GOLD_SERIES_ID,
    isLoading: false,
    error: ''
  });
}

describe('useGoldStore', () => {
  beforeEach(() => {
    resetFreeGoldApiCache();
    resetStore();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          [
            { date: '2024-01-01', price: 100 },
            { date: '2024-01-31', price: 110 }
          ],
          true
        ) as Response
      )
    );
  });

  afterEach(() => {
    resetFreeGoldApiCache();
    resetStore();
    vi.unstubAllGlobals();
  });

  it('fetchObservations loads rows for the requested range', async () => {
    const rows = await useGoldStore.getState().fetchObservations({
      from: '2024-01-01',
      to: '2024-01-31',
      seriesId: DEFAULT_GOLD_SERIES_ID
    });

    expect(rows).toHaveLength(2);
    const state = useGoldStore.getState();
    expect(state.observations).toEqual(rows);
    expect(state.dateRange).toEqual({ from: '2024-01-01', to: '2024-01-31' });
    expect(state.error).toBe('');
    expect(state.isLoading).toBe(false);
  });

  it('sets error and clears observations when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(
      useGoldStore.getState().fetchObservations({
        from: '2024-01-01',
        to: '2024-01-31'
      })
    ).rejects.toThrow();

    const state = useGoldStore.getState();
    expect(state.error).toBe('errors.networkUnreachable');
    expect(state.observations).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('clearError removes the error flag', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(
      useGoldStore.getState().fetchObservations({ from: '2024-01-01', to: '2024-01-31' })
    ).rejects.toThrow();

    useGoldStore.getState().clearError();
    expect(useGoldStore.getState().error).toBe('');
  });

  it('setSeriesId updates series', () => {
    useGoldStore.getState().setSeriesId('FREE_GOLD_USD');
    expect(useGoldStore.getState().seriesId).toBe('FREE_GOLD_USD');
  });
});
