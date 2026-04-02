const EPS = 1e-6;

/**
 * Build chart datasets from sorted gold observations (date + USD price).
 * Pie/donut: counts trading days by sign of day-over-day change (not a portfolio allocation).
 */
const chartDataFromGold = (observations = []) => {
  const sorted = [...observations].sort((a, b) => a.date.localeCompare(b.date));
  const dateLabels = sorted.map((row) => row.date);
  const prices = sorted.map((row) => row.value);

  const lineSeries = [
    {
      id: 'gold',
      data: prices,
      label: 'Gold (USD / t oz)',
      showMark: true
    }
  ];

  let barLabels = [];
  let barSeries = [];
  if (sorted.length >= 1) {
    const firstPrice = sorted[0].value;
    const lastPrice = sorted[sorted.length - 1].value;
    barLabels = ['Period start', 'Period end'];
    barSeries = [
      {
        data: [firstPrice, lastPrice],
        label: 'USD / t oz'
      }
    ];
  }

  let pieSeries = [];
  let returnBuckets = [];

  if (sorted.length >= 2) {
    let up = 0;
    let down = 0;
    let flat = 0;

    for (let index = 1; index < sorted.length; index += 1) {
      const delta = sorted[index].value - sorted[index - 1].value;
      if (delta > EPS) {
        up += 1;
      } else if (delta < -EPS) {
        down += 1;
      } else {
        flat += 1;
      }
    }

    returnBuckets = [
      { key: 'up', label: 'Up days', count: up },
      { key: 'down', label: 'Down days', count: down },
      { key: 'flat', label: 'Flat days', count: flat }
    ].filter((bucket) => bucket.count > 0);

    pieSeries = returnBuckets.map((bucket, index) => ({
      id: index,
      label: bucket.label,
      value: bucket.count
    }));
  }

  return {
    hasData: sorted.length > 0,
    hasBarData: sorted.length >= 1,
    hasPieData: pieSeries.length > 0,
    dateLabels,
    lineSeries,
    barLabels,
    barSeries,
    pieSeries,
    returnBuckets
  };
};

export default chartDataFromGold;
