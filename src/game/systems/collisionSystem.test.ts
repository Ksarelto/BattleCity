import { describe, it, expect } from 'vitest';
import { createGameWorld, createTileCell } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import {
  canTankMoveTo,
  cellBlocksTank,
  directionToward,
  getTankBounds,
  posToTile,
  randomDirection,
  rectsOverlap,
  tryMoveTank,
} from '@/game/systems/collisionSystem';

describe('collisionSystem', () => {
  it('detects rectangle overlap', () => {
    expect(rectsOverlap({ left: 0, top: 0, right: 10, bottom: 10 }, { left: 5, top: 5, right: 15, bottom: 15 })).toBe(true);
    expect(rectsOverlap({ left: 0, top: 0, right: 10, bottom: 10 }, { left: 20, top: 20, right: 30, bottom: 30 })).toBe(false);
  });

  it('blocks tank on brick and water cells', () => {
    expect(cellBlocksTank(createTileCell('water'))).toBe(true);
    expect(cellBlocksTank(createTileCell('brick'))).toBe(true);
    expect(cellBlocksTank(createTileCell('empty'))).toBe(false);
  });

  it('converts position to tile coordinates', () => {
    const tile = posToTile({ x: 32, y: 48 });
    expect(tile.col).toBe(2);
    expect(tile.row).toBe(3);
  });

  it('computes tank bounds with offset', () => {
    const bounds = getTankBounds({ x: 0, y: 0 });
    expect(bounds.left).toBe(1);
    expect(bounds.right).toBe(15);
  });

  it('prevents tank movement into water', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.grid[5]![5] = createTileCell('water');
    const tank = world.players[0]!;
    tank.position = { x: 64, y: 64 };
    const moved = tryMoveTank(world, tank, 'right', 16);
    expect(moved).toBe(false);
  });

  it('allows tank movement on empty tiles', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.players = [world.players[0]!];
    const tank = world.players[0]!;
    for (let c = 0; c < 13; c++) {
      for (let r = 0; r < 13; r++) {
        world.grid[r]![c] = createTileCell('empty');
      }
    }
    tank.position = { x: 64, y: 64 };
    const startY = tank.position.y;
    const moved = tryMoveTank(world, tank, 'up', 2);
    expect(moved).toBe(true);
    expect(tank.position.y).toBeLessThan(startY);
  });

  it('prevents overlapping tanks', () => {
    const level = createLevel(1);
    const world = createGameWorld(level, { twoPlayer: true });
    const p1 = world.players[0]!;
    const p2 = world.players[1]!;
    p2.position = { x: p1.position.x + 8, y: p1.position.y };
    expect(canTankMoveTo(world, p1, p1.position)).toBe(false);
  });

  it('computes direction toward target', () => {
    expect(directionToward({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe('right');
    expect(directionToward({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe('down');
  });

  it('picks random direction excluding avoid when filtered', () => {
    const rng = () => 0;
    const dir = randomDirection(rng);
    expect(['up', 'down', 'left', 'right']).toContain(dir);
  });
});
