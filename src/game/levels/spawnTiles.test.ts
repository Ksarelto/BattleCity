import { describe, it, expect } from 'vitest';
import { createLevel } from '@/game/levels/levelLoader';

describe('level spawn tiles', () => {
  it('player spawn cells are not brick', () => {
    const level = createLevel(1);
    for (const spawn of level.playerSpawns) {
      const tile = level.grid[spawn.row]![spawn.col]!;
      expect(tile, `spawn (${spawn.col},${spawn.row})`).not.toBe('brick');
    }
  });
});
