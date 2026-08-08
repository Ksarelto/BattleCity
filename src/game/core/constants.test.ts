import { describe, it, expect } from 'vitest';
import { createDefaultBrick, isFlashingSpawnIndex, tileBlocksTank } from '@/game/core/constants';
import { brickIntact, countBrickQuadrants, createGameWorld, createTileCell } from '@/game/core/gameWorld';
import { damageBrickTile, damageSteelTile } from '@/game/systems/tileDamageSystem';
import { buildEnemyRoster, checkStageClear } from '@/game/systems/spawnSystem';
import { createLevel, validateLevel } from '@/game/levels/levelLoader';

describe('constants', () => {
  it('identifies flashing spawn indices', () => {
    expect(isFlashingSpawnIndex(4)).toBe(true);
    expect(isFlashingSpawnIndex(11)).toBe(true);
    expect(isFlashingSpawnIndex(18)).toBe(true);
    expect(isFlashingSpawnIndex(5)).toBe(false);
  });

  it('blocks tanks on water and brick', () => {
    expect(tileBlocksTank('water')).toBe(true);
    expect(tileBlocksTank('ice')).toBe(false);
    expect(tileBlocksTank('bush')).toBe(false);
  });
});

describe('brick damage', () => {
  it('removes quadrants on hit', () => {
    const cell = createTileCell('brick');
    damageBrickTile(cell, 'up', 1);
    expect(countBrickQuadrants(cell.brick!)).toBe(3);
  });

  it('destroys tile when all quadrants gone', () => {
    const cell = createTileCell('brick');
    for (let i = 0; i < 4; i++) damageBrickTile(cell, 'up', 1);
    expect(cell.id).toBe('empty');
  });

  it('tier 3 removes 2 quadrants', () => {
    const cell = createTileCell('brick');
    damageBrickTile(cell, 'left', 2);
    expect(countBrickQuadrants(cell.brick!)).toBe(2);
  });
});

describe('steel damage', () => {
  it('requires 2 hits to destroy', () => {
    const cell = createTileCell('steel');
    expect(damageSteelTile(cell)).toBe(false);
    expect(damageSteelTile(cell)).toBe(true);
    expect(cell.id).toBe('empty');
  });
});

describe('spawn system', () => {
  it('builds roster of 20 enemies', () => {
    const roster = buildEnemyRoster({ basic: 18, fast: 2, power: 0, armor: 0 });
    expect(roster).toHaveLength(20);
  });

  it('triggers stage clear when no enemies left', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.phase = 'playing';
    world.enemyQueue = [];
    world.enemies = [];
    checkStageClear(world);
    expect(world.phase).toBe('stageClear');
  });
});

describe('level loader', () => {
  it('creates valid 13x13 levels', () => {
    for (let i = 1; i <= 35; i++) {
      const level = createLevel(i);
      expect(level.grid).toHaveLength(13);
      expect(level.grid[0]).toHaveLength(13);
      expect(level.enemyRoster).toHaveLength(20);
      expect(validateLevel(level)).toHaveLength(0);
    }
  });
});

describe('brick helpers', () => {
  it('counts intact quadrants', () => {
    const q = createDefaultBrick();
    expect(brickIntact(q)).toBe(true);
    q.tl = false;
    expect(countBrickQuadrants(q)).toBe(3);
  });
});
