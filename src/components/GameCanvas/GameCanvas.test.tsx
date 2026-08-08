import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCanvas } from './GameCanvas';

const start = vi.fn().mockResolvedValue(undefined);
const destroy = vi.fn();
const applyAudioSettings = vi.fn();

vi.mock('@/services/engine/GameEngine', () => ({
  GameEngine: vi.fn().mockImplementation(() => ({
    start,
    destroy,
    applyAudioSettings,
  })),
}));

describe('GameCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mounts an accessible canvas host and starts the engine', async () => {
    const { GameEngine } = await import('@/services/engine/GameEngine');
    render(<GameCanvas stageNumber={1} />);

    expect(screen.getByRole('img', { name: /battle city game canvas/i })).toBeInTheDocument();
    expect(GameEngine).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
  });

  it('destroys the engine on unmount', async () => {
    const { unmount } = render(<GameCanvas />);
    unmount();

    expect(destroy).toHaveBeenCalled();
  });
});
