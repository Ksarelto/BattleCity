import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HighScoresScreen } from './HighScoresScreen';
import { useGameStore } from '@/store/gameStore';

function renderHighScores() {
  return render(
    <MemoryRouter>
      <HighScoresScreen />
    </MemoryRouter>,
  );
}

describe('HighScoresScreen', () => {
  beforeEach(() => {
    useGameStore.setState({ highScores: [] });
  });

  it('shows empty state when there are no scores', () => {
    renderHighScores();

    expect(screen.getByRole('heading', { name: /high scores/i })).toBeInTheDocument();
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/');
  });

  it('lists saved high scores', () => {
    useGameStore.setState({
      highScores: [
        { name: 'ACE', score: 12000, stage: 5, date: '2026-01-01' },
        { name: 'BOB', score: 8000, stage: 3, date: '2026-01-02' },
      ],
    });

    renderHighScores();

    expect(screen.getByText('ACE')).toBeInTheDocument();
    expect(screen.getByText('12000')).toBeInTheDocument();
    expect(screen.getByText('BOB')).toBeInTheDocument();
    expect(screen.queryByText(/no scores yet/i)).not.toBeInTheDocument();
  });
});
