import type { LevelData } from '@/types/game';
import { parseCustomLevel } from '@/game/levels/levelLoader';

const PLAYTEST_KEY = 'battlecity-playtest';

export function savePlaytestLevel(level: LevelData): void {
  sessionStorage.setItem(PLAYTEST_KEY, JSON.stringify(level));
}

export function loadPlaytestLevel(): LevelData | null {
  const raw = sessionStorage.getItem(PLAYTEST_KEY);
  if (!raw) return null;
  try {
    return parseCustomLevel(raw);
  } catch {
    return null;
  }
}
