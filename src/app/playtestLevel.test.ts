import { describe, it, expect, beforeEach } from 'vitest';
import { savePlaytestLevel, loadPlaytestLevel } from '@/app/playtestLevel';
import { createBlankLevel, parseCustomLevel, validateLevel } from '@/game/levels/levelLoader';

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
    expect(loaded?.grid).toHaveLength(13);
  });

  it('returns null when no playtest saved', () => {
    expect(loadPlaytestLevel()).toBeNull();
  });

  it('returns null for invalid json', () => {
    sessionStorage.setItem('battlecity-playtest', '{invalid');
    expect(loadPlaytestLevel()).toBeNull();
  });
});

describe('levelLoader validation', () => {
  it('rejects invalid roster length', () => {
    const level = createBlankLevel();
    level.enemyRoster = level.enemyRoster.slice(0, 5);
    expect(validateLevel(level).length).toBeGreaterThan(0);
  });

  it('parses valid custom level json', () => {
    const level = createBlankLevel();
    const parsed = parseCustomLevel(JSON.stringify(level));
    expect(parsed.grid).toHaveLength(13);
  });

  it('throws on invalid custom level', () => {
    expect(() => parseCustomLevel('{}')).toThrow();
  });
});
