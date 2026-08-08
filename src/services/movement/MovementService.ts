import type { Direction, GameWorld, TankEntity } from '@/models';
import { Difficulty, Direction as Dir, EnemyType, GamePhase } from '@/enums';
import {
  AI_BASE_BIAS_CHANCE,
  AI_DIRECTION_BASE_FRAMES,
  AI_DIRECTION_RANDOM_FRAMES,
  AI_REVERSE_KEEP_CHANCE,
  AI_STUCK_THRESHOLD,
  ALL_DIRECTIONS,
  ICE_SLIDE_FRAMES,
  PLAYER_MOVE_SPEED,
  TILE_SIZE,
} from '@/utils/constants';
import { canTankStep, isOnIce, tryMoveTank } from '@/utils/collision';
import { directionToward, reverseDirection } from '@/utils/direction';

export interface MovementInput {
  playerId: string;
  direction: Direction | null;
}

export function updateMovementSystem(world: GameWorld, inputs: MovementInput[]): void {
  if (world.phase !== GamePhase.playing) return;

  for (const player of world.players) {
    const input = inputs.find((i) => i.playerId === player.id);
    if (player.stunnedUntil > world.tick) continue;
    if (player.spawnAnimRemaining > 0) continue;

    if (input?.direction) {
      delete world.iceSlideState[player.id];
      player.moving = tryMoveTank(world, player, input.direction, player.speed);
      if (!player.moving) {
        player.direction = input.direction;
      }
    } else {
      player.moving = false;
      const slide = world.iceSlideState[player.id];
      if (slide && slide.remaining > 0) {
        const moved = tryMoveTank(world, player, slide.direction, PLAYER_MOVE_SPEED);
        if (moved) {
          slide.remaining -= player.speed;
        } else {
          delete world.iceSlideState[player.id];
        }
      } else if (isOnIce(world, player) && !slide) {
        world.iceSlideState[player.id] = {
          direction: player.direction,
          remaining: ICE_SLIDE_FRAMES,
        };
      }
    }
  }

  for (const enemy of world.enemies) {
    if (enemy.frozen || enemy.spawnAnimRemaining > 0) continue;

    enemy.aiDirectionTimer -= 1;
    let retarget = false;
    if (enemy.aiDirectionTimer <= 0) {
      enemy.aiDirectionTimer =
        AI_DIRECTION_BASE_FRAMES + Math.floor(world.rng() * AI_DIRECTION_RANDOM_FRAMES);
      retarget = true;
    }

    const moved = !retarget && tryMoveTank(world, enemy, enemy.direction, enemy.speed);
    if (moved) {
      enemy.aiStuckTimer = 0;
    } else {
      enemy.aiStuckTimer += 1;
      if (retarget || enemy.aiStuckTimer > AI_STUCK_THRESHOLD) {
        enemy.direction = pickEnemyDirection(world, enemy);
        enemy.aiStuckTimer = 0;
        tryMoveTank(world, enemy, enemy.direction, enemy.speed);
      }
    }
  }
}

function pickEnemyDirection(world: GameWorld, enemy: TankEntity): Direction {
  const baseCenter = {
    x: world.basePosition.col * TILE_SIZE + TILE_SIZE,
    y: world.basePosition.row * TILE_SIZE + TILE_SIZE,
  };

  if (
    world.difficulty === Difficulty.normal &&
    enemy.enemyType === EnemyType.fast &&
    world.rng() < AI_BASE_BIAS_CHANCE
  ) {
    const toward = directionToward(enemy.position, baseCenter);
    if (canTankStep(world, enemy, toward, enemy.speed)) return toward;
  }

  const avoid = reverseDirection(enemy.direction);
  const dirs = ALL_DIRECTIONS.filter(
    (d) => world.rng() > AI_REVERSE_KEEP_CHANCE || d !== avoid,
  );

  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(world.rng() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j]!, dirs[i]!];
  }

  for (const d of dirs) {
    if (canTankStep(world, enemy, d, enemy.speed)) return d;
  }

  for (const d of ALL_DIRECTIONS) {
    if (canTankStep(world, enemy, d, enemy.speed)) return d;
  }

  return dirs[0] ?? Dir.down;
}

export function clearSlideState(world: GameWorld): void {
  world.iceSlideState = {};
}
