import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppNavbar from './components/AppNavbar';
import GoldRangeForm from './components/GoldRangeForm';
import GoldCharts from './components/GoldCharts';
import GoldSummaryCards from './components/GoldSummaryCards';
import Spinner from './components/Spinner';
import HeroPanel from './components/HeroPanel';
import DashboardLayout from './components/DashboardLayout';
import NetworkBlockedPage from './components/NetworkBlockedPage';
import useGoldStore, { DEFAULT_GOLD_SERIES_ID } from './store/useGoldStore';
import exportGoldSeriesCsv from './utils/exportGoldSeriesCsv';
import goldKpis from './utils/goldKpis';
import i18nApp from './i18n';
import { isNetworkFailure } from './utils/isNetworkFailure';
import { entranceSx } from './animation/entrance';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import type { SeriesId } from './types/gold';

const DEFAULT_END_DATE = dayjs().subtract(1, 'day');
const DEFAULT_START_DATE = DEFAULT_END_DATE.subtract(6, 'month').startOf('month');

function resolveUserMessage(t: (key: string) => string, message: string): string {
  if (!message) return '';
  if (message.startsWith('errors.') || message.startsWith('app.')) {
    return t(message);
  }
  return message;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const observations = useGoldStore((state) => state.observations);
  const dateRange = useGoldStore((state) => state.dateRange);
  const seriesId = useGoldStore((state) => state.seriesId);
  const isLoading = useGoldStore((state) => state.isLoading);
  const error = useGoldStore((state) => state.error);
  const fetchObservations = useGoldStore((state) => state.fetchObservations);
  const clearError = useGoldStore((state) => state.clearError);
  const setSeriesId = useGoldStore((state) => state.setSeriesId);
  const setDateRange = useGoldStore((state) => state.setDateRange);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [networkWall, setNetworkWall] = useState(false);

  useEffect(() => {
    document.title = t('app.title');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t('app.metaDescription'));
    }
  }, [t, i18n.language]);

  useEffect(() => {
    const initializeDashboard = async () => {
      const from = DEFAULT_START_DATE.format('YYYY-MM-DD');
      const to = DEFAULT_END_DATE.format('YYYY-MM-DD');

      try {
        await fetchObservations({
          from,
          to,
          seriesId: DEFAULT_GOLD_SERIES_ID
        });
      } catch (initialError: unknown) {
        if (isNetworkFailure(initialError)) {
          setNetworkWall(true);
          return;
        }
        const msg = initialError instanceof Error ? initialError.message : '';
        setSnackbarMessage(
          resolveUserMessage((key) => i18nApp.t(key), msg || '') || i18nApp.t('app.initFailed')
        );
        setSnackbarOpen(true);
      }
    };

    void initializeDashboard();
  }, [fetchObservations]);

  useEffect(() => {
    const onOffline = () => setNetworkWall(true);
    window.addEventListener('offline', onOffline);
    return () => window.removeEventListener('offline', onOffline);
  }, []);

  const startDate: Dayjs | null = dateRange.from ? dayjs(dateRange.from) : null;
  const endDate: Dayjs | null = dateRange.to ? dayjs(dateRange.to) : null;
  const submitDisabled = !dateRange.from || !dateRange.to;
  const showEmptyState =
    !isLoading && Boolean(dateRange.from && dateRange.to) && observations.length === 0 && !error;
  const kpis = useMemo(() => goldKpis({ observations, seriesId }), [observations, seriesId]);
  const seriesTitleLabel = kpis ? t(`series.${kpis.seriesId}`) : t('app.londonPmDefault');

  const z = {
    hero: 0,
    range: error ? 2 : 1,
    summary: error ? 3 : 2,
    charts: error ? 4 : 3,
    footer: error ? 5 : 4
  };

  const handleStartChange = (value: Dayjs | null) => {
    setDateRange({
      from: value ? dayjs(value).format('YYYY-MM-DD') : '',
      to: ''
    });
  };

  const handleEndChange = (value: Dayjs | null) => {
    setDateRange({
      ...dateRange,
      to: value ? dayjs(value).format('YYYY-MM-DD') : ''
    });
  };

  const handleSeriesChange = (nextSeriesId: SeriesId) => {
    setSeriesId(nextSeriesId);
  };

  const handleExportCsv = () => {
    exportGoldSeriesCsv({
      observations,
      seriesId,
      dateRange
    });
  };

  const handleLoadSeries = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitDisabled) {
      return;
    }

    try {
      await fetchObservations({
        from: dateRange.from,
        to: dateRange.to,
        seriesId
      });
    } catch (fetchError: unknown) {
      if (isNetworkFailure(fetchError)) {
        setNetworkWall(true);
        return;
      }
      const msg = fetchError instanceof Error ? fetchError.message : '';
      setSnackbarMessage(resolveUserMessage(t, msg || '') || t('app.loadFailed'));
      setSnackbarOpen(true);
    }
  };

  const handleNetworkRetry = useCallback(async () => {
    clearError();
    setNetworkWall(false);
    const from = dateRange.from || DEFAULT_START_DATE.format('YYYY-MM-DD');
    const to = dateRange.to || DEFAULT_END_DATE.format('YYYY-MM-DD');
    try {
      await fetchObservations({
        from,
        to,
        seriesId
      });
    } catch (retryError: unknown) {
      if (isNetworkFailure(retryError)) {
        setNetworkWall(true);
        return;
      }
      const msg = retryError instanceof Error ? retryError.message : '';
      setSnackbarMessage(resolveUserMessage(t, msg || '') || t('app.loadFailed'));
      setSnackbarOpen(true);
    }
  }, [clearError, dateRange.from, dateRange.to, fetchObservations, seriesId, t]);

  if (networkWall) {
    return (
      <DashboardLayout>
        <AppNavbar />
        <NetworkBlockedPage onRetry={() => void handleNetworkRetry()} retrying={isLoading} />
        <Spinner open={isLoading} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AppNavbar />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={3.5}>
          <Box sx={{ width: '100%', ...entranceSx(z.hero, prefersReducedMotion) }}>
            <HeroPanel seriesTitleLabel={seriesTitleLabel} prefersReducedMotion={prefersReducedMotion} />
          </Box>

          {error ? (
            <Box sx={{ width: '100%', ...entranceSx(1, prefersReducedMotion) }}>
              <Alert severity="warning" variant="outlined">
                {resolveUserMessage(t, error)}
              </Alert>
            </Box>
          ) : null}

          <Box sx={{ width: '100%', ...entranceSx(z.range, prefersReducedMotion) }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(252,250,242,0.96) 100%)'
              }}
            >
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {t('app.rangeSeries')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                {t('app.rangeSeriesHint')}
              </Typography>
              <GoldRangeForm
                btnDisabled={submitDisabled}
                disabledEnd={!dateRange.from}
                endDate={endDate}
                onEndChange={handleEndChange}
                onSeriesChange={handleSeriesChange}
                onStartChange={handleStartChange}
                onSubmit={handleLoadSeries}
                selectedSeries={seriesId}
                startDate={startDate}
              />
              {showEmptyState ? (
                <Alert severity="info" variant="outlined" sx={{ mt: 2.5 }}>
                  {t('app.emptyObservations')}
                </Alert>
              ) : null}
            </Paper>
          </Box>

          <Box sx={{ width: '100%', ...entranceSx(z.summary, prefersReducedMotion) }}>
            <GoldSummaryCards kpis={kpis} />
          </Box>

          <Box sx={{ width: '100%', ...entranceSx(z.charts, prefersReducedMotion) }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(180deg, rgba(255,253,249,0.96) 0%, rgba(244,249,248,0.94) 100%)'
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', md: 'flex-start' }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" sx={{ mb: 0.75 }}>
                      {t('app.chartStudio')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('app.chartStudioBody')}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleExportCsv}
                    disabled={observations.length === 0}
                    sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', md: 'center' } }}
                  >
                    {t('app.exportCsv')}
                  </Button>
                </Stack>
              </Box>
              <GoldCharts />
            </Paper>
          </Box>

          <Box sx={{ textAlign: 'center', width: '100%', ...entranceSx(z.footer, prefersReducedMotion) }}>
            <Typography variant="caption" color="text.secondary">
              {t('app.footer')}
            </Typography>
          </Box>
        </Stack>
      </Container>

      <Spinner open={isLoading} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
