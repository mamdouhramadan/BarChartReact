import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import useGoldStore from '../store/useGoldStore';
import chartDataFromGold from '../utils/chartDataFromGold';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const PIE_DEFAULT_COLORS = ['#b8860b', '#64748b', '#0f766e', '#c2410c', '#1e3a5f'];

const baseAnimation = {
  duration: 1100,
  easing: 'easeOutQuart'
};

function chartFontFamily(theme) {
  return theme.typography.fontFamily;
}

function PieSideLegend({ pieSeries, translate }) {
  return (
    <Grid item xs={12} md={5}>
      <Stack spacing={1.25} sx={{ pt: { xs: 0, md: 1 }, maxHeight: { md: 360 }, overflowY: 'auto' }}>
        {pieSeries.map((slice, index) => (
          <Box key={slice.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, minWidth: 0 }}>
            <Box
              aria-hidden
              sx={{
                width: 12,
                height: 12,
                mt: 0.7,
                flexShrink: 0,
                borderRadius: 0.5,
                bgcolor: PIE_DEFAULT_COLORS[index % PIE_DEFAULT_COLORS.length]
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {translate(`chart.${slice.labelKey}`)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {translate('chart.pieLegendDays', { count: slice.value })}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Grid>
  );
}

function ChartCard({ title, subtitle, children, gradient, eyebrow }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, md: 2 },
        borderColor: 'divider',
        background: gradient,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(255,255,255,0.35), transparent 24%), linear-gradient(180deg, transparent, rgba(255,255,255,0.05))',
          pointerEvents: 'none'
        }}
      />
      <Box sx={{ position: 'relative' }}>
        {eyebrow ? (
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.6 }}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
        {children}
      </Box>
    </Paper>
  );
}

