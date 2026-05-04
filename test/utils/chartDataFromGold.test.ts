import { describe, expect, it } from 'vitest';
import chartDataFromGold from '../../src/utils/chartDataFromGold';

describe('chartDataFromGold', () => {
  it('returns empty structure for no observations', () => {
    const d = chartDataFromGold([]);
    expect(d.hasData).toBe(false);
    expect(d.hasBarData).toBe(false);
    expect(d.hasPieData).toBe(false);
    expect(d.dateLabels).toEqual([]);
    expect(d.pieSeries).toEqual([]);
  });

  it('builds line and bar for a single point', () => {
    const d = chartDataFromGold([{ date: '2024-01-01', value: 42 }]);
    expect(d.hasData).toBe(true);
    expect(d.hasBarData).toBe(true);
    expect(d.hasPieData).toBe(false);
    expect(d.lineSeries[0]!.data).toEqual([42]);
    expect(d.barLabels).toEqual(['periodStart', 'periodEnd']);
    expect(d.barSeries[0]!.data).toEqual([42, 42]);
  });

  it('counts up, down, and flat day-over-day moves', () => {
    const d = chartDataFromGold([
      { date: '2024-01-01', value: 10 },
      { date: '2024-01-02', value: 12 },
      { date: '2024-01-03', value: 11 },
      { date: '2024-01-04', value: 11 }
    ]);
    expect(d.hasPieData).toBe(true);
    const byLabel = Object.fromEntries(d.returnBuckets.map((b) => [b.key, b.count]));
    expect(byLabel.up).toBe(1);
    expect(byLabel.down).toBe(1);
    expect(byLabel.flat).toBe(1);
  });
});
