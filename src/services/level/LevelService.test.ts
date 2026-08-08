import { describe, expect, it } from 'vitest';
import stageRosterData from '../../../.spec/data/stage-roster.json';
import { STAGE_COUNT } from '@/utils/constants';
import {
  createBlankLevel,
  createLevel,
  parseCustomLevel,
  validateLevel,
} from '@/services/level/LevelService';
import { buildEnemyRoster } from '@/services/level/enemyRoster';

describe('stage roster JSON', () => {
  it('matches STAGE_COUNT', () => {
    expect(stageRosterData.stages).toHaveLength(STAGE_COUNT);
  });

  it('loads stage 1 roster from JSON source', () => {
    const level = createLevel(1);
    const errors = validateLevel(level);
    expect(errors).toEqual([]);
    expect(level.enemyRoster).toHaveLength(20);
  });

  it('loads stage 35 armor-heavy roster', () => {
    const level = createLevel(35);
    expect(level.enemyRoster.filter((t) => t === 'armor')).toHaveLength(20);
  });

  it('creates valid levels for all stages', () => {
    for (let i = 1; i <= STAGE_COUNT; i++) {
      const level = createLevel(i);
      expect(validateLevel(level)).toHaveLength(0);
    }
  });
});

describe('buildEnemyRoster', () => {
  it('is deterministic with a fixed rng', () => {
    let n = 0;
    const rng = () => {
      n += 0.17;
      return n % 1;
    };
    const a = buildEnemyRoster({ basic: 10, fast: 5, power: 3, armor: 2 }, rng);
    n = 0;
    const b = buildEnemyRoster({ basic: 10, fast: 5, power: 3, armor: 2 }, rng);
    expect(a).toEqual(b);
    expect(a).toHaveLength(20);
  });
});

describe('custom level parsing', () => {
  it('rejects invalid roster length', () => {
    const level = createBlankLevel();
    level.enemyRoster = level.enemyRoster.slice(0, 5);
    expect(validateLevel(level).length).toBeGreaterThan(0);
  });

  it('parses valid custom level json', () => {
    const level = createBlankLevel();
    const parsed = parseCustomLevel(JSON.stringify(level));
    expect(parsed.grid).toHaveLength(20);
    expect(parsed.grid[0]).toHaveLength(35);
  });

  it('throws on invalid custom level', () => {
    expect(() => parseCustomLevel('{}')).toThrow();
  });
});
