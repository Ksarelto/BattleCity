import type { GameSettings, HudSnapshot } from '@/models';
import { Difficulty, GamePhase } from '@/enums';
import {
  DEFAULT_MUSIC_VOLUME,
  DEFAULT_SFX_VOLUME,
  ENEMIES_PER_STAGE,
  INITIAL_LIVES,
  MAX_HIGH_SCORES,
  STORAGE_KEYS,
} from '@/utils/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  hud: HudSnapshot;
  settings: GameSettings;
  highScores: Array<{ name: string; score: number; stage: number; date: string }>;
  setHud: (hud: HudSnapshot) => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  addHighScore: (entry: { name: string; score: number; stage: number }) => void;
}

const defaultHud: HudSnapshot = {
  score: 0,
  lives: INITIAL_LIVES,
  enemiesRemaining: ENEMIES_PER_STAGE,
  stageNumber: 1,
  phase: GamePhase.countdown,
  playerKills: [0, 0],
  starLevels: [0, 0],
  effects: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      hud: defaultHud,
      settings: {
        difficulty: Difficulty.normal,
        sfxVolume: DEFAULT_SFX_VOLUME,
        musicVolume: DEFAULT_MUSIC_VOLUME,
        muted: false,
      },
      highScores: [],
      setHud: (hud) => set({ hud }),
      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),
      addHighScore: (entry) =>
        set((s) => ({
          highScores: [
            ...s.highScores,
            { ...entry, date: new Date().toISOString() },
          ]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_HIGH_SCORES),
        })),
    }),
    {
      name: STORAGE_KEYS.settings,
      partialize: (s) => ({
        settings: s.settings,
        highScores: s.highScores,
      }),
    },
  ),
);
