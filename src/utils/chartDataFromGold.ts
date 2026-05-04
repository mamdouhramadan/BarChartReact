import type { Observation } from '../types/gold';

const EPS = 1e-6;

export interface LineSeriesItem {
  id: string;
  data: number[];
  labelKey: string;
  showMark: boolean;
}

export interface BarSeriesItem {
  data: number[];
  labelKey: string;
}

export interface PieSlice {
  id: number;
  labelKey: string;
  value: number;
}

export interface ReturnBucket {
  key: string;
  labelKey: string;
  count: number;
}

export interface ChartDerivedData {
  hasData: boolean;
  hasBarData: boolean;
  hasPieData: boolean;
  dateLabels: string[];
  lineSeries: LineSeriesItem[];
  barLabels: string[];
  barSeries: BarSeriesItem[];
  pieSeries: PieSlice[];
  returnBuckets: ReturnBucket[];
}

/** Build chart datasets from sorted gold observations (date + USD price). */
function chartDataFromGold(observations: Observation[] = []): ChartDerivedData {
  const sorted = [...observations].sort((a, b) => a.date.localeCompare(b.date));
  const dateLabels = sorted.map((row) => row.date);
  const prices = sorted.map((row) => row.value);

  const lineSeries: LineSeriesItem[] = [
    {
      id: 'gold',
      data: prices,
      labelKey: 'lineSeriesLabel',
      showMark: true
    }
  ];

  let barLabels: string[] = [];
  let barSeries: BarSeriesItem[] = [];
  if (sorted.length >= 1) {
    const firstPrice = sorted[0]!.value;
    const lastPrice = sorted[sorted.length - 1]!.value;
    barLabels = ['periodStart', 'periodEnd'];
    barSeries = [
      {
        data: [firstPrice, lastPrice],
        labelKey: 'barUsdLabel'
      }
    ];
  }

  let pieSeries: PieSlice[] = [];
  let returnBuckets: ReturnBucket[] = [];

  if (sorted.length >= 2) {
    let up = 0;
    let down = 0;
    let flat = 0;

    for (let index = 1; index < sorted.length; index += 1) {
      const delta = sorted[index]!.value - sorted[index - 1]!.value;
      if (delta > EPS) {
        up += 1;
      } else if (delta < -EPS) {
        down += 1;
      } else {
        flat += 1;
      }
    }

    returnBuckets = [
      { key: 'up', labelKey: 'pieUp', count: up },
      { key: 'down', labelKey: 'pieDown', count: down },
      { key: 'flat', labelKey: 'pieFlat', count: flat }
    ].filter((bucket) => bucket.count > 0);

    pieSeries = returnBuckets.map((bucket, index) => ({
      id: index,
      labelKey: bucket.labelKey,
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
}

export default chartDataFromGold;
