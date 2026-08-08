export type TileId = 'empty' | 'brick' | 'steel' | 'water' | 'ice' | 'bush';
export type EnemyType = 'basic' | 'fast' | 'power' | 'armor';
export type PowerUpType = 'grenade' | 'helmet' | 'shovel' | 'star' | 'tank' | 'timer';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Team = 'player1' | 'player2' | 'enemy';
export type GamePhase = 'playing' | 'paused' | 'stageClear' | 'gameOver' | 'countdown';
export type Difficulty = 'easy' | 'normal';

export interface Vec2 {
  col: number;
  row: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface BrickQuadrants {
  tl: boolean;
  tr: boolean;
  bl: boolean;
  br: boolean;
}

export interface TileCell {
  id: TileId;
  brick?: BrickQuadrants;
  steelHits?: number;
}

export interface LevelData {
  id: number;
  name: string;
  custom?: boolean;
  grid: TileId[][];
  enemyRoster: EnemyType[];
  spawnPoints: Vec2[];
  basePosition: Vec2;
  playerSpawns: Array<Vec2 & { player: 1 | 2 }>;
}

export interface TankEntity {
  id: string;
  team: Team;
  enemyType?: EnemyType;
  hp: number;
  maxHp: number;
  starLevel: 0 | 1 | 2 | 3;
  direction: Direction;
  position: Position;
  speed: number;
  moving: boolean;
  invincibleUntil: number;
  frozen: boolean;
  stunnedUntil: number;
  fireCooldown: number;
  activeBullets: number;
  isFlashing: boolean;
  spawnAnimRemaining: number;
  aiDirectionTimer: number;
  aiStuckTimer: number;
  kills?: number;
}

export interface BulletEntity {
  id: string;
  ownerId: string;
  team: Team;
  direction: Direction;
  position: Position;
  speed: number;
  power: number;
  active: boolean;
}

export interface PowerUpEntity {
  id: string;
  type: PowerUpType;
  position: Position;
  active: boolean;
}

export interface ExplosionEntity {
  id: string;
  position: Position;
  large: boolean;
  remaining: number;
}

export interface ActiveEffect {
  type: PowerUpType;
  remaining: number;
}

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
  activePowerUp: PowerUpEntity | null;
  stageClearTimer: number;
  countdownTimer: number;
  difficulty: Difficulty;
  twoPlayer: boolean;
  rng: () => number;
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
