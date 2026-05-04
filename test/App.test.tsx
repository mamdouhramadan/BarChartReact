import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { LanguageProvider } from '../src/providers/LanguageProvider';
import i18nApp from '../src/i18n';
import { resetFreeGoldApiCache } from '../src/api/freeGoldApi';
import useGoldStore, { DEFAULT_GOLD_SERIES_ID } from '../src/store/useGoldStore';

vi.mock('../src/components/GoldCharts', () => ({
  default: function GoldChartsMock() {
    return <div data-testid="gold-charts-mock" />;
  }
}));

const samplePayload = [
  { date: '2024-01-01', price: 2000 },
  { date: '2024-06-30', price: 2100 }
];

function mockFetchSuccess() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(samplePayload)
    } as Response)
  );
}

function resetAppState() {
  resetFreeGoldApiCache();
  useGoldStore.setState({
    observations: [],
    dateRange: { from: '', to: '' },
    seriesId: DEFAULT_GOLD_SERIES_ID,
    isLoading: false,
    error: ''
  });
}

function renderApp() {
  return render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}

describe('App', () => {
  beforeEach(async () => {
    resetAppState();
    await i18nApp.changeLanguage('en');
    mockFetchSuccess();
  });

  afterEach(() => {
    resetAppState();
    vi.unstubAllGlobals();
  });

  it('renders the dashboard after gold data loads', async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load gold series/i })).toBeInTheDocument();
    });
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.getByTestId('gold-charts-mock')).toBeInTheDocument();
  });

  it('shows the network issue page when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    renderApp();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /network or access issue/i })).toBeInTheDocument();
    });
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /^try again$/i })).toBeInTheDocument();
  });

  it('returns to the dashboard after retry succeeds', async () => {
    let calls = 0;
    vi.stubGlobal('fetch', () => {
      calls += 1;
      if (calls === 1) {
        return Promise.reject(new TypeError('Failed to fetch'));
      }
      return Promise.resolve({
        ok: true,
        text: async () => JSON.stringify(samplePayload)
      } as Response);
    });

    renderApp();

    const retry = await screen.findByRole('button', { name: /^try again$/i });
    fireEvent.click(retry);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load gold series/i })).toBeInTheDocument();
    });
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: /network or access issue/i })).not.toBeInTheDocument();
  });
});
