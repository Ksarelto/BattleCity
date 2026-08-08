import { describe, it, expect } from 'vitest';
import { createGameWorld } from '@/services/engine/createWorld';
import { nextId } from '@/utils/ids';
import { createLevel } from '@/services/level/LevelService';
import { damageEnemy } from '@/services/combat/CombatService';
import { updateSpawnSystem } from '@/services/spawn/SpawnService';
import { MAX_ACTIVE_ENEMIES, TILE_SIZE } from '@/utils/constants';
import type { TankEntity } from '@/models';

function makeEnemy(overrides: Partial<TankEntity> = {}): TankEntity {
  return {
    id: nextId('enemy'),
    team: 'enemy',
    enemyType: 'basic',
    hp: 1,
    maxHp: 1,
    starLevel: 0,
    direction: 'down',
    position: { x: 0, y: 0 },
    speed: 2,
    moving: false,
    invincibleUntil: 0,
    frozen: false,
    stunnedUntil: 0,
    fireCooldown: 0,
    activeBullets: 0,
    isFlashing: false,
    spawnAnimRemaining: 0,
    aiDirectionTimer: 0,
    aiStuckTimer: 0,
    ...overrides,
  };
}

describe('spawnSystem integration', () => {
  it('spawns up to max active enemies', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.rng = () => 0.5;

    for (let i = 0; i < 500; i++) {
      updateSpawnSystem(world);
      for (const e of world.enemies) {
        // Clear spawn cells so the next interval can use free points.
        e.position = { x: 32 + world.enemies.indexOf(e) * 48, y: 64 };
        e.spawnAnimRemaining = 0;
      }
    }

    expect(world.enemies.length).toBe(MAX_ACTIVE_ENEMIES);
    expect(world.enemySpawnIndex).toBe(MAX_ACTIVE_ENEMIES);
  });

  it('marks flashing tank at 4th spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.enemyQueue = Array(20).fill('basic') as typeof world.enemyQueue;
    world.enemies = [];
    world.enemySpawnIndex = 0;
    world.spawnCooldown = 0;
    world.rng = () => 0;

    while (world.enemySpawnIndex < 4) {
      updateSpawnSystem(world);
      for (const e of world.enemies) {
        e.position = { x: TILE_SIZE + world.enemies.indexOf(e) * (TILE_SIZE * 2), y: TILE_SIZE * 3 };
        e.spawnAnimRemaining = 0;
      }
      world.spawnCooldown = 0;
    }
    expect(world.enemies.some((e) => e.isFlashing)).toBe(true);
  });

  it('does not stack two enemies on the same spawn point', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.spawnCooldown = 0;
    world.spawnPoints = [{ col: 6, row: 0 }]; // only one spawn
    world.rng = () => 0;

    updateSpawnSystem(world);
    expect(world.enemies).toHaveLength(1);
    const firstPos = { ...world.enemies[0]!.position };

    world.spawnCooldown = 0;
    updateSpawnSystem(world);
    expect(world.enemies).toHaveLength(1); // still occupied

    world.enemies[0]!.position = { x: 48, y: 48 };
    world.enemies[0]!.spawnAnimRemaining = 0;
    world.spawnCooldown = 0;
    updateSpawnSystem(world);
    expect(world.enemies).toHaveLength(2);
    expect(world.enemies[1]!.position).toEqual(firstPos);
  });

  it('reduces armor hp without removing until zero', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.enemyQueue = [];
    const enemy = makeEnemy({ enemyType: 'armor', hp: 4, maxHp: 4, isFlashing: false });
    world.enemies = [enemy];
    const ownerId = world.players[0]!.id;

    damageEnemy(world, enemy, { ownerId });
    expect(enemy.hp).toBe(3);
    expect(world.enemies).toHaveLength(1);

    damageEnemy(world, enemy, { ownerId });
    damageEnemy(world, enemy, { ownerId });
    damageEnemy(world, enemy, { ownerId });
    expect(world.enemies).toHaveLength(0);
    expect(world.enemiesKilled).toBe(1);
  });
});
