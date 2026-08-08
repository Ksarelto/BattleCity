import type { Difficulty } from '@/enums/difficulty';
import type { Direction } from '@/enums/direction';
import type { EnemyType } from '@/enums/enemy';
import type { GamePhase } from '@/enums/phase';
import type { TileId } from '@/enums/tile';
import type { ActiveEffect, BulletEntity, ExplosionEntity, PowerUpEntity, TankEntity } from '@/models/entities';
import type { LevelData } from '@/models/level';
import type { TileCell } from '@/models/tile';
import type { Vec2 } from '@/models/vec';

export interface GameWorld {
  tick: number;
  phase: GamePhase;
  level: LevelData;
  stageNumber: number;
  loopCount: number;
  grid: TileCell[][];
  overlayGrid: TileId[][];
  baseIntact: boolean;
  basePosition: Vec2;
  fortifiedUntil: number;
  originalBaseWalls: Array<{ col: number; row: number; cell: TileCell }>;
  players: TankEntity[];
  enemies: TankEntity[];
  bullets: BulletEntity[];
  powerUps: PowerUpEntity[];
  explosions: ExplosionEntity[];
  effects: ActiveEffect[];
  enemyQueue: EnemyType[];
  enemySpawnIndex: number;
  enemiesRemaining: number;
  enemiesKilled: number;
  grenadeKills: number;
  score: number;
  lives: number;
  extraLifeAwarded: boolean;
  playerKills: [number, number];
  spawnPoints: Vec2[];
  spawnCooldown: number;
  activePowerUp: PowerUpEntity | null;
  stageClearTimer: number;
  countdownTimer: number;
  difficulty: Difficulty;
  twoPlayer: boolean;
  rng: () => number;
  /** Per-tank ice slide residual after releasing movement. */
  iceSlideState: Record<string, { direction: Direction; remaining: number }>;
}

export interface HudSnapshot {
  score: number;
  lives: number;
  enemiesRemaining: number;
  stageNumber: number;
  phase: GamePhase;
  playerKills: [number, number];
  starLevels: [number, number];
  effects: ActiveEffect[];
}

export interface GameSettings {
  difficulty: Difficulty;
  sfxVolume: number;
  musicVolume: number;
  muted: boolean;
}
