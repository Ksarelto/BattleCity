import { describe, it, expect } from 'vitest';
import { createTileCell } from '@/services/engine/createWorld';
import { brickIntact, countBrickQuadrants } from '@/utils/brick';
import { createDefaultBrick } from '@/utils/brick';
import { damageBrickTile, damageSteelTile } from '@/services/tile/TileDamageService';

describe('TileDamageService', () => {
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

  it('requires 2 steel hits to destroy', () => {
    const cell = createTileCell('steel');
    expect(damageSteelTile(cell)).toBe(false);
    expect(damageSteelTile(cell)).toBe(true);
    expect(cell.id).toBe('empty');
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
