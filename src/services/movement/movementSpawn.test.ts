import { describe, it, expect } from 'vitest';
import { createGameWorld } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';
import { tryMoveTank } from '@/utils/collision';
import { updateMovementSystem } from '@/services/movement/MovementService';
import { PLAYER_MOVE_SPEED, TILE_SIZE } from '@/utils/constants';

describe('movement from level 1 spawn', () => {
  it('player can move horizontally from default spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    const player = world.players[0]!;
    // Clear neighbors so the test is about spawn coords, not fortress walls
    const { col, row } = world.level.playerSpawns[0]!;
    for (const c of [col - 1, col, col + 1]) {
      if (c >= 0) world.grid[row]![c] = { id: 'empty' };
    }
    const startX = player.position.x;
    expect(startX).toBe(col * TILE_SIZE);

    updateMovementSystem(world, [{ playerId: player.id, direction: 'left' }]);
    expect(player.position.x).toBeLessThan(startX);
  });

  it('tryMoveTank allows horizontal movement from spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    const tank = world.players[0]!;
    const { col, row } = world.level.playerSpawns[0]!;
    for (const c of [col - 1, col, col + 1]) {
      if (c >= 0) world.grid[row]![c] = { id: 'empty' };
    }

    expect(tryMoveTank(world, tank, 'left', PLAYER_MOVE_SPEED)).toBe(true);
    tank.position = { x: col * TILE_SIZE, y: row * TILE_SIZE };
    expect(tryMoveTank(world, tank, 'right', PLAYER_MOVE_SPEED)).toBe(true);
  });
});
