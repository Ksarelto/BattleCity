export const GamePhase = {
  playing: 'playing',
  paused: 'paused',
  stageClear: 'stageClear',
  gameOver: 'gameOver',
  countdown: 'countdown',
} as const;

export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];
