/** Thrown from `freeGoldApi` when `fetch` fails before a normal HTTP response (blocked URL, firewall, offline, etc.). */
export const NETWORK_UNREACHABLE_CODE = 'errors.networkUnreachable';

export function isNetworkFailure(error: unknown): boolean {
  if (error instanceof Error && error.message === NETWORK_UNREACHABLE_CODE) {
    return true;
  }
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return true;
  }
  if (error instanceof TypeError) {
    const m = error.message.toLowerCase();
    return (
      m.includes('failed to fetch') ||
      m.includes('network') ||
      m.includes('load failed') ||
      (m.includes('fetch') && !m.includes('abort'))
    );
  }
  if (error instanceof DOMException && error.name === 'NetworkError') {
    return true;
  }
  return false;
}
