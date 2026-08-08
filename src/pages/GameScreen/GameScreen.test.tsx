import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GameScreen } from './GameScreen';

vi.mock('@/services/audio/MenuMusic', () => ({
  menuMusic: {
    start: vi.fn(),
    stop: vi.fn(),
    setVolume: vi.fn(),
  },
}));

vi.mock('@/components/GameCanvas', () => ({
  GameCanvas: () => <div role="img" aria-label="Battle City game canvas" />,
}));

vi.mock('@/components/TouchControls', () => ({
  TouchControls: () => <div aria-label="Touch controls" />,
}));

vi.mock('./utils/useTouchEnabled', () => ({
  useTouchEnabled: () => false,
}));

function renderGameScreen(path = '/game') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/game" element={<GameScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('GameScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hud, canvas host, and menu controls', async () => {
    const { menuMusic } = await import('@/services/audio/MenuMusic');
    renderGameScreen();

    expect(screen.getByText(/stage/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /battle city game canvas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /menu/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/touch controls/i)).not.toBeInTheDocument();
    expect(menuMusic.stop).toHaveBeenCalled();
  });
});
