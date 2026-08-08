import { describe, it, expect } from 'vitest';
import { createGameWorld, createTileCell } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import { updateBulletSystem } from '@/game/systems/bulletSystem';
import { updateMovementSystem } from '@/game/systems/movementSystem';

function playingWorld() {
  const world = createGameWorld(createLevel(1));
  world.phase = 'playing';
  world.players = [world.players[0]!];
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      world.grid[r]![c] = createTileCell('empty');
    }
  }
  return world;
}

describe('bulletSystem', () => {
  it('spawns bullet when player fires', () => {
    const world = playingWorld();
    const player = world.players[0]!;
    player.fireCooldown = 0;
    player.activeBullets = 0;
    player.spawnAnimRemaining = 0;
    player.direction = 'up';

    updateBulletSystem(world, [{ playerId: player.id, fire: true }]);
    expect(world.bullets).toHaveLength(1);
    expect(player.activeBullets).toBe(1);
    expect(player.fireCooldown).toBeGreaterThan(0);
  });

  it('does not fire during spawn animation', () => {
    const world = playingWorld();
    const player = world.players[0]!;
    player.spawnAnimRemaining = 30;
    updateBulletSystem(world, [{ playerId: player.id, fire: true }]);
    expect(world.bullets).toHaveLength(0);
  });

  it('destroys bullet on brick hit', () => {
    const world = playingWorld();
    world.grid[3]![4] = createTileCell('brick');
    world.bullets.push({
      id: 'b1',
      ownerId: world.players[0]!.id,
      team: 'player1',
      direction: 'up',
      position: { x: 68, y: 52 },
      speed: 0,
      power: 0,
      active: true,
    });
    updateBulletSystem(world, []);
    expect(world.bullets).toHaveLength(0);
  });

  it('cancels colliding bullets', () => {
    const world = playingWorld();
    world.bullets.push(
      {
        id: 'b1',
        ownerId: 'e1',
        team: 'enemy',
        direction: 'down',
        position: { x: 50, y: 50 },
        speed: 0,
        power: 0,
        active: true,
      },
      {
        id: 'b2',
        ownerId: 'p1',
        team: 'player1',
        direction: 'up',
        position: { x: 52, y: 52 },
        speed: 0,
        power: 0,
        active: true,
      },
    );
    updateBulletSystem(world, []);
    expect(world.bullets).toHaveLength(0);
  });

  it('game over when base is hit', () => {
    const world = playingWorld();
    const base = world.basePosition;
    world.bullets.push({
      id: 'b1',
      ownerId: 'e1',
      team: 'enemy',
      direction: 'down',
      position: { x: base.col * 16 + 4, y: base.row * 16 + 4 },
      speed: 0,
      power: 0,
      active: true,
    });
    updateBulletSystem(world, []);
    expect(world.baseIntact).toBe(false);
    expect(world.phase).toBe('gameOver');
  });
});

describe('movementSystem', () => {
  it('moves player in input direction', () => {
    const world = playingWorld();
    const player = world.players[0]!;
    player.position = { x: 64, y: 64 };
    const startX = player.position.x;
    updateMovementSystem(world, [{ playerId: player.id, direction: 'right' }]);
    expect(player.position.x).toBeGreaterThan(startX);
  });

  it('does not move stunned player', () => {
    const world = playingWorld();
    const player = world.players[0]!;
    player.position = { x: 64, y: 64 };
    player.stunnedUntil = world.tick + 100;
    updateMovementSystem(world, [{ playerId: player.id, direction: 'right' }]);
    expect(player.position.x).toBe(64);
  });
});
