import type { LevelData } from '@/models';
import { parseCustomLevel } from '@/services/level/LevelService';
import { STORAGE_KEYS } from '@/utils/constants';

export function savePlaytestLevel(level: LevelData): void {
  sessionStorage.setItem(STORAGE_KEYS.playtest, JSON.stringify(level));
}

export function loadPlaytestLevel(): LevelData | null {
  const raw = sessionStorage.getItem(STORAGE_KEYS.playtest);
  if (!raw) return null;
  try {
    return parseCustomLevel(raw);
  } catch {
    return null;
  }
}
