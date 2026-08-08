import { describe, it, expect } from 'vitest';
import { createGameWorld } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import { updateSpawnSystem } from '@/game/systems/spawnSystem';
import { updateMovementSystem } from '@/game/systems/movementSystem';

describe('enemy movement from spawn', () => {
  it('enemy can move down after spawn animation', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    updateSpawnSystem(world);
    const enemy = world.enemies[0]!;
    enemy.spawnAnimRemaining = 0;
    const startY = enemy.position.y;

    updateMovementSystem(world, []);
    expect(enemy.position.y).toBeGreaterThan(startY);
  });

  it('spawn points are not blocked by brick', () => {
    const level = createLevel(1);
    for (const spawn of level.spawnPoints) {
      expect(level.grid[spawn.row]![spawn.col]).toBe('empty');
    }
  });
});
