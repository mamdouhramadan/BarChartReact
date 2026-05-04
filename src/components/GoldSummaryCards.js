import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { entranceSx } from '../animation/entrance';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

function SummaryCard({ eyebrow, value, helperText, accent, displayFont }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        boxSizing: 'border-box',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'divider',
        background: `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, ${accent} 100%)`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', flex: 1, minHeight: 0 }}>
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
      </Box>
    </Paper>
  );
}

function GoldSummaryCards({ kpis }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const displayFont = theme.typography.h3.fontFamily;

  const headerMotion = useMemo(
    () => ({
      title: entranceSx(0, prefersReducedMotion, { tight: true }),
      chip: entranceSx(1, prefersReducedMotion, { tight: true })
    }),
    [prefersReducedMotion]
  );

  if (!kpis) {
    return null;
  }

  const changeTone =
    kpis.changePct >= 0 ? t('summary.bullishDrift') : t('summary.bearishDrift');
  const trendLabel = kpis.changePct >= 0 ? `+${kpis.changePct}%` : `${kpis.changePct}%`;
  const trendColor = kpis.changePct >= 0 ? 'success' : 'warning';
  const seriesTitle = t(`series.${kpis.seriesId}`);

  const cards = [
    {
      key: 'series',
      eyebrow: t('summary.series'),
      value: seriesTitle,
      helperText: t('summary.observationsThrough', { count: kpis.observationCount, date: kpis.latestDate }),
      accent: 'rgba(180,134,11,0.12)'
    },
    {
      key: 'openClose',
      eyebrow: t('summary.openVsClose'),
      value: `${kpis.startPrice} -> ${kpis.endPrice}`,
      helperText: changeTone,
      accent: 'rgba(217,119,6,0.1)'
    },
    {
      key: 'low',
      eyebrow: t('summary.rangeLow'),
      value: kpis.minPrice,
      helperText: t('summary.rangeLowHelp'),
      accent: 'rgba(30,64,175,0.08)'
    },
    {
      key: 'high',
      eyebrow: t('summary.rangeHigh'),
      value: kpis.maxPrice,
      helperText: t('summary.rangeHighHelp', { pct: kpis.changePct }),
      accent: 'rgba(23,32,51,0.08)'
    }
  ];

  const gridKey = `${kpis.seriesId}-${kpis.observationCount}-${kpis.latestDate}`;

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Box sx={{ minWidth: 0, ...headerMotion.title }}>
          <Typography variant="h6">{t('summary.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('summary.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, ...headerMotion.chip }}>
          <Chip color={trendColor} label={t('summary.windowMove', { value: trendLabel })} />
        </Box>
      </Stack>
      <Box
        key={gridKey}
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))'
          }
        }}
      >
        {cards.map((card, index) => (
          <Box
            key={card.key}
            sx={{
              minWidth: 0,
              ...entranceSx(index, prefersReducedMotion, {
                delayStep: 0.09,
                baseDelay: 0.06
              })
            }}
          >
            <SummaryCard
              eyebrow={card.eyebrow}
              value={card.value}
              helperText={card.helperText}
              accent={card.accent}
              displayFont={displayFont}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

export default GoldSummaryCards;
