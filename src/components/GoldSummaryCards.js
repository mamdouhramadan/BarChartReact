import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function SummaryCard({ eyebrow, value, helperText, accent, displayFont }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        borderColor: 'divider',
        background: `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, ${accent} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Typography
        aria-hidden
        sx={{
          position: 'absolute',
          right: -18,
          top: -12,
          fontSize: 88,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.32)',
          fontFamily: displayFont
        }}
      >
        ·
      </Typography>
      <Stack spacing={0.75}>
        <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.6 }}>
          {eyebrow}
        </Typography>
        <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      </Stack>
    </Paper>
  );
}

function GoldSummaryCards({ kpis }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const displayFont = theme.typography.h3.fontFamily;

  if (!kpis) {
    return null;
  }

  const changeTone =
    kpis.changePct >= 0 ? t('summary.bullishDrift') : t('summary.bearishDrift');
  const trendLabel = kpis.changePct >= 0 ? `+${kpis.changePct}%` : `${kpis.changePct}%`;
  const trendColor = kpis.changePct >= 0 ? 'success' : 'warning';
  const seriesTitle = t(`series.${kpis.seriesId}`);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6">{t('summary.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('summary.subtitle')}
          </Typography>
        </Box>
        <Chip color={trendColor} label={t('summary.windowMove', { value: trendLabel })} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }} />
      </Stack>
      <Fade in timeout={520} key={`${kpis.seriesId}-${kpis.observationCount}-${kpis.latestDate}`}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} lg={3}>
            <SummaryCard
              eyebrow={t('summary.series')}
              value={seriesTitle}
              helperText={t('summary.observationsThrough', { count: kpis.observationCount, date: kpis.latestDate })}
              accent="rgba(180,134,11,0.12)"
              displayFont={displayFont}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <SummaryCard
              eyebrow={t('summary.openVsClose')}
              value={`${kpis.startPrice} -> ${kpis.endPrice}`}
              helperText={changeTone}
              accent="rgba(217,119,6,0.1)"
              displayFont={displayFont}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <SummaryCard
              eyebrow={t('summary.rangeLow')}
              value={kpis.minPrice}
              helperText={t('summary.rangeLowHelp')}
              accent="rgba(30,64,175,0.08)"
              displayFont={displayFont}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <SummaryCard
              eyebrow={t('summary.rangeHigh')}
              value={kpis.maxPrice}
              helperText={t('summary.rangeHighHelp', { pct: kpis.changePct })}
              accent="rgba(23,32,51,0.08)"
              displayFont={displayFont}
            />
          </Grid>
        </Grid>
      </Fade>
    </Stack>
  );
}

export default GoldSummaryCards;
