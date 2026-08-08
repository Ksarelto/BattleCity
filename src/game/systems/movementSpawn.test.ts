import { describe, it, expect } from 'vitest';
import { createGameWorld } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import { tryMoveTank } from '@/game/systems/collisionSystem';
import { updateMovementSystem } from '@/game/systems/movementSystem';

describe('movement from level 1 spawn', () => {
  it('player can move horizontally from default spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    const player = world.players[0]!;
    const startX = player.position.x;

    updateMovementSystem(world, [{ playerId: player.id, direction: 'left' }]);
    expect(player.position.x).toBeLessThan(startX);
  });

  it('tryMoveTank allows horizontal movement from spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    const tank = world.players[0]!;

    expect(tryMoveTank(world, tank, 'left', 2.5)).toBe(true);
    expect(tryMoveTank(world, tank, 'right', 2.5)).toBe(true);
  });
});
