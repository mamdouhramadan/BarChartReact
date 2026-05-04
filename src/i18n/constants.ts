export const LOCALE_STORAGE_KEY = 'gold-tracker-locale';

export const SUPPORTED_LOCALES = ['en', 'ar'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(lang: string | undefined): SupportedLocale {
  if (!lang) return 'en';
  const base = String(lang).split('-')[0]?.toLowerCase() ?? 'en';
  return SUPPORTED_LOCALES.includes(base as SupportedLocale) ? (base as SupportedLocale) : 'en';
}

export function getBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined' || !navigator.language) {
    return 'en';
  }
  return normalizeLocale(navigator.language);
}

/** Prefer value in localStorage; otherwise match browser language to a supported locale. */
export function getInitialLanguage(): SupportedLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
      return stored as SupportedLocale;
    }
  } catch {
    // ignore
  }
  return getBrowserLocale();
}
