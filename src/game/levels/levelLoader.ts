import type { EnemyType, LevelData, TileId } from '@/types/game';
import { buildEnemyRoster } from '@/game/systems/spawnSystem';

const STAGE_ROSTERS: Array<{ basic: number; fast: number; power: number; armor: number }> = [
  { basic: 18, fast: 2, power: 0, armor: 0 },
  { basic: 16, fast: 4, power: 0, armor: 0 },
  { basic: 14, fast: 4, power: 2, armor: 0 },
  { basic: 12, fast: 4, power: 4, armor: 0 },
  { basic: 10, fast: 6, power: 4, armor: 0 },
  { basic: 8, fast: 6, power: 4, armor: 2 },
  { basic: 6, fast: 8, power: 4, armor: 2 },
  { basic: 4, fast: 8, power: 6, armor: 2 },
  { basic: 2, fast: 10, power: 6, armor: 2 },
  { basic: 0, fast: 10, power: 8, armor: 2 },
  { basic: 10, fast: 4, power: 4, armor: 2 },
  { basic: 8, fast: 6, power: 4, armor: 2 },
  { basic: 6, fast: 6, power: 6, armor: 2 },
  { basic: 4, fast: 8, power: 6, armor: 2 },
  { basic: 2, fast: 8, power: 8, armor: 2 },
  { basic: 0, fast: 10, power: 8, armor: 2 },
  { basic: 6, fast: 6, power: 6, armor: 2 },
  { basic: 4, fast: 8, power: 6, armor: 2 },
  { basic: 2, fast: 8, power: 8, armor: 2 },
  { basic: 0, fast: 10, power: 8, armor: 2 },
  { basic: 4, fast: 6, power: 8, armor: 2 },
  { basic: 2, fast: 8, power: 8, armor: 2 },
  { basic: 0, fast: 8, power: 10, armor: 2 },
  { basic: 0, fast: 6, power: 12, armor: 2 },
  { basic: 0, fast: 4, power: 14, armor: 2 },
  { basic: 0, fast: 2, power: 16, armor: 2 },
  { basic: 0, fast: 0, power: 18, armor: 2 },
  { basic: 0, fast: 0, power: 16, armor: 4 },
  { basic: 0, fast: 0, power: 14, armor: 6 },
  { basic: 0, fast: 0, power: 12, armor: 8 },
  { basic: 0, fast: 0, power: 10, armor: 10 },
  { basic: 0, fast: 0, power: 8, armor: 12 },
  { basic: 0, fast: 0, power: 6, armor: 14 },
  { basic: 0, fast: 0, power: 4, armor: 16 },
  { basic: 0, fast: 0, power: 0, armor: 20 },
];

function emptyGrid(): TileId[][] {
  return Array.from({ length: 13 }, () => Array.from({ length: 13 }, () => 'empty' as TileId));
}

function addBaseWalls(grid: TileId[][]): void {
  const bc = 5;
  const br = 11;
  for (let r = br - 1; r <= br + 1; r++) {
    for (let c = bc - 1; c <= bc + 2; c++) {
      if (r === br && c >= bc && c <= bc + 1) continue;
      if (r === br + 1 && c >= bc && c <= bc + 1) continue;
      if (r < 0 || r >= 13 || c < 0 || c >= 13) continue;
      grid[r]![c] = 'brick';
    }
  }
}

function generateStageLayout(stageId: number): TileId[][] {
  const grid = emptyGrid();
  addBaseWalls(grid);

  const seed = stageId * 7919;
  for (let i = 0; i < 8 + (stageId % 5); i++) {
    const col = (seed + i * 17) % 11 + 1;
    const row = (seed + i * 23) % 9 + 1;
    const w = 2 + ((seed + i) % 3);
    const h = 2 + ((seed + i * 2) % 2);
    const tile: TileId = i % 4 === 0 ? 'steel' : i % 3 === 0 ? 'water' : i % 5 === 0 ? 'ice' : 'brick';
    for (let r = row; r < Math.min(row + h, 12); r++) {
      for (let c = col; c < Math.min(col + w, 12); c++) {
        if (r >= 10 && c >= 4 && c <= 7) continue;
        grid[r]![c] = tile;
      }
    }
  }

  for (let i = 0; i < stageId % 4; i++) {
    const col = (seed + i * 31) % 10 + 1;
    const row = (seed + i * 37) % 8 + 2;
    grid[row]![col] = 'bush';
  }

  return grid;
}

export function createLevel(stageId: number, loopCount = 0): LevelData {
  const idx = ((stageId - 1) % 35);
  let rosterCounts = { ...STAGE_ROSTERS[idx]! };
  if (loopCount > 0) {
    rosterCounts.armor = Math.min(20, rosterCounts.armor + loopCount * 2);
    rosterCounts.basic = Math.max(0, rosterCounts.basic - loopCount);
  }

  const enemyRoster = buildEnemyRoster(rosterCounts);

  return {
    id: stageId,
    name: `Stage ${stageId}`,
    grid: generateStageLayout(stageId),
    enemyRoster,
    spawnPoints: [
      { col: 0, row: 0 },
      { col: 6, row: 0 },
      { col: 12, row: 0 },
    ],
    basePosition: { col: 5, row: 11 },
    playerSpawns: [
      { col: 4, row: 12, player: 1 },
      { col: 8, row: 12, player: 2 },
    ],
  };
}

export function loadLevel(stageId: number, loopCount = 0): LevelData {
  return createLevel(stageId, loopCount);
}

export function validateLevel(level: LevelData): string[] {
  const errors: string[] = [];
  if (level.grid.length !== 13) errors.push('Grid must have 13 rows');
  if (level.enemyRoster.length !== 20) errors.push('Enemy roster must have 20 entries');
  if (level.spawnPoints.length !== 3) errors.push('Must have 3 spawn points');
  return errors;
}

export function getAllStageIds(): number[] {
  return Array.from({ length: 35 }, (_, i) => i + 1);
}

export function createBlankLevel(): LevelData {
  const grid = emptyGrid();
  addBaseWalls(grid);
  return {
    id: 0,
    name: 'Custom Level',
    custom: true,
    grid,
    enemyRoster: buildEnemyRoster({ basic: 20, fast: 0, power: 0, armor: 0 }),
    spawnPoints: [
      { col: 0, row: 0 },
      { col: 6, row: 0 },
      { col: 12, row: 0 },
    ],
    basePosition: { col: 5, row: 11 },
    playerSpawns: [{ col: 4, row: 12, player: 1 }],
  };
}

export function parseCustomLevel(json: string): LevelData {
  const data = JSON.parse(json) as LevelData;
  const errors = validateLevel(data);
  if (errors.length) throw new Error(errors.join(', '));
  return data;
}

export type { EnemyType };
