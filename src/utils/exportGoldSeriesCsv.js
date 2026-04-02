const escapeCsvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const exportGoldSeriesCsv = ({ observations = [], seriesId = '', dateRange = { from: '', to: '' } }) => {
  const lines = [
    ['date', 'price_usd_per_troy_ounce', 'series_id', 'range_from', 'range_to'],
    ...observations.map((row) => [row.date, row.value, seriesId, dateRange.from, dateRange.to])
  ];

  const csv = lines.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `gold-${seriesId}-${dateRange.from}-to-${dateRange.to}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export default exportGoldSeriesCsv;
