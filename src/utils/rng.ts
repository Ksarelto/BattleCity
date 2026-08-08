export class Rng {
  private seed: number;

  constructor(seed = Date.now()) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)]!;
  }
}

export function createRngFromWorld(rng: () => number): { next: () => number; int: (min: number, max: number) => number; pick: <T>(arr: T[]) => T } {
  return {
    next: rng,
    int: (min, max) => Math.floor(rng() * (max - min + 1)) + min,
    pick: <T>(arr: T[]) => arr[Math.floor(rng() * arr.length)]!,
  };
}
