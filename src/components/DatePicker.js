import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GOLD_SERIES_OPTIONS } from '../store/useGoldStore';

function GoldRangeForm({ btnDisabled, disabledEnd, endDate, onEndChange, onSeriesChange, onStartChange, onSubmit, selectedSeries, startDate }) {
  const seriesValue = GOLD_SERIES_OPTIONS.find((option) => option.id === selectedSeries) || GOLD_SERIES_OPTIONS[0];

  return (
    <Stack component="form" spacing={2} sx={{ py: 1 }} onSubmit={onSubmit}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          gap: 2
        }}
      >
        <DatePicker
          label="Start date"
          value={startDate}
          onChange={onStartChange}
          format="DD MMM YYYY"
          disableFuture
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true
            }
          }}
        />
        <DatePicker
          label="End date"
          value={endDate}
          onChange={onEndChange}
          disabled={disabledEnd}
          minDate={startDate || undefined}
          disableFuture
          format="DD MMM YYYY"
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true
            }
          }}
        />
        <Autocomplete
          options={GOLD_SERIES_OPTIONS}
          value={seriesValue}
          onChange={(_, next) => {
            if (next) {
              onSeriesChange(next.id);
            }
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          renderInput={(params) => <TextField {...params} label="FRED gold series" size="small" />}
        />
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Box>
          <TextField
            size="small"
            label="Active series"
            value={seriesValue.label}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: { xs: '100%', sm: 420 } }}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" disabled={btnDisabled} sx={{ minWidth: { sm: 180 }, alignSelf: 'stretch' }}>
          Load gold series
        </Button>
      </Stack>
    </Stack>
  );
}

export default GoldRangeForm;
