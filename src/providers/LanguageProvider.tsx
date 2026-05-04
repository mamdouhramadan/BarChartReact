import { useEffect, useMemo, type ReactNode } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
import i18n from '../i18n';
import { createAppTheme } from '../theme/createAppTheme';
import { normalizeLocale, type SupportedLocale } from '../i18n/constants';

function ThemedTree({ children }: { children: ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();
  const lang: SupportedLocale = normalizeLocale(i18nInstance.language);
  const direction = lang === 'ar' ? 'rtl' : 'ltr';
  const theme = useMemo(() => createAppTheme(direction, lang), [direction, lang]);
  const adapterLocale = lang === 'ar' ? 'ar' : 'en';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', lang);
    void dayjs.locale(adapterLocale);
  }, [adapterLocale, direction, lang]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemedTree>{children}</ThemedTree>
    </I18nextProvider>
  );
}
