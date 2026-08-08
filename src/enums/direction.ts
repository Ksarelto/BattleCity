export const Direction = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];
