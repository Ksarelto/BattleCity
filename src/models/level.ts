import type { EnemyType } from '@/enums/enemy';
import type { TileId } from '@/enums/tile';
import type { Vec2 } from '@/models/vec';

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
