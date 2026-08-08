import { describe, it, expect } from 'vitest';
import { createGameWorld, createTileCell } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';
import {
  canTankMoveTo,
  cellBlocksTank,
  directionToward,
  getTankBounds,
  posToTile,
  randomDirection,
  rectsOverlap,
  tryMoveTank,
} from '@/utils/collision';
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from '@/utils/constants';

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
    const tile = posToTile({ x: 2 * TILE_SIZE, y: 3 * TILE_SIZE });
    expect(tile.col).toBe(2);
    expect(tile.row).toBe(3);
  });

  it('computes tank bounds with offset', () => {
    const bounds = getTankBounds({ x: 0, y: 0 });
    expect(bounds.left).toBe(2);
    expect(bounds.right).toBe(38);
  });

  it('prevents tank movement into water', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.grid[3]![4] = createTileCell('water');
    const tank = world.players[0]!;
    tank.position = { x: 3 * TILE_SIZE, y: 3 * TILE_SIZE };
    const moved = tryMoveTank(world, tank, 'right', TILE_SIZE);
    expect(moved).toBe(false);
  });

  it('allows tank movement on empty tiles', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.players = [world.players[0]!];
    const tank = world.players[0]!;
    for (let c = 0; c < GRID_COLS; c++) {
      for (let r = 0; r < GRID_ROWS; r++) {
        world.grid[r]![c] = createTileCell('empty');
      }
    }
    tank.position = { x: 3 * TILE_SIZE, y: 3 * TILE_SIZE };
    const startY = tank.position.y;
    const moved = tryMoveTank(world, tank, 'up', 5);
    expect(moved).toBe(true);
    expect(tank.position.y).toBeLessThan(startY);
  });

  it('prevents overlapping tanks', () => {
    const level = createLevel(1);
    const world = createGameWorld(level, { twoPlayer: true });
    const p1 = world.players[0]!;
    const p2 = world.players[1]!;
    p2.position = { x: p1.position.x + 16, y: p1.position.y };
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

  it('clamps into the right-edge corridor instead of getting stuck short of it', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.players = [world.players[0]!];
    const rightLane = GRID_COLS - 1;
    const wallCol = rightLane - 1;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        world.grid[r]![c] = createTileCell(c === wallCol ? 'brick' : 'empty');
      }
    }
    // Clear a gap so the tank can approach, then leave wallCol bricked beside the lane
    world.grid[5]![wallCol] = createTileCell('empty');

    const tank = world.players[0]!;
    tank.position = { x: rightLane * TILE_SIZE - 2, y: 5 * TILE_SIZE };
    expect(tryMoveTank(world, tank, 'right', 5)).toBe(true);
    expect(tank.position.x).toBe(rightLane * TILE_SIZE);

    // Vertical travel along the open right lane
    expect(tryMoveTank(world, tank, 'down', 5)).toBe(true);
    expect(tank.position.y).toBeGreaterThan(5 * TILE_SIZE);
  });

  it('snaps into a corridor when turning beside a brick wall', () => {
    const level = createLevel(1);
    const world = createGameWorld(level);
    world.players = [world.players[0]!];
    const rightLane = GRID_COLS - 1;
    const wallCol = rightLane - 1;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        world.grid[r]![c] = createTileCell('empty');
      }
    }
    for (let r = 0; r < GRID_ROWS; r++) {
      world.grid[r]![wallCol] = createTileCell('brick');
    }

    const tank = world.players[0]!;
    // Slightly left of the lane — without snap, down would clip the wall
    tank.position = { x: rightLane * TILE_SIZE - 6, y: 4 * TILE_SIZE };
    expect(tryMoveTank(world, tank, 'down', 5)).toBe(true);
    expect(tank.position.x).toBe(rightLane * TILE_SIZE);
  });
});
