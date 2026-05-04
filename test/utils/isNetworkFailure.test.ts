import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNetworkFailure, NETWORK_UNREACHABLE_CODE } from '../../src/utils/isNetworkFailure';

describe('isNetworkFailure', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true for API network-unreachable error code', () => {
    expect(isNetworkFailure(new Error(NETWORK_UNREACHABLE_CODE))).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isNetworkFailure(new Error('errors.genericLoad'))).toBe(false);
    expect(isNetworkFailure(new Error('Something broke'))).toBe(false);
  });

  it('returns true when navigator is offline', () => {
    vi.spyOn(Navigator.prototype, 'onLine', 'get').mockReturnValue(false);
    expect(isNetworkFailure(new Error('any'))).toBe(true);
  });

  it('detects common fetch TypeError messages', () => {
    expect(isNetworkFailure(new TypeError('Failed to fetch'))).toBe(true);
    expect(isNetworkFailure(new TypeError('Load failed'))).toBe(true);
    expect(isNetworkFailure(new TypeError('NetworkError when attempting to fetch'))).toBe(true);
  });

  it('does not treat abort-related TypeErrors as network wall', () => {
    expect(isNetworkFailure(new TypeError('The user aborted a request'))).toBe(false);
  });

  it('returns true for DOMException NetworkError', () => {
    expect(isNetworkFailure(new DOMException('blocked', 'NetworkError'))).toBe(true);
  });

  it('returns false for non-errors', () => {
    expect(isNetworkFailure(null)).toBe(false);
    expect(isNetworkFailure(undefined)).toBe(false);
    expect(isNetworkFailure('string')).toBe(false);
  });
});
