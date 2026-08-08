export const PowerUpType = {
  grenade: 'grenade',
  helmet: 'helmet',
  shovel: 'shovel',
  star: 'star',
  tank: 'tank',
  timer: 'timer',
} as const;

export type PowerUpType = (typeof PowerUpType)[keyof typeof PowerUpType];
