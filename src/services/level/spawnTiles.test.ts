import { describe, it, expect } from 'vitest';
import { createLevel } from '@/services/level/LevelService';

describe('level spawn tiles', () => {
  it('player spawn cells are not brick', () => {
    const level = createLevel(1);
    for (const spawn of level.playerSpawns) {
      const tile = level.grid[spawn.row]![spawn.col]!;
      expect(tile, `spawn (${spawn.col},${spawn.row})`).not.toBe('brick');
    }
  });

  it('base left wall remains when P1 spawns beside it', () => {
    const level = createLevel(1);
    // Bottom-row left fortress wall beside P1 spawn
    expect(level.grid[19]![15]).toBe('brick');
    expect(level.playerSpawns[0]).toMatchObject({ col: 13, row: 19, player: 1 });
    expect(level.basePosition).toMatchObject({ col: 16, row: 18 });
  });
});
