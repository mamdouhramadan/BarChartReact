import { describe, expect, it } from 'vitest';
import goldKpis from '../../src/utils/goldKpis';

describe('goldKpis', () => {
  it('returns null when there are no observations', () => {
    expect(goldKpis({ observations: [], seriesId: 'FREE_GOLD_USD' })).toBeNull();
  });

  it('computes window stats from sorted observations', () => {
    const kpis = goldKpis({
      observations: [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 110 }
      ],
      seriesId: 'FREE_GOLD_USD'
    });

    expect(kpis).not.toBeNull();
    expect(kpis!.observationCount).toBe(2);
    expect(kpis!.startPrice).toBe(100);
    expect(kpis!.endPrice).toBe(110);
    expect(kpis!.minPrice).toBe(100);
    expect(kpis!.maxPrice).toBe(110);
    expect(kpis!.changePct).toBe(10);
    expect(kpis!.latestDate).toBe('2024-01-02');
    expect(kpis!.seriesId).toBe('FREE_GOLD_USD');
  });
});
