import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  filterObservationsByRange,
  FREE_GOLD_JSON_URL,
  loadFreeGoldDataset,
  resetFreeGoldApiCache
} from '../../src/api/freeGoldApi';
import { NETWORK_UNREACHABLE_CODE } from '../../src/utils/isNetworkFailure';

function jsonResponse(body: unknown, ok = true): Partial<Response> {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return {
    ok,
    text: async () => text
  };
}

describe('filterObservationsByRange', () => {
  const rows = [
    { date: '2024-01-01', value: 1 },
    { date: '2024-01-15', value: 2 },
    { date: '2024-02-01', value: 3 }
  ];

  it('returns empty when from or to is missing', () => {
    expect(filterObservationsByRange(rows, '', '2024-01-31')).toEqual([]);
    expect(filterObservationsByRange(rows, '2024-01-01', '')).toEqual([]);
  });

  it('filters inclusive by ISO date string', () => {
    expect(filterObservationsByRange(rows, '2024-01-01', '2024-01-15')).toEqual([
      { date: '2024-01-01', value: 1 },
      { date: '2024-01-15', value: 2 }
    ]);
  });
});

describe('loadFreeGoldDataset (fetch)', () => {
  beforeEach(() => {
    resetFreeGoldApiCache();
  });

  afterEach(() => {
    resetFreeGoldApiCache();
    vi.unstubAllGlobals();
  });

  it('requests the public JSON URL with credentials omitted', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([{ date: '2024-06-01', price: 2300 }]) as Response
    );
    vi.stubGlobal('fetch', fetchMock);

    const rows = await loadFreeGoldDataset();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(FREE_GOLD_JSON_URL, { credentials: 'omit' });
    expect(rows).toEqual([{ date: '2024-06-01', value: 2300 }]);
  });

  it('dedupes concurrent loads into a single fetch', async () => {
    let resolveText!: (value: string) => void;
    const textPromise = new Promise<string>((resolve) => {
      resolveText = resolve;
    });
    const fetchMock = vi.fn().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          text: () => textPromise
        }) as Promise<Response>
    );
    vi.stubGlobal('fetch', fetchMock);

    const a = loadFreeGoldDataset();
    const b = loadFreeGoldDataset();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveText(JSON.stringify([{ date: '2024-01-02', price: 10 }]));
    const [ra, rb] = await Promise.all([a, b]);
    expect(ra).toEqual(rb);
    expect(ra).toEqual([{ date: '2024-01-02', value: 10 }]);
  });

  it('returns cached rows without calling fetch again', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([{ date: '2024-03-01', price: 5 }]) as Response
    );
    vi.stubGlobal('fetch', fetchMock);

    await loadFreeGoldDataset();
    await loadFreeGoldDataset();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws network unreachable when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(loadFreeGoldDataset()).rejects.toThrow(NETWORK_UNREACHABLE_CODE);
  });

  it('throws generic load when HTTP status is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([], false) as Response));

    await expect(loadFreeGoldDataset()).rejects.toThrow('errors.genericLoad');
  });

  it('throws when body looks like HTML', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse('<!doctype html><html></html>', true) as Response));

    await expect(loadFreeGoldDataset()).rejects.toThrow('errors.htmlInsteadOfJson');
  });

  it('throws when JSON is invalid', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse('not json {', true) as Response));

    await expect(loadFreeGoldDataset()).rejects.toThrow('errors.invalidJson');
  });

  it('throws when JSON root is not an array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ foo: 1 }, true) as Response));

    await expect(loadFreeGoldDataset()).rejects.toThrow('errors.invalidJson');
  });

  it('normalizes string prices and drops invalid rows', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          [
            { date: '2024-02-02', price: '100.5' },
            { date: '2024-02-01', price: 'not-a-number' },
            { price: 99 }
          ],
          true
        ) as Response
      )
    );

    const rows = await loadFreeGoldDataset();
    expect(rows).toEqual([{ date: '2024-02-02', value: 100.5 }]);
  });

  it('sorts rows by date ascending', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          [
            { date: '2024-12-31', price: 3 },
            { date: '2024-01-01', price: 1 }
          ],
          true
        ) as Response
      )
    );

    const rows = await loadFreeGoldDataset();
    expect(rows.map((r) => r.date)).toEqual(['2024-01-01', '2024-12-31']);
  });
});
