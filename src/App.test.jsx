import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('portfolio navigation', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    cleanup();
    document.title = '';
  });

  it('opens a category and reflects it in the URL', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /game audio/i }));

    expect(screen.getByRole('dialog', { name: 'Game Audio' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#game-audio');
    expect(document.title).toBe('Game Audio — João Santos Audio');
  });

  it('supports a direct category URL and closes it with Escape', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/#visual-media');
    render(<App />);

    expect(screen.getByRole('dialog', { name: 'Sound Design for Visual Media' })).toBeInTheDocument();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Sound Design for Visual Media' })).not.toBeInTheDocument());
    expect(window.location.hash).toBe('');
  });

  it('opens the contact dialog and exposes the direct email option', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /get in touch/i }));

    const dialog = screen.getByRole('dialog', { name: 'Get in Touch' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email directly/i })).toHaveAttribute(
      'href',
      'mailto:Joaobessasfs@gmail.com',
    );

    await user.click(screen.getByRole('button', { name: 'Close contact form' }));
    expect(screen.queryByRole('dialog', { name: 'Get in Touch' })).not.toBeInTheDocument();
  });
});
