import { describe, it, expect } from 'vitest';
import { createGameWorld } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';
import { updateSpawnSystem } from '@/services/spawn/SpawnService';
import { updateMovementSystem } from '@/services/movement/MovementService';
import { TILE_SIZE } from '@/utils/constants';

describe('enemy movement from spawn', () => {
  it('enemy can move down after spawn animation', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    world.spawnCooldown = 0;
    updateSpawnSystem(world);
    const enemy = world.enemies[0]!;
    enemy.spawnAnimRemaining = 0;
    const startY = enemy.position.y;

    updateMovementSystem(world, []);
    expect(enemy.position.y).toBeGreaterThan(startY);
  });

  it('enemy can leave the top-right spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.players = [world.players[0]!];
    world.enemies = [];
    world.spawnCooldown = 0;
    // Pick spawn index 2 (top-right) without poisoning AI rng
    let spawnRolls = 0;
    world.rng = () => {
      spawnRolls += 1;
      return spawnRolls === 1 ? 0.99 : Math.random();
    };
    updateSpawnSystem(world);
    const enemy = world.enemies[0]!;
    expect(enemy.position.x).toBe(34 * TILE_SIZE);
    enemy.spawnAnimRemaining = 0;
    const startY = enemy.position.y;

    updateMovementSystem(world, []);
    expect(enemy.position.y).toBeGreaterThan(startY);
  });

  it('spawn points are not blocked by brick', () => {
    const level = createLevel(1);
    for (const spawn of level.spawnPoints) {
      expect(level.grid[spawn.row]![spawn.col]).toBe('empty');
      expect(level.grid[spawn.row + 1]![spawn.col]).toBe('empty');
    }
  });
});
