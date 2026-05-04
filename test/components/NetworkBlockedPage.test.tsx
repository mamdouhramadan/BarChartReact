import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import NetworkBlockedPage from '../../src/components/NetworkBlockedPage';
import { LanguageProvider } from '../../src/providers/LanguageProvider';
import i18nApp from '../../src/i18n';

describe('NetworkBlockedPage', () => {
  beforeEach(async () => {
    await i18nApp.changeLanguage('en');
  });

  it('renders guidance and calls onRetry when the button is pressed', () => {
    const onRetry = vi.fn();

    render(
      <LanguageProvider>
        <NetworkBlockedPage onRetry={onRetry} />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { name: /network or access issue/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^try again$/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
