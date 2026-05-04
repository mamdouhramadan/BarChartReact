import { useTranslation } from 'react-i18next';
import type { ComponentType, FormEvent } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { Dayjs } from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GOLD_SERIES_OPTIONS } from '../store/useGoldStore';
import { entranceSx } from '../animation/entrance';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import type { SeriesId } from '../types/gold';

const dateSlotProps = (Icon: ComponentType<SvgIconProps>) => ({
  textField: {
    size: 'medium' as const,
    fullWidth: true,
    InputProps: {
      startAdornment: (
        <InputAdornment position="start">
          <Icon sx={{ color: 'primary.main', opacity: 0.9 }} fontSize="small" />
        </InputAdornment>
      )
    }
  }
});

type GoldSeriesOption = (typeof GOLD_SERIES_OPTIONS)[number];

export interface GoldRangeFormProps {
  btnDisabled: boolean;
  disabledEnd: boolean;
  endDate: Dayjs | null;
  onEndChange: (value: Dayjs | null) => void;
  onSeriesChange: (id: SeriesId) => void;
  onStartChange: (value: Dayjs | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  selectedSeries: SeriesId;
  startDate: Dayjs | null;
}

export default function GoldRangeForm({
  btnDisabled,
  disabledEnd,
  endDate,
  onEndChange,
  onSeriesChange,
  onStartChange,
  onSubmit,
  selectedSeries,
  startDate
}: GoldRangeFormProps) {
  const { t } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const seriesValue: GoldSeriesOption = GOLD_SERIES_OPTIONS.find((option) => option.id === selectedSeries) ?? GOLD_SERIES_OPTIONS[0]!;
  const seriesLabel = t(`series.${seriesValue.id}`);

  return (
    <Stack component="form" spacing={0} onSubmit={onSubmit} sx={{ pt: 0.5 }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 1,
          borderColor: 'rgba(161, 98, 7, 0.2)',
          background: 'linear-gradient(165deg, rgba(255,255,255,0.96) 0%, rgba(252,248,238,0.98) 55%, rgba(244,249,246,0.95) 100%)',
          boxShadow: '0 12px 40px rgba(23, 32, 51, 0.06)'
        }}
      >
        <Stack spacing={2.5}>
          <Box sx={{ width: '100%', ...entranceSx(0, prefersReducedMotion, { tight: true }) }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 1.5, fontWeight: 800 }}>
              {t('form.dateWindow')}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={entranceSx(0, prefersReducedMotion, { tight: true, baseDelay: 0.08 })}>
                <DatePicker
                  label={t('form.startDate')}
                  value={startDate}
                  onChange={onStartChange}
                  format="DD MMM YYYY"
                  disableFuture
                  slotProps={dateSlotProps(CalendarMonthOutlined)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={entranceSx(1, prefersReducedMotion, { tight: true, baseDelay: 0.08 })}>
                <DatePicker
                  label={t('form.endDate')}
                  value={endDate}
                  onChange={onEndChange}
                  disabled={disabledEnd}
                  minDate={startDate ?? undefined}
                  disableFuture
                  format="DD MMM YYYY"
                  slotProps={dateSlotProps(CalendarMonthOutlined)}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: 'rgba(161, 98, 7, 0.12)' }} />

          <Box sx={{ width: '100%', ...entranceSx(1, prefersReducedMotion, { tight: true }) }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 1.5, fontWeight: 800 }}>
              {t('form.seriesSection')}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }} alignItems="stretch">
              <Grid size={{ xs: 12, md: 5 }} sx={entranceSx(0, prefersReducedMotion, { tight: true, baseDelay: 0.08 })}>
                <Autocomplete<GoldSeriesOption, false, false, false>
                  options={[...GOLD_SERIES_OPTIONS]}
                  value={seriesValue}
                  onChange={(_, next) => {
                    if (next) {
                      onSeriesChange(next.id);
                    }
                  }}
                  getOptionLabel={(option) => t(`series.${option.id}`)}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('form.goldSeries')}
                      size="medium"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <InsightsOutlined sx={{ color: 'primary.main', opacity: 0.9 }} fontSize="small" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={entranceSx(1, prefersReducedMotion, { tight: true, baseDelay: 0.08 })}>
                <TextField
                  size="medium"
                  label={t('form.activeSeries')}
                  value={seriesLabel}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <InsightsOutlined sx={{ color: 'text.secondary', opacity: 0.75 }} fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
              </Grid>
              <Grid
                size={{ xs: 12, md: 3 }}
                sx={{ display: 'flex', ...entranceSx(2, prefersReducedMotion, { tight: true, baseDelay: 0.08 }) }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={btnDisabled}
                  fullWidth
                  sx={{ minHeight: 56, alignSelf: 'stretch', fontSize: '1rem' }}
                >
                  {t('form.loadSeries')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
