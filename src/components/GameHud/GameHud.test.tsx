import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameHud } from './GameHud';
import { useGameStore } from '@/store/gameStore';

describe('GameHud', () => {
  beforeEach(() => {
    useGameStore.setState({
      hud: {
        score: 1500,
        lives: 2,
        stageNumber: 3,
        enemiesRemaining: 12,
        starLevels: [1, 0],
        playerKills: [0, 0],
        effects: [],
        phase: 'playing',
      },
    });
  });

  it('shows stage score and lives from the store', () => {
    render(<GameHud />);

    expect(screen.getByText(/stage 3/i)).toBeInTheDocument();
    expect(screen.getByText(/score 1500/i)).toBeInTheDocument();
    expect(screen.getByText(/enemies 12/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('announces game over when phase changes', () => {
    useGameStore.setState((s) => ({
      hud: { ...s.hud, phase: 'gameOver' },
    }));

    render(<GameHud />);

    expect(screen.getByRole('status')).toHaveTextContent(/game over/i);
  });
});
