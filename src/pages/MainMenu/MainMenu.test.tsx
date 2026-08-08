import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MainMenu } from './MainMenu';

vi.mock('@/services/audio/MenuMusic', () => ({
  menuMusic: {
    start: vi.fn(),
    stop: vi.fn(),
    setVolume: vi.fn(),
  },
}));

function renderMainMenu() {
  return render(
    <MemoryRouter>
      <MainMenu />
    </MemoryRouter>,
  );
}

describe('MainMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title and navigation links', () => {
    renderMainMenu();

    expect(screen.getByRole('heading', { name: /battle city/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /1 player/i })).toHaveAttribute('href', '/game');
    expect(screen.getByRole('link', { name: /2 players/i })).toHaveAttribute('href', '/game?mode=2p');
    expect(screen.getByRole('link', { name: /construction/i })).toHaveAttribute('href', '/editor');
    expect(screen.getByRole('link', { name: /options/i })).toHaveAttribute('href', '/settings');
    expect(screen.getByRole('link', { name: /high scores/i })).toHaveAttribute('href', '/scores');
  });

  it('stops menu music when starting a game', async () => {
    const user = userEvent.setup();
    const { menuMusic } = await import('@/services/audio/MenuMusic');
    renderMainMenu();

    await user.click(screen.getByRole('link', { name: /1 player/i }));

    expect(menuMusic.stop).toHaveBeenCalled();
  });
});
