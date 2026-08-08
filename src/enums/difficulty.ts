export const Difficulty = {
  easy: 'easy',
  normal: 'normal',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];
