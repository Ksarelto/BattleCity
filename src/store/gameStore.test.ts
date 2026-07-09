import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      hud: {
        score: 0,
        lives: 3,
        enemiesRemaining: 20,
        stageNumber: 1,
        phase: 'countdown',
        playerKills: [0, 0],
        starLevels: [0, 0],
        effects: [],
      },
      highScores: [],
    });
  });

  it('updates hud snapshot', () => {
    useGameStore.getState().setHud({
      score: 500,
      lives: 2,
      enemiesRemaining: 10,
      stageNumber: 3,
      phase: 'playing',
      playerKills: [5, 2],
      starLevels: [1, 0],
      effects: [],
    });
    expect(useGameStore.getState().hud.score).toBe(500);
  });

  it('merges settings partial updates', () => {
    useGameStore.getState().updateSettings({ muted: true });
    expect(useGameStore.getState().settings.muted).toBe(true);
    expect(useGameStore.getState().settings.difficulty).toBe('normal');
  });

  it('tracks top 10 high scores sorted by score', () => {
    const { addHighScore } = useGameStore.getState();
    addHighScore({ name: 'A', score: 1000, stage: 1 });
    addHighScore({ name: 'B', score: 5000, stage: 5 });
    addHighScore({ name: 'C', score: 3000, stage: 3 });
    const scores = useGameStore.getState().highScores;
    expect(scores[0]!.score).toBe(5000);
    expect(scores).toHaveLength(3);
  });
});
