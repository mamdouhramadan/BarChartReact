export const LOCALE_STORAGE_KEY = 'gold-tracker-locale';

export const SUPPORTED_LOCALES = ['en', 'ar'];

export function normalizeLocale(lang) {
  if (!lang) return 'en';
  const base = String(lang).split('-')[0].toLowerCase();
  return SUPPORTED_LOCALES.includes(base) ? base : 'en';
}

export function getBrowserLocale() {
  if (typeof navigator === 'undefined' || !navigator.language) {
    return 'en';
  }
  return normalizeLocale(navigator.language);
}

/**
 * Prefer value in localStorage; otherwise match browser language to a supported locale.
 */
export function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }
  return getBrowserLocale();
}