function GoldCharts() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const observations = useGoldStore((state) => state.observations);
  const [activeTab, setActiveTab] = useState(0);
  const chartData = useMemo(() => chartDataFromGold(observations), [observations]);
  const lineWidth = Math.max(isSmallScreen ? 640 : 860, chartData.dateLabels.length * 28);
  const radialSize = isSmallScreen ? 320 : 380;

  const lineChartData = useMemo(() => {
    if (!chartData.hasData || !chartData.lineSeries[0]) {
      return null;
    }
    const s = chartData.lineSeries[0];
    return {
      labels: chartData.dateLabels,
      datasets: [
        {
          label: t(`chart.${s.labelKey}`),
          data: s.data,
          borderColor: '#b8860b',
          backgroundColor: 'rgba(184, 134, 11, 0.14)',
          borderWidth: 2,
          pointRadius: chartData.dateLabels.length > 80 ? 0 : 3,
          pointHoverRadius: 5,
          tension: 0.28,
          fill: true
        }
      ]
    };
  }, [chartData, t]);

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: baseAnimation,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: chartFontFamily(theme) },
            padding: 16,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { family: chartFontFamily(theme) },
          bodyFont: { family: chartFontFamily(theme) },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { family: chartFontFamily(theme), size: 11 },
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 24
          }
        },
        y: {
          grid: { color: 'rgba(15, 23, 42, 0.06)' },
          ticks: {
            font: { family: chartFontFamily(theme) },
            callback: (value) => `$${Number(value).toLocaleString()}`
          }
        }
      }
    }),
    [theme]
  );

  const barChartData = useMemo(() => {
    if (!chartData.hasBarData || !chartData.barSeries[0]) {
      return null;
    }
    const s = chartData.barSeries[0];
    return {
      labels: chartData.barLabels.map((key) => t(`chart.${key}`)),
      datasets: [
        {
          label: t(`chart.${s.labelKey}`),
          data: s.data,
          backgroundColor: [theme.palette.primary.main, theme.palette.primary.dark || '#1e3a5f'],
          borderRadius: 10,
          borderSkipped: false
        }
      ]
    };
  }, [chartData, t, theme.palette.primary.dark, theme.palette.primary.main]);

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { ...baseAnimation, delay: (ctx) => (ctx.type === 'data' ? ctx.dataIndex * 120 : 0) },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: chartFontFamily(theme) }, padding: 16 }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: $${Number(ctx.raw).toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: chartFontFamily(theme) } }
        },
        y: {
          grid: { color: 'rgba(15, 23, 42, 0.06)' },
          ticks: {
            font: { family: chartFontFamily(theme) },
            callback: (value) => `$${Number(value).toLocaleString()}`
          }
        }
      }
    }),
    [theme]
  );

  const pieChartData = useMemo(() => {
    if (!chartData.hasPieData) {
      return null;
    }
    return {
      labels: chartData.pieSeries.map((p) => t(`chart.${p.labelKey}`)),
      datasets: [
        {
          data: chartData.pieSeries.map((p) => p.value),
          backgroundColor: chartData.pieSeries.map((_, i) => PIE_DEFAULT_COLORS[i % PIE_DEFAULT_COLORS.length]),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 12
        }
      ]
    };
  }, [chartData, t]);

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        ...baseAnimation,
        animateRotate: true,
        animateScale: true
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          bodyFont: { family: chartFontFamily(theme) },
          padding: 12,
          cornerRadius: 8
        }
      }
    }),
    [theme]
  );

  const doughnutOptions = useMemo(
    () => ({
      ...pieOptions,
      cutout: '58%'
    }),
    [pieOptions]
  );

  if (!chartData.hasData) {
    return (
      <Alert severity="info" variant="outlined">
        {t('chart.noObservations')}
      </Alert>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1}
        sx={{ mb: 2, alignItems: { md: 'center' }, justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip label={t('chart.dataBadge')} variant="outlined" color="primary" />
          <Chip label={t('chart.fixPrints', { count: chartData.dateLabels.length })} variant="outlined" />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {t('chart.tabsHint')}
        </Typography>
      </Stack>
      <Tabs
        value={activeTab}
        onChange={(_, nextTab) => setActiveTab(nextTab)}
        variant={isSmallScreen ? 'scrollable' : 'standard'}
        allowScrollButtonsMobile
        sx={{
          mb: 3,
          minHeight: 52,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: 999,
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }}
      >
        <Tab label={t('chart.tabLine')} id="chart-tab-0" aria-controls="chart-panel-0" sx={{ minHeight: 52 }} />
        <Tab label={t('chart.tabBar')} id="chart-tab-1" aria-controls="chart-panel-1" sx={{ minHeight: 52 }} />
        <Tab label={t('chart.tabPie')} id="chart-tab-2" aria-controls="chart-panel-2" sx={{ minHeight: 52 }} />
        <Tab label={t('chart.tabDonut')} id="chart-tab-3" aria-controls="chart-panel-3" sx={{ minHeight: 52 }} />
      </Tabs>

      {activeTab === 0 && lineChartData ? (
        <Fade in timeout={480}>
          <Box>
            <ChartCard
              eyebrow={t('chart.lineEyebrow')}
              title={t('chart.lineTitle')}
              subtitle={t('chart.lineSubtitle')}
              gradient="linear-gradient(180deg, rgba(180,134,11,0.12) 0%, rgba(255,253,249,0.98) 100%)"
            >
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ width: lineWidth, height: 390, position: 'relative' }}>
                  <Line data={lineChartData} options={lineOptions} />
                </Box>
              </Box>
            </ChartCard>
          </Box>
        </Fade>
      ) : null}

      {activeTab === 1 ? (
        <Fade in timeout={480}>
          <Box>
            <ChartCard
              eyebrow={t('chart.barEyebrow')}
              title={t('chart.barTitle')}
              subtitle={t('chart.barSubtitle')}
              gradient="linear-gradient(180deg, rgba(30,64,175,0.08) 0%, rgba(255,253,249,0.98) 100%)"
            >
              {chartData.hasBarData && barChartData ? (
                <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', height: 390, position: 'relative' }}>
                  <Bar data={barChartData} options={barOptions} />
                </Box>
              ) : (
                <Alert severity="info">{t('chart.barNotEnough')}</Alert>
              )}
            </ChartCard>
          </Box>
        </Fade>
      ) : null}

      {activeTab === 2 ? (
        <Fade in timeout={480}>
          <Box>
            <ChartCard
              eyebrow={t('chart.pieEyebrow')}
              title={t('chart.pieTitle')}
              subtitle={t('chart.pieSubtitle')}
              gradient="linear-gradient(180deg, rgba(217,119,6,0.1) 0%, rgba(255,253,249,0.98) 100%)"
            >
              {chartData.hasPieData && pieChartData ? (
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: radialSize, height: 390, position: 'relative' }}>
                      <Pie data={pieChartData} options={pieOptions} />
                    </Box>
                  </Grid>
                  <PieSideLegend pieSeries={chartData.pieSeries} translate={t} />
                </Grid>
              ) : (
                <Alert severity="info">{t('chart.pieNeedTwo')}</Alert>
              )}
            </ChartCard>
          </Box>
        </Fade>
      ) : null}

      {activeTab === 3 ? (
        <Fade in timeout={480}>
          <Box>
            <ChartCard
              eyebrow={t('chart.donutEyebrow')}
              title={t('chart.donutTitle')}
              subtitle={t('chart.donutSubtitle')}
              gradient="linear-gradient(180deg, rgba(23,32,51,0.08) 0%, rgba(255,253,249,0.98) 100%)"
            >
              {chartData.hasPieData && pieChartData ? (
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: radialSize, height: 390, position: 'relative' }}>
                      <Doughnut data={pieChartData} options={doughnutOptions} />
                    </Box>
                  </Grid>
                  <PieSideLegend pieSeries={chartData.pieSeries} translate={t} />
                </Grid>
              ) : (
                <Alert severity="info">{t('chart.pieNeedTwo')}</Alert>
              )}
            </ChartCard>
          </Box>
        </Fade>
      ) : null}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {t('chart.footnote')}
      </Typography>
    </Box>
  );
}

export default GoldCharts;
