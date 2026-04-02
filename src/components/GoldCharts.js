import React, { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import useGoldStore from '../store/useGoldStore';
import chartDataFromGold from '../utils/chartDataFromGold';

const PIE_DEFAULT_COLORS = ['#b8860b', '#64748b', '#0f766e', '#c2410c', '#1e3a5f'];

function PieSideLegend({ pieSeries }) {
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
                {slice.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {slice.value} day{slice.value === 1 ? '' : 's'} in range
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const observations = useGoldStore((state) => state.observations);
  const seriesId = useGoldStore((state) => state.seriesId);
  const [activeTab, setActiveTab] = useState(0);
  const chartData = useMemo(() => chartDataFromGold(observations), [observations]);
  const lineWidth = Math.max(isSmallScreen ? 640 : 860, chartData.dateLabels.length * 28);
  const barWidth = 420;
  const radialWidth = isSmallScreen ? 320 : 380;

  if (!chartData.hasData) {
    return (
      <Alert severity="info" variant="outlined">
        No gold observations are available for this range. Try widening the dates or pick another LBMA series.
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
          <Chip label={`FRED · ${seriesId}`} variant="outlined" color="primary" />
          <Chip label={`Fix prints: ${chartData.dateLabels.length}`} variant="outlined" />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Line tracks the fix level; pie and donut summarize day-over-day direction counts.
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
            borderRadius: 999
          }
        }}
      >
        <Tab label="Line" id="chart-tab-0" aria-controls="chart-panel-0" sx={{ minHeight: 52 }} />
        <Tab label="Bar" id="chart-tab-1" aria-controls="chart-panel-1" sx={{ minHeight: 52 }} />
        <Tab label="Pie" id="chart-tab-2" aria-controls="chart-panel-2" sx={{ minHeight: 52 }} />
        <Tab label="Donut" id="chart-tab-3" aria-controls="chart-panel-3" sx={{ minHeight: 52 }} />
      </Tabs>

      {activeTab === 0 ? (
        <ChartCard
          eyebrow="Trajectory"
          title="Fix level through time"
          subtitle="London bullion market gold fix in U.S. dollars per troy ounce, plotted across your selected window."
          gradient="linear-gradient(180deg, rgba(180,134,11,0.12) 0%, rgba(255,253,249,0.98) 100%)"
        >
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <LineChart
              xAxis={[{ scaleType: 'point', data: chartData.dateLabels }]}
              series={chartData.lineSeries}
              width={lineWidth}
              height={390}
              margin={{ top: 20, right: 24, bottom: 78, left: 56 }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: 0
                }
              }}
            />
          </Box>
        </ChartCard>
      ) : null}

      {activeTab === 1 ? (
        <ChartCard
          eyebrow="Endpoints"
          title="Window open vs close"
          subtitle="Compare the first and last fix in this range — a simple read on directional drift."
          gradient="linear-gradient(180deg, rgba(30,64,175,0.08) 0%, rgba(255,253,249,0.98) 100%)"
        >
          {chartData.hasBarData ? (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: chartData.barLabels }]}
                series={[
                  {
                    ...chartData.barSeries[0],
                    color: theme.palette.primary.main
                  }
                ]}
                width={barWidth}
                height={390}
                margin={{ top: 20, right: 24, bottom: 78, left: 48 }}
                borderRadius={10}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0
                  }
                }}
              />
            </Box>
          ) : (
            <Alert severity="info">Not enough data for a bar comparison.</Alert>
          )}
        </ChartCard>
      ) : null}

      {activeTab === 2 ? (
        <ChartCard
          eyebrow="Daily rhythm"
          title="Day-over-day direction mix"
          subtitle="Each slice counts trading days where the fix moved up, down, or was flat versus the prior print — not a weighting of holdings."
          gradient="linear-gradient(180deg, rgba(217,119,6,0.1) 0%, rgba(255,253,249,0.98) 100%)"
        >
          {chartData.hasPieData ? (
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: chartData.pieSeries,
                      cornerRadius: 6,
                      paddingAngle: 2,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 12, additionalRadius: -12, color: 'gray' }
                    }
                  ]}
                  width={radialWidth}
                  height={390}
                  margin={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Grid>
              <PieSideLegend pieSeries={chartData.pieSeries} />
            </Grid>
          ) : (
            <Alert severity="info">Need at least two fix prints in range to score up/down/flat days.</Alert>
          )}
        </ChartCard>
      ) : null}

      {activeTab === 3 ? (
        <ChartCard
          eyebrow="Presentation"
          title="Radial direction mix"
          subtitle="Same daily-direction counts as the pie tab, tightened for slide-friendly viewing."
          gradient="linear-gradient(180deg, rgba(23,32,51,0.08) 0%, rgba(255,253,249,0.98) 100%)"
        >
          {chartData.hasPieData ? (
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: chartData.pieSeries,
                      innerRadius: 72,
                      cornerRadius: 6,
                      paddingAngle: 2,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 56, additionalRadius: -12, color: 'gray' }
                    }
                  ]}
                  width={radialWidth}
                  height={390}
                  margin={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Grid>
              <PieSideLegend pieSeries={chartData.pieSeries} />
            </Grid>
          ) : (
            <Alert severity="info">Need at least two fix prints in range to score up/down/flat days.</Alert>
          )}
        </ChartCard>
      ) : null}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Source: FRED. Gold fixes can skip days when the market is closed; pie and donut require consecutive prints to infer direction.
      </Typography>
    </Box>
  );
}

export default GoldCharts;
