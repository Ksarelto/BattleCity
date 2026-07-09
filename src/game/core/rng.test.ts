import { describe, it, expect } from 'vitest';
import { Rng } from '@/game/core/rng';

describe('Rng', () => {
  it('produces deterministic sequence with same seed', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    expect(a.next()).toBe(b.next());
    expect(a.next()).toBe(b.next());
  });

  it('int stays within bounds', () => {
    const rng = new Rng(1);
    for (let i = 0; i < 100; i++) {
      const v = rng.int(5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it('pick selects from array', () => {
    const rng = new Rng(99);
    const arr = ['a', 'b', 'c'];
    expect(arr).toContain(rng.pick(arr));
  });
});
