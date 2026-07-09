import { describe, it, expect } from 'vitest';
import { createGameWorld, nextId } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import { damageEnemy, updateSpawnSystem } from '@/game/systems/spawnSystem';
import { MAX_ACTIVE_ENEMIES } from '@/game/core/constants';
import type { TankEntity } from '@/types/game';

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

    for (let i = 0; i < 10; i++) {
      updateSpawnSystem(world);
    }

    expect(world.enemies.length).toBeLessThanOrEqual(MAX_ACTIVE_ENEMIES);
    expect(world.enemySpawnIndex).toBeLessThanOrEqual(20);
  });

  it('marks flashing tank at 4th spawn', () => {
    const world = createGameWorld(createLevel(1));
    world.phase = 'playing';
    world.enemyQueue = Array(20).fill('basic') as typeof world.enemyQueue;
    world.enemies = [];
    world.enemySpawnIndex = 0;
    world.rng = () => 0;

    while (world.enemySpawnIndex < 4) {
      updateSpawnSystem(world);
    }
    expect(world.enemies.some((e) => e.isFlashing)).toBe(true);
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
