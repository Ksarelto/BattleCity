import type { Direction, GameWorld, TankEntity } from '@/types/game';
import { PLAYER_MOVE_SPEED } from '@/game/core/constants';
import { isOnIce, tryMoveTank } from '@/game/systems/collisionSystem';

export interface MovementInput {
  playerId: string;
  direction: Direction | null;
}

const slideState = new Map<string, { direction: Direction; remaining: number }>();

export function updateMovementSystem(world: GameWorld, inputs: MovementInput[]): void {
  if (world.phase !== 'playing') return;

  for (const player of world.players) {
    const input = inputs.find((i) => i.playerId === player.id);
    if (player.stunnedUntil > world.tick) continue;
    if (player.spawnAnimRemaining > 0) continue;

    if (input?.direction) {
      slideState.delete(player.id);
      player.moving = tryMoveTank(world, player, input.direction, player.speed);
      if (!player.moving) {
        player.direction = input.direction;
      }
    } else {
      player.moving = false;
      const slide = slideState.get(player.id);
      if (slide && slide.remaining > 0) {
        const moved = tryMoveTank(world, player, slide.direction, PLAYER_MOVE_SPEED);
        if (moved) {
          slide.remaining -= player.speed;
        } else {
          slideState.delete(player.id);
        }
      } else if (isOnIce(world, player) && !slide) {
        slideState.set(player.id, { direction: player.direction, remaining: 16 });
      }
    }
  }

  for (const enemy of world.enemies) {
    if (enemy.frozen || enemy.spawnAnimRemaining > 0) continue;

    enemy.aiDirectionTimer -= 1;
    if (enemy.aiDirectionTimer <= 0) {
      enemy.aiDirectionTimer = 60 + Math.floor(world.rng() * 60);
    }

    const moved = tryMoveTank(world, enemy, enemy.direction, enemy.speed);
    if (moved) {
      enemy.aiStuckTimer = 0;
    } else {
      enemy.aiStuckTimer += 1;
      if (enemy.aiStuckTimer > 90) {
        enemy.direction = pickEnemyDirection(world, enemy);
        enemy.aiStuckTimer = 0;
      }
    }
  }
}

function pickEnemyDirection(world: GameWorld, enemy: TankEntity): Direction {
  const dirs: Direction[] = ['up', 'down', 'left', 'right'];
  const baseCenter = {
    x: world.basePosition.col * 16 + 16,
    y: world.basePosition.row * 16 + 16,
  };

  if (world.difficulty === 'normal' && enemy.enemyType === 'fast' && world.rng() < 0.6) {
    return directionFromTo(enemy.position, baseCenter);
  }

  const avoid = enemy.direction;
  const filtered = dirs.filter((d) => world.rng() > 0.3 || d !== reverseDir(avoid));
  return filtered[Math.floor(world.rng() * filtered.length)] ?? 'down';
}

function directionFromTo(from: { x: number; y: number }, to: { x: number; y: number }): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}

function reverseDir(d: Direction): Direction {
  const map: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
  return map[d];
}

export function clearSlideState(): void {
  slideState.clear();
}
