import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GoldRangeForm from './components/DatePicker';
import GoldCharts from './components/GoldCharts';
import GoldSummaryCards from './components/GoldSummaryCards';
import Spinner from './components/Spinner';
import useGoldStore, { DEFAULT_GOLD_SERIES_ID } from './store/useGoldStore';
import exportGoldSeriesCsv from './utils/exportGoldSeriesCsv';
import goldKpis from './utils/goldKpis';

const DEFAULT_END_DATE = dayjs().subtract(1, 'day');
const DEFAULT_START_DATE = DEFAULT_END_DATE.subtract(6, 'month').startOf('month');

function App() {
  const observations = useGoldStore((state) => state.observations);
  const dateRange = useGoldStore((state) => state.dateRange);
  const seriesId = useGoldStore((state) => state.seriesId);
  const isLoading = useGoldStore((state) => state.isLoading);
  const error = useGoldStore((state) => state.error);
  const fetchObservations = useGoldStore((state) => state.fetchObservations);
  const setSeriesId = useGoldStore((state) => state.setSeriesId);
  const setDateRange = useGoldStore((state) => state.setDateRange);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      } catch (initialError) {
        setSnackbarMessage(initialError.message || 'Unable to initialize the gold tracker.');
        setSnackbarOpen(true);
      }
    };

    initializeDashboard();
  }, [fetchObservations]);

  const startDate = dateRange.from ? dayjs(dateRange.from) : null;
  const endDate = dateRange.to ? dayjs(dateRange.to) : null;
  const submitDisabled = !dateRange.from || !dateRange.to;
  const showEmptyState = !isLoading && Boolean(dateRange.from && dateRange.to) && observations.length === 0 && !error;
  const kpis = useMemo(() => goldKpis({ observations, seriesId }), [observations, seriesId]);

  const handleStartChange = (value) => {
    setDateRange({
      from: value ? dayjs(value).format('YYYY-MM-DD') : '',
      to: ''
    });
  };

  const handleEndChange = (value) => {
    setDateRange({
      ...dateRange,
      to: value ? dayjs(value).format('YYYY-MM-DD') : ''
    });
  };

  const handleSeriesChange = (nextSeriesId) => {
    setSeriesId(nextSeriesId);
  };

  const handleExportCsv = () => {
    exportGoldSeriesCsv({
      observations,
      seriesId,
      dateRange
    });
  };

  const handleLoadSeries = async (event) => {
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
    } catch (fetchError) {
      setSnackbarMessage(fetchError.message || 'Something went wrong while loading gold data.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(180,134,11,0.12), transparent 32%), radial-gradient(circle at top right, rgba(30,41,59,0.12), transparent 28%), linear-gradient(180deg, #f8f4e8 0%, #f4f1ea 52%, #eef2f0 100%)',
        py: { xs: 3, md: 6 }
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3.5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.25, md: 3.25 },
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'rgba(180, 134, 11, 0.2)',
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,27,18,0.97) 48%, rgba(120,83,12,0.95) 100%)',
              color: '#f8fafc'
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 12% 18%, rgba(251,191,36,0.22), transparent 30%), radial-gradient(circle at 88% 12%, rgba(255,255,255,0.08), transparent 26%)',
                pointerEvents: 'none'
              }}
            />
            <Grid container spacing={3} sx={{ position: 'relative' }}>
              <Grid item xs={12} md={7}>
                <Typography variant="overline" sx={{ letterSpacing: 2.8, color: 'rgba(254,243,199,0.88)' }}>
                  Precious Metals Desk
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, maxWidth: 760, color: '#fffbeb', fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
                  Gold fix tracker powered by FRED historical prints.
                </Typography>
                <Typography variant="body1" sx={{ mt: 1.5, maxWidth: 720, color: 'rgba(226,232,240,0.82)' }}>
                  Follow London bullion market gold fixes in USD per troy ounce, chart the path across any window you choose,
                  and export the same series you see on screen.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="React 17" variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fffbeb' }} />
                  <Chip label="MUI X Charts" variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fffbeb' }} />
                  <Chip label="FRED API" variant="filled" sx={{ bgcolor: 'rgba(251,191,36,0.2)', color: '#fffbeb' }} />
                  <Chip label="CSV export" variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fffbeb' }} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.25,
                    height: '100%',
                    borderColor: 'rgba(251,191,36,0.25)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Stack spacing={1.25}>
                    <Typography variant="overline" sx={{ color: 'rgba(226,232,240,0.85)', letterSpacing: 1.6 }}>
                      Live lens
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#fffbeb' }}>
                      {kpis ? kpis.seriesTitle : 'London PM gold fix'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(226,232,240,0.78)' }}>
                      Data comes from the St. Louis Fed FRED observations API. In development, a local proxy injects your API key
                      so the browser never bundles the secret.
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                          Series ID
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
                          {seriesId}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                          Prints loaded
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
                          {observations.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                          Window
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
                          {dateRange.from && dateRange.to ? `${dateRange.from} -> ${dateRange.to}` : 'Set a range below'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {error ? (
            <Alert severity="warning" variant="outlined">
              {error}
            </Alert>
          ) : null}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(252,250,242,0.96) 100%)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 0.75 }}>
              Range & series
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Pick a calendar window and a curated LBMA gold fix series. Use “Load gold series” after changing inputs.
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
              <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                No observations returned for that combination. Try a wider date range or verify your FRED key and proxy setup.
              </Alert>
            ) : null}
          </Paper>

          <GoldSummaryCards kpis={kpis} />

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
                    Chart studio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Line and bar focus on fix levels; pie and donut summarize how often day-over-day moves were positive,
                    negative, or flat inside your window.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleExportCsv}
                  disabled={observations.length === 0}
                  sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', md: 'center' } }}
                >
                  Export active CSV
                </Button>
              </Stack>
            </Box>
            <GoldCharts />
          </Paper>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Gold tracker built with React, Material UI, Zustand, and FRED. Static hosts like GitHub Pages need a separate proxy —
            see README.
          </Typography>
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
    </Box>
  );
}

export default App;
