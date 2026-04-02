import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function SummaryCard({ eyebrow, value, helperText, accent }) {
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
          fontFamily: '"IBM Plex Serif", Georgia, serif'
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
  if (!kpis) {
    return null;
  }

  const changeTone =
    kpis.changePct >= 0
      ? 'Bullish drift across the selected window for this fix series.'
      : 'Pressure eased across the selected window for this fix series.';
  const trendLabel = kpis.changePct >= 0 ? `+${kpis.changePct}%` : `${kpis.changePct}%`;
  const trendColor = kpis.changePct >= 0 ? 'success' : 'warning';

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6">Bullion signal</Typography>
          <Typography variant="body2" color="text.secondary">
            Snapshot for the active FRED series and date window (USD per troy ounce).
          </Typography>
        </Box>
        <Chip color={trendColor} label={`Window move ${trendLabel}`} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }} />
      </Stack>
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            eyebrow="Series"
            value={kpis.seriesTitle}
            helperText={`${kpis.observationCount} observations through ${kpis.latestDate}`}
            accent="rgba(180,134,11,0.12)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            eyebrow="Open vs close"
            value={`${kpis.startPrice} -> ${kpis.endPrice}`}
            helperText={changeTone}
            accent="rgba(217,119,6,0.1)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            eyebrow="Range low"
            value={kpis.minPrice}
            helperText="Lowest fix printed inside the window."
            accent="rgba(30,64,175,0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            eyebrow="Range high"
            value={kpis.maxPrice}
            helperText={`${kpis.changePct}% total move across the window.`}
            accent="rgba(23,32,51,0.08)"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default GoldSummaryCards;
