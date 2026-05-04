import { beforeEach, describe, expect, it, vi } from 'vitest';
import exportGoldSeriesCsv from '../../src/utils/exportGoldSeriesCsv';

describe('exportGoldSeriesCsv', () => {
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
  const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
  });

  it('creates a CSV blob and triggers download', () => {
    const click = vi.fn();
    const anchor = { href: '', download: '', click } as unknown as HTMLAnchorElement;
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    const append = vi.spyOn(document.body, 'appendChild').mockImplementation(() => anchor);
    const remove = vi.spyOn(document.body, 'removeChild').mockImplementation(() => anchor);

    try {
      exportGoldSeriesCsv({
        observations: [
          { date: '2024-01-01', value: 100 },
          { date: '2024-01-02', value: 200 }
        ],
        seriesId: 'FREE_GOLD_USD',
        dateRange: { from: '2024-01-01', to: '2024-01-02' }
      });

      expect(createElement).toHaveBeenCalledWith('a');
      expect(anchor.download).toContain('FREE_GOLD_USD');
      expect(click).toHaveBeenCalled();
      expect(createObjectURL).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
      expect(append).toHaveBeenCalledWith(anchor);
      expect(remove).toHaveBeenCalledWith(anchor);

      const blobArg = createObjectURL.mock.calls[0]![0] as Blob;
      expect(blobArg.type).toContain('csv');
    } finally {
      createElement.mockRestore();
      append.mockRestore();
      remove.mockRestore();
    }
  });
});
