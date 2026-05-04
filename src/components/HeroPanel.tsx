import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import useGoldStore from '../store/useGoldStore';
import { entranceSx } from '../animation/entrance';

export interface HeroPanelProps {
  seriesTitleLabel: string;
  prefersReducedMotion: boolean;
}

export default function HeroPanel({ seriesTitleLabel, prefersReducedMotion }: HeroPanelProps) {
  const { t } = useTranslation();
  const seriesId = useGoldStore((s) => s.seriesId);
  const observations = useGoldStore((s) => s.observations);
  const dateRange = useGoldStore((s) => s.dateRange);

  return (
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
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="overline" sx={{ letterSpacing: 2.8, color: 'rgba(254,243,199,0.88)' }}>
            {t('app.preciousMetalsDesk')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              mt: 1,
              maxWidth: 760,
              color: '#fffbeb',
              fontFamily: (theme) => theme.typography.h3.fontFamily
            }}
          >
            {t('app.heroTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1.5, maxWidth: 720, color: 'rgba(226,232,240,0.82)' }}>
            {t('app.heroBody')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
            {(
              [
                { key: 'react', label: t('app.chipReact'), sx: { bgcolor: 'rgba(255,255,255,0.1)', color: '#fffbeb' } },
                { key: 'chart', label: t('app.chipChartJs'), sx: { bgcolor: 'rgba(255,255,255,0.1)', color: '#fffbeb' } },
                { key: 'api', label: t('app.chipDataApi'), sx: { bgcolor: 'rgba(251,191,36,0.2)', color: '#fffbeb' } },
                { key: 'csv', label: t('app.chipCsv'), sx: { bgcolor: 'rgba(255,255,255,0.1)', color: '#fffbeb' } }
              ]
            ).map((chip, chipIndex) => (
              <Box
                key={chip.key}
                sx={entranceSx(chipIndex, prefersReducedMotion, {
                  tight: true,
                  baseDelay: 0.38,
                  delayStep: 0.05
                })}
              >
                <Chip label={chip.label} variant="filled" sx={chip.sx} />
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
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
                {t('app.liveLens')}
              </Typography>
              <Typography variant="h5" sx={{ color: '#fffbeb' }}>
                {seriesTitleLabel}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(226,232,240,0.78)' }}>
                {t('app.dataExplainer')}
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                    {t('app.seriesId')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
                    {seriesId}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                    {t('app.printsLoaded')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
                    {observations.length}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                    {t('app.window')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700 }}>
                    {dateRange.from && dateRange.to
                      ? `${dateRange.from} -> ${dateRange.to}`
                      : t('app.setRangeBelow')}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
