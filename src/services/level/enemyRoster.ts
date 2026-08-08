import type { EnemyType } from '@/models';
import { EnemyType as Enemy } from '@/enums';
import { ENEMIES_PER_STAGE } from '@/utils/constants';

export function buildEnemyRoster(
  counts: {
    basic: number;
    fast: number;
    power: number;
    armor: number;
  },
  rng: () => number = Math.random,
): EnemyType[] {
  const roster: EnemyType[] = [];
  for (let i = 0; i < counts.basic; i++) roster.push(Enemy.basic);
  for (let i = 0; i < counts.fast; i++) roster.push(Enemy.fast);
  for (let i = 0; i < counts.power; i++) roster.push(Enemy.power);
  for (let i = 0; i < counts.armor; i++) roster.push(Enemy.armor);
  while (roster.length < ENEMIES_PER_STAGE) roster.push(Enemy.basic);
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [roster[i], roster[j]] = [roster[j]!, roster[i]!];
  }
  return roster.slice(0, ENEMIES_PER_STAGE);
}
