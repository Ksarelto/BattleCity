import type {
  BrickQuadrants,
  GameWorld,
  LevelData,
  TankEntity,
  TileCell,
  TileId,
} from '@/types/game';
import {
  ENEMIES_PER_STAGE,
  PLAYER_MOVE_SPEED,
  SPAWN_INVINCIBILITY_FRAMES,
  createDefaultBrick,
} from '@/game/core/constants';
import { Rng } from '@/game/core/rng';

let idCounter = 0;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function resetIdCounter(): void {
  idCounter = 0;
}

export function createTileCell(id: TileId): TileCell {
  if (id === 'brick') {
    return { id, brick: createDefaultBrick() };
  }
  if (id === 'steel') {
    return { id, steelHits: 0 };
  }
  return { id };
}

export function cloneTileCell(cell: TileCell): TileCell {
  if (cell.brick) {
    return { id: cell.id, brick: { ...cell.brick } };
  }
  if (cell.steelHits !== undefined) {
    return { id: cell.id, steelHits: cell.steelHits };
  }
  return { id: cell.id };
}

export function createPlayer(
  player: 1 | 2,
  spawn: { col: number; row: number },
  tick: number,
): TankEntity {
  return {
    id: nextId(`p${player}`),
    team: player === 1 ? 'player1' : 'player2',
    hp: 1,
    maxHp: 1,
    starLevel: 0,
    direction: 'up',
    position: { x: spawn.col * 16, y: spawn.row * 16 },
    speed: PLAYER_MOVE_SPEED,
    moving: false,
    invincibleUntil: tick + SPAWN_INVINCIBILITY_FRAMES,
    frozen: false,
    stunnedUntil: 0,
    fireCooldown: 0,
    activeBullets: 0,
    isFlashing: false,
    spawnAnimRemaining: 0,
    aiDirectionTimer: 0,
    aiStuckTimer: 0,
    kills: 0,
  };
}

export function createGameWorld(
  level: LevelData,
  options: {
    stageNumber?: number;
    loopCount?: number;
    lives?: number;
    score?: number;
    extraLifeAwarded?: boolean;
    twoPlayer?: boolean;
    difficulty?: 'easy' | 'normal';
    rng?: Rng;
  } = {},
): GameWorld {
  const rng = options.rng ?? new Rng();
  const grid: TileCell[][] = level.grid.map((row) =>
    row.map((id) => createTileCell(id)),
  );
  const overlayGrid: TileId[][] = level.grid.map((row) =>
    row.map((id) => (id === 'bush' ? 'bush' : 'empty')),
  );
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r]!.length; c++) {
      if (grid[r]![c]!.id === 'bush') {
        grid[r]![c] = { id: 'empty' };
      }
    }
  }

  for (const spawn of level.playerSpawns) {
    grid[spawn.row]![spawn.col] = createTileCell('empty');
  }
  for (const spawn of level.spawnPoints) {
    grid[spawn.row]![spawn.col] = createTileCell('empty');
  }

  const tick = 0;
  const players = level.playerSpawns.map((s) => createPlayer(s.player, s, tick));

  return {
    tick,
    phase: 'countdown',
    level,
    stageNumber: options.stageNumber ?? level.id,
    loopCount: options.loopCount ?? 0,
    grid,
    overlayGrid,
    baseIntact: true,
    basePosition: level.basePosition,
    fortifiedUntil: 0,
    originalBaseWalls: [],
    players,
    enemies: [],
    bullets: [],
    powerUps: [],
    explosions: [],
    effects: [],
    enemyQueue: [...level.enemyRoster],
    enemySpawnIndex: 0,
    enemiesRemaining: ENEMIES_PER_STAGE,
    enemiesKilled: 0,
    grenadeKills: 0,
    score: options.score ?? 0,
    lives: options.lives ?? 3,
    extraLifeAwarded: options.extraLifeAwarded ?? false,
    playerKills: [0, 0],
    spawnPoints: level.spawnPoints,
    activePowerUp: null,
    stageClearTimer: 0,
    countdownTimer: 120,
    difficulty: options.difficulty ?? 'normal',
    twoPlayer: options.twoPlayer ?? false,
    rng: () => rng.next(),
  };
}

export function getTankById(world: GameWorld, id: string): TankEntity | undefined {
  return world.players.find((p) => p.id === id) ?? world.enemies.find((e) => e.id === id);
}

export function brickIntact(q: BrickQuadrants): boolean {
  return q.tl || q.tr || q.bl || q.br;
}

export function countBrickQuadrants(q: BrickQuadrants): number {
  return (q.tl ? 1 : 0) + (q.tr ? 1 : 0) + (q.bl ? 1 : 0) + (q.br ? 1 : 0);
}

export function toHudSnapshot(world: GameWorld) {
  return {
    score: world.score,
    lives: world.lives,
    enemiesRemaining: world.enemiesRemaining,
    stageNumber: world.stageNumber,
    phase: world.phase,
    playerKills: world.playerKills,
    starLevels: [
      world.players[0]?.starLevel ?? 0,
      world.players[1]?.starLevel ?? 0,
    ] as [number, number],
    effects: [...world.effects],
  };
}
