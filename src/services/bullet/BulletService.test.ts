import { describe, it, expect } from 'vitest';
import { Direction, GamePhase, TileId } from '@/enums';
import { createGameWorld, createTileCell } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';
import { updateBulletSystem } from '@/services/bullet/BulletService';
import { updateMovementSystem } from '@/services/movement/MovementService';
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from '@/utils/constants';

function playingWorld() {
  const world = createGameWorld(createLevel(1));
  world.phase = GamePhase.playing;
  world.players = [world.players[0]!];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      world.grid[r]![c] = createTileCell(TileId.empty);
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
    player.direction = Direction.up;

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
    world.grid[3]![4] = createTileCell(TileId.brick);
    world.bullets.push({
      id: 'b1',
      ownerId: world.players[0]!.id,
      team: 'player1',
      direction: Direction.up,
      position: { x: 4 * TILE_SIZE + 4, y: 3 * TILE_SIZE + 4 },
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
      position: { x: base.col * TILE_SIZE + 4, y: base.row * TILE_SIZE + 4 },
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
    player.position = { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE };
    const startX = player.position.x;
    updateMovementSystem(world, [{ playerId: player.id, direction: Direction.right }]);
    expect(player.position.x).toBeGreaterThan(startX);
  });

  it('does not move stunned player', () => {
    const world = playingWorld();
    const player = world.players[0]!;
    player.position = { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE };
    player.stunnedUntil = world.tick + 100;
    updateMovementSystem(world, [{ playerId: player.id, direction: Direction.right }]);
    expect(player.position.x).toBe(2 * TILE_SIZE);
  });
});
