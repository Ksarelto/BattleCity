export const EnemyType = {
  basic: 'basic',
  fast: 'fast',
  power: 'power',
  armor: 'armor',
} as const;

export type EnemyType = (typeof EnemyType)[keyof typeof EnemyType];
