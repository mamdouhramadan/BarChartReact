import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import { getBrowserLocale, getInitialLanguage, LOCALE_STORAGE_KEY, normalizeLocale, SUPPORTED_LOCALES } from './constants';

const resources = {
  en: { translation: en },
  ar: { translation: ar }
};

function buildFallbackChain() {
  const browser = getBrowserLocale();
  const chain = [];
  if (browser) chain.push(browser);
  SUPPORTED_LOCALES.forEach((code) => {
    if (!chain.includes(code)) chain.push(code);
  });
  return chain;
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: buildFallbackChain(),
  supportedLngs: SUPPORTED_LOCALES,
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

i18n.on('languageChanged', (lng) => {
  const normalized = normalizeLocale(lng);
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
  } catch {
    // ignore
  }
});

export default i18n;
