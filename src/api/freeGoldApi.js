/**
 * Public gold dataset — no API key, CORS enabled.
 * @see https://freegoldapi.com/data/latest.json
 */
export const FREE_GOLD_JSON_URL = 'https://freegoldapi.com/data/latest.json';

let cachedRows = null;
let loadPromise = null;

function normalizeRow(row) {
  const price = row.price;
  const value = typeof price === 'number' ? price : Number(price);
  if (row.date == null || Number.isNaN(value)) {
    return null;
  }
  return { date: String(row.date).slice(0, 10), value };
}

/**
 * Fetches once per session; returns sorted { date, value }[] (ISO dates YYYY-MM-DD).
 */
export async function loadFreeGoldDataset() {
  if (cachedRows) {
    return cachedRows;
  }
  if (!loadPromise) {
    loadPromise = (async () => {
      const response = await fetch(FREE_GOLD_JSON_URL, { credentials: 'omit' });
      if (!response.ok) {
        throw new Error('errors.genericLoad');
      }
      const text = await response.text();
      const trimmed = text.trim();
      if (trimmed.startsWith('<')) {
        throw new Error('errors.htmlInsteadOfJson');
      }
      let payload;
      try {
        payload = JSON.parse(trimmed);
      } catch {
        throw new Error('errors.invalidJson');
      }
      if (!Array.isArray(payload)) {
        throw new Error('errors.invalidJson');
      }
      const rows = payload
        .map(normalizeRow)
        .filter(Boolean)
        .sort((a, b) => a.date.localeCompare(b.date));
      cachedRows = rows;
      return rows;
    })().finally(() => {
      loadPromise = null;
    });
  }
  return loadPromise;
}

export function filterObservationsByRange(observations, from, to) {
  if (!from || !to) {
    return [];
  }
  return observations.filter((row) => row.date >= from && row.date <= to);
}
