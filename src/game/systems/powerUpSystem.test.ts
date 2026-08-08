import { describe, it, expect } from 'vitest';
import { createGameWorld, nextId } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import { collectPowerUp, spawnPowerUp, updateTimerEffect } from '@/game/systems/powerUpSystem';
import { ENEMY_CONFIG } from '@/game/core/constants';
import type { TankEntity } from '@/types/game';

function makeWorld() {
  const world = createGameWorld(createLevel(1));
  world.phase = 'playing';
  return world;
}

describe('powerUpSystem', () => {
  it('spawns power-up at valid position', () => {
    const world = makeWorld();
    world.rng = () => 0;
    spawnPowerUp(world);
    expect(world.powerUps).toHaveLength(1);
    expect(world.activePowerUp).not.toBeNull();
  });

  it('star increases player tier up to 3', () => {
    const world = makeWorld();
    const player = world.players[0]!;
    collectPowerUp(world, player, 'star');
    expect(player.starLevel).toBe(1);
    collectPowerUp(world, player, 'star');
    collectPowerUp(world, player, 'star');
    expect(player.starLevel).toBe(3);
    collectPowerUp(world, player, 'star');
    expect(player.starLevel).toBe(3);
  });

  it('tank power-up adds a life', () => {
    const world = makeWorld();
    const lives = world.lives;
    collectPowerUp(world, world.players[0]!, 'tank');
    expect(world.lives).toBe(lives + 1);
  });

  it('timer freezes enemies', () => {
    const world = makeWorld();
    const enemy: TankEntity = {
      id: nextId('enemy'),
      team: 'enemy',
      enemyType: 'basic',
      hp: 1,
      maxHp: 1,
      starLevel: 0,
      direction: 'down',
      position: { x: 0, y: 0 },
      speed: ENEMY_CONFIG.basic.moveSpeed,
      moving: true,
      invincibleUntil: 0,
      frozen: false,
      stunnedUntil: 0,
      fireCooldown: 0,
      activeBullets: 0,
      isFlashing: false,
      spawnAnimRemaining: 0,
      aiDirectionTimer: 0,
      aiStuckTimer: 0,
    };
    world.enemies.push(enemy);
    collectPowerUp(world, world.players[0]!, 'timer');
    expect(enemy.frozen).toBe(true);
    world.effects = [];
    updateTimerEffect(world);
    expect(enemy.frozen).toBe(false);
  });

  it('grenade clears enemies and triggers stage clear', () => {
    const world = makeWorld();
    world.enemyQueue = [];
    world.enemies.push({
      id: nextId('enemy'),
      team: 'enemy',
      enemyType: 'basic',
      hp: 1,
      maxHp: 1,
      starLevel: 0,
      direction: 'down',
      position: { x: 0, y: 0 },
      speed: 1,
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
    });
    collectPowerUp(world, world.players[0]!, 'grenade');
    expect(world.enemies).toHaveLength(0);
    expect(world.grenadeKills).toBe(1);
    expect(world.phase).toBe('stageClear');
  });

  it('awards extra life once at 20000 score', () => {
    const world = makeWorld();
    world.score = 19500;
    world.lives = 3;
    collectPowerUp(world, world.players[0]!, 'star');
    expect(world.score).toBe(20000);
    expect(world.lives).toBe(4);
    expect(world.extraLifeAwarded).toBe(true);
    collectPowerUp(world, world.players[0]!, 'star');
    expect(world.lives).toBe(4);
  });

  it('helmet grants invincibility', () => {
    const world = makeWorld();
    const player = world.players[0]!;
    collectPowerUp(world, player, 'helmet');
    expect(player.invincibleUntil).toBeGreaterThan(world.tick);
    expect(world.effects.some((e) => e.type === 'helmet')).toBe(true);
  });
});
