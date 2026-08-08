import { describe, it, expect, beforeEach } from 'vitest';
import { savePlaytestLevel, loadPlaytestLevel } from './playtestLevel';
import { createBlankLevel } from '@/services/level/LevelService';
import { GRID_ROWS, STORAGE_KEYS } from '@/utils/constants';

describe('playtestLevel', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('roundtrips level through session storage', () => {
    const level = createBlankLevel();
    level.name = 'Test Roundtrip';
    savePlaytestLevel(level);
    const loaded = loadPlaytestLevel();
    expect(loaded?.name).toBe('Test Roundtrip');
    expect(loaded?.grid).toHaveLength(GRID_ROWS);
  });

  it('returns null when no playtest saved', () => {
    expect(loadPlaytestLevel()).toBeNull();
  });

  it('returns null for invalid json', () => {
    sessionStorage.setItem(STORAGE_KEYS.playtest, '{invalid');
    expect(loadPlaytestLevel()).toBeNull();
  });
});
