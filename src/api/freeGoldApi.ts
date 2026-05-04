import type { Observation } from '../types/gold';
import { NETWORK_UNREACHABLE_CODE } from '../utils/isNetworkFailure';

/**
 * Public gold dataset — no API key, CORS enabled.
 * @see https://freegoldapi.com/data/latest.json
 */
export const FREE_GOLD_JSON_URL = 'https://freegoldapi.com/data/latest.json';

let cachedRows: Observation[] | null = null;
let loadPromise: Promise<Observation[]> | null = null;

/** Clears the in-memory dataset cache so each test run starts from a cold fetch. */
export function resetFreeGoldApiCache(): void {
  cachedRows = null;
  loadPromise = null;
}

function normalizeRow(row: { date?: unknown; price?: unknown }): Observation | null {
  const price = row.price;
  const value = typeof price === 'number' ? price : Number(price);
  if (row.date == null || Number.isNaN(value)) {
    return null;
  }
  return { date: String(row.date).slice(0, 10), value };
}

/** Fetches once per session; returns sorted { date, value }[] (ISO dates YYYY-MM-DD). */
export async function loadFreeGoldDataset(): Promise<Observation[]> {
  if (cachedRows) {
    return cachedRows;
  }
  if (!loadPromise) {
    loadPromise = (async () => {
      let response: Response;
      try {
        response = await fetch(FREE_GOLD_JSON_URL, { credentials: 'omit' });
      } catch {
        throw new Error(NETWORK_UNREACHABLE_CODE);
      }
      if (!response.ok) {
        throw new Error('errors.genericLoad');
      }
      const text = await response.text();
      const trimmed = text.trim();
      if (trimmed.startsWith('<')) {
        throw new Error('errors.htmlInsteadOfJson');
      }
      let payload: unknown;
      try {
        payload = JSON.parse(trimmed) as unknown;
      } catch {
        throw new Error('errors.invalidJson');
      }
      if (!Array.isArray(payload)) {
        throw new Error('errors.invalidJson');
      }
      const rows = payload
        .map((r) => normalizeRow(r as { date?: unknown; price?: unknown }))
        .filter((r): r is Observation => r !== null)
        .sort((a, b) => a.date.localeCompare(b.date));
      cachedRows = rows;
      return rows;
    })().finally(() => {
      loadPromise = null;
    });
  }
  return loadPromise;
}

export function filterObservationsByRange(observations: Observation[], from: string, to: string): Observation[] {
  if (!from || !to) {
    return [];
  }
  return observations.filter((row) => row.date >= from && row.date <= to);
}
