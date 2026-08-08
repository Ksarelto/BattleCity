import { describe, expect, it } from 'vitest';
import { checkStageClear, damageEnemy } from '@/services/combat/CombatService';
import { killPlayer } from '@/services/combat/PlayerLifecycleService';
import { shouldEnemyFire } from '@/services/combat/EnemyFireService';
import { emptyGridWorld, makeEnemy } from '@/utils/test/fixtures';
import { TILE_SIZE } from '@/utils/constants';

describe('CombatService', () => {
  it('triggers stage clear when no enemies left', () => {
    const world = emptyGridWorld();
    world.enemyQueue = [];
    world.enemies = [];
    checkStageClear(world);
    expect(world.phase).toBe('stageClear');
  });

  it('damages and removes enemy on last hit', () => {
    const world = emptyGridWorld();
    const enemy = makeEnemy({
      id: 'e1',
      position: { x: 32, y: 32 },
      enemyType: 'basic',
      hp: 1,
    });
    world.enemies = [enemy];
    const score = world.score;
    damageEnemy(world, enemy, { ownerId: world.players[0]!.id });
    expect(world.enemies).toHaveLength(0);
    expect(world.score).toBeGreaterThan(score);
  });
});

describe('PlayerLifecycleService', () => {
  it('reduces lives and respawns with invincibility', () => {
    const world = emptyGridWorld();
    const player = world.players[0]!;
    player.invincibleUntil = 0;
    player.spawnAnimRemaining = 0;
    const lives = world.lives;
    killPlayer(world, player);
    expect(world.lives).toBe(lives - 1);
    expect(player.invincibleUntil).toBeGreaterThan(world.tick);
    expect(world.phase).toBe('playing');
  });

  it('sets gameOver when lives reach zero', () => {
    const world = emptyGridWorld();
    world.lives = 1;
    const player = world.players[0]!;
    player.invincibleUntil = 0;
    player.spawnAnimRemaining = 0;
    killPlayer(world, player);
    expect(world.phase).toBe('gameOver');
  });
});

describe('EnemyFireService', () => {
  it('fires when aligned with base downward', () => {
    const world = emptyGridWorld();
    world.rng = () => 0;
    const baseCenterX = world.basePosition.col * TILE_SIZE + TILE_SIZE;
    const enemy = makeEnemy({
      id: 'e1',
      position: { x: baseCenterX - TILE_SIZE / 2, y: 0 },
      direction: 'down',
      enemyType: 'basic',
    });
    expect(shouldEnemyFire(world, enemy)).toBe(true);
  });

  it('skips fire when rng blocks chance', () => {
    const world = emptyGridWorld();
    world.rng = () => 0.99;
    const enemy = makeEnemy({
      id: 'e1',
      position: { x: 0, y: 0 },
      direction: 'down',
    });
    expect(shouldEnemyFire(world, enemy)).toBe(false);
  });
});
