import type { Direction } from '@/enums/direction';
import type { EnemyType } from '@/enums/enemy';
import type { PowerUpType } from '@/enums/powerUp';
import type { Team } from '@/enums/team';
import type { Position } from '@/models/vec';

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
