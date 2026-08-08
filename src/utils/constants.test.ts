import { describe, it, expect } from 'vitest';
import { isFlashingSpawnIndex, tileBlocksTank } from '@/utils/constants';

describe('constants', () => {
  it('identifies flashing spawn indices', () => {
    expect(isFlashingSpawnIndex(4)).toBe(true);
    expect(isFlashingSpawnIndex(11)).toBe(true);
    expect(isFlashingSpawnIndex(18)).toBe(true);
    expect(isFlashingSpawnIndex(5)).toBe(false);
  });

  it('blocks tanks on water and brick', () => {
    expect(tileBlocksTank('water')).toBe(true);
    expect(tileBlocksTank('ice')).toBe(false);
    expect(tileBlocksTank('bush')).toBe(false);
  });
});
