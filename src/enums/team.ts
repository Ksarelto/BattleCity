export const Team = {
  player1: 'player1',
  player2: 'player2',
  enemy: 'enemy',
} as const;

export type Team = (typeof Team)[keyof typeof Team];
